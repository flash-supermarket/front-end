<template>
  <div class="common-layout">
    <top-bar style="margin-bottom: 12px"></top-bar>
    <el-dialog v-model="dialogFormVisible" title="编辑个人信息" width="500" @close="dialogFormVisible = false">
      <el-form>
        <el-form-item label="new password" :label-width="formLabelWidth">
          <el-input v-model="form.password" style="width: 240px" type="password" placeholder="Please input password"
            show-password />
        </el-form-item>
        <el-form-item label="new description" :label-width="formLabelWidth">
          <el-input v-model="form.description" maxlength="50" style="width: 240px" placeholder="Please input"
            show-word-limit type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false" type="warning">取消</el-button>
          <el-button type="primary" @click="confirmEdit"> 提交修改 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false" direction="ltr" size="200">
      <div class="drawer-wrap">
        <span style="display: block;cursor: pointer;"
          :style="{ 'font-weight': drawerShowType === 0 ? 'bold' : 'normal', 'color': drawerShowType === 0 ? '#FF0000' : '#000000' }"
          @click="openDraw(0)">粉丝列表</span>
        <span style="display: block;cursor: pointer;"
          :style="{ 'font-weight': drawerShowType === 1 ? 'bold' : 'normal', 'color': drawerShowType === 1 ? '#FF0000' : '#000000' }"
          @click="openDraw(1)">关注列表</span>
        <div id="showedList">
          <div v-for="item in showList" :key="item.username"
            style="display: flex; align-items: center;margin-top: 15px;">
            <el-avatar :src="item.avatar_url" style="margin-right: 12px"></el-avatar>
            <span>{{ item.username }}</span>
          </div>
        </div>
      </div>

    </el-drawer>
    <el-container class="main-container">

      <el-container>
        <el-header height="auto">
          <div class="user-info">
            <el-avatar :src="avatar_url" :size="150" style="margin-right:24px"></el-avatar>
            <div style="max-width: 30%;">
              <h2 style="font-size: 24px;font-weight: 600;line-height: 120%;">{{ username || "Username" }}</h2>
              <div class="user-description">
                {{ description || "No description available" }}
              </div>
              <div class="fan-follow-wrap">
                <div class="fan-follow-wrap-item">
                  <span class="count">{{ followNum  }}</span>
                  <span class="show" @click="openDraw(1)">关注</span>
                </div>
                <div class="fan-follow-wrap-item">
                  <span class="count">{{ fanNum  }}</span>
                  <span class="show" @click="openDraw(0)">粉丝</span>
                </div>
              </div>
            </div>

            <el-button v-if="isOwner == true" icon="Edit" type="primary" @click="editInfo" class="info-btn">
              编辑个人信息
            </el-button>
            <el-button v-else-if="isFollowed == true" type="info" icon="Operation" @click="unFollow" class="info-btn">
              已关注
            </el-button>
            <el-button v-else type="danger" icon="Plus" @click="followUser" class="info-btn">
              关注
            </el-button>
          </div>
        </el-header>
        <el-main>
          <div class="type-wrap">
            <el-button class="btn" round text type="plain" v-if="postShowType == 1"
              @click="changePostList(0)">笔记</el-button>
            <el-button class="btn choosen" round bg type="plain" v-else @click="changePostList(0)">笔记</el-button>

            <el-button class="btn" round text type="plain" v-if="postShowType == 0 && isOwner == true"
              @click="changePostList(1)">收藏</el-button>
            <el-button class="btn choosen" round bg type="plain" v-else-if="postShowType == 1 && isOwner == true"
              @click="changePostList(1)">收藏</el-button>
            <el-button class="btn" round text type="plain" v-else disabled><el-icon>
                <Lock />
              </el-icon>收藏</el-button>
          </div>
          <div class="main-content-wrap">

            <div class="post-wrap">
              <div class="post-container" v-if="no_Posts==false">
                <PostCard v-for="(post, i) in showPostList" :key="i" :post="post"/>
              </div>
              <div v-else>没有任何帖子</div>
             


            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  getUserRepos,
  getUserInfo,
  editUserInfo,
  unFollowUser,
  followUser,
} from "@/apis/personPage.js";
import topBar from "./topBar.vue";
import { getUsername, getAvatarUrl } from "../http/cookie";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
import default_avatar from "../assets/avatar.png"
import PostCard from "./post.vue";
export default {
  name: "personPage",
  components: {
    topBar,
    PostCard,
  },
  data() {
    return {
      username: "",
      description: "发撒赖打开附件是老大开发建设狄拉克发生的理发卡塑料袋放进啊十六分螺丝钉咖啡碱啊阿萨的浪费空间受到了开发技术的",
      password: "",
      my_avatar: "",
      followingList: [{ avatar_url: "", username: "User1" }, { avatar_url: "", username: "User2" }],
      fansList: [{ avatar_url: "", username: "User2" }, { avatar_url: "", username: "User2" }],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        username: "",
        password: "",
        description: "",
        avatar: "",
      },
      drawer: false,
      drawerShowType: 0, //0粉丝，1关注

      postShowType: 0, //0自己的文章，1收藏文章
      myPostList: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
      myCollectPostList: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
    };
  },
  methods: {
    editInfo() {
      this.form.password = this.password;
      this.form.description = this.description;
      this.dialogFormVisible = true;
    },
    confirmEdit() {
      if (this.form.password === "") {
        ElMessage.error("Password cannot be empty");
        return;
      } else if (
        this.form.password === this.password &&
        this.form.description === this.description
      ) {
        ElMessage.warning("No changes made");
        this.dialogFormVisible = false;
      } else {
        const newInfo = {
          userName: this.username,
          passWord: this.form.password,
          description: this.form.description,
          avatar: this.avatar_url,
        };
        editUserInfo(newInfo)
          .then((res) => {
            if (res.code === 200) {
              ElMessage.success("User information updated successfully");
              this.dialogFormVisible = false;
              // Update local data
              this.password = this.form.password;
              this.description = this.form.description;
              // this.avatar_url = this.form.avatar;
            } else {
              ElMessage.error("Failed to update user information");
              console.log(res);
            }
          })
          .catch((error) => {
            console.error("Error updating user information:", error);
            ElMessage.error(
              "An error occurred while updating user information"
            );
          });
      }
    },
    unFollow() {
      ElMessageBox.confirm(
        `你确定要取消关注 ${this.username} 吗？`,
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const info = {
            userName: getUsername(),
            followName: this.username,
          };
          unFollowUser(info)
            .then((res) => {
              if (res.code === 200) {
                ElMessage.success("取关成功！");
                this.fansList = this.fansList.filter(
                  (item) => item.userName !== info.userName
                );
              } else {
                ElMessage.error("取关失败！");
                console.log(res);
              }
            })
            .catch((error) => {
              console.error("Error unfollowing user:", error);
              ElMessage.error("An error occurred while unfollowing the user");
            });
        })
        .catch(() => {
          ElMessage.info("取消操作");
          return;
        });
    },
    followUser() {
      const info = {
        userName: getUsername(),
        followName: this.username,
      }
      followUser(info).then((res) => {
        if (res.code === 200) {
          ElMessage.success("关注成功！");
          this.fansList.push({
            userName: info.userName,
            avatar: "",
          });
        } else {
          ElMessage.error("关注失败！");
          console.log(res);
        }
      }).catch((error) => {
        console.error("Error following user:", error);
        ElMessage.error("An error occurred while following the user");
      });
    },
    gotoUser(username) {
      this.$router.push("/personPage/" + username);
    },
    openDraw(num) {
      this.drawer = true;
      this.drawerShowType = num;
      this.showList = num === 0 ? this.fansList : this.followingList;
    },
    changePostList(num) {
      this.postShowType = num;
    }

  },
  computed: {
    totalPage() {
      return Math.ceil(this.repoList.length / this.pageSize);
    },
    paginatedBoxes() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.repoList.slice(startIndex, endIndex);
    },
    isOwner() {
      return getUsername() === this.username;
    },
    // Check if the user is followed by the current user
    isFollowed() {
      return this.fansList.some((item) => item.userName === this.username);
    },
    drawerTitle() {
      return this.drawerShowType === 0 ? "粉丝列表" : "关注列表";
    },
    showList() {
      return this.drawerShowType === 0 ? this.fansList : this.followingList;
    },
    showPostList() {
      return this.postShowType === 0 ? this.myPostList : this.myCollectPostList;
    },
    fanNum(){
      return this.fansList.length;
    },
    followNum(){
      return this.followingList.length;
    },
    avatar_url(){
      if(this.my_avatar==""||this.my_avatar==null){
        return default_avatar;
      }else{
        return this.my_avatar;
      }
    },
    no_Posts(){
      return this.showPostList.length === 0;
    }

  },
  mounted() {
    this.username = this.$route.params.username;
    getUserInfo(this.username).then((res) => {
        console.log(res);
        if (res.code === 200) {
          const data = res.data;
          this.password = data.passWord;
          this.avatar_url = data.avatar;
          this.description = data.description;
          this.followingList = data.follows;
          this.fansList = data.fans;

          this.form.username = this.username;
          this.form.description = this.description;
          this.form.avatar = this.avatar_url;
          this.form.password = this.password;
        } else {
          ElMessage.error("Failed to fetch user information");
          console.log(res);
        }
      })
      .catch((error) => {
        console.error("Error fetching user information:", error);
        ElMessage.error("An error occurred while fetching user information");
      });
    
      //getUserRepos
      //getUserCollectRepos
  },
};
</script>

<style scoped>
.common-layout {
  height: 100vh;

  background-color: #f5f5f5;
  overflow-x: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none;
  /* IE/Edge 隐藏滚动条 */


}

.el-container {
  width: calc(100vw - 200px);
  margin: 0 auto;
}



.el-aside {
  background-color: #ffffff;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-right: 10px;
}

.demo-collapse {
  border: none;
}

.el-collapse-item__header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding: 10px;
  border-bottom: 1px solid #e5e5e5;
}

.el-collapse-item__content {
  padding: 10px;
}

.el-collapse-item__content div {
  display: flex;
  align-items: center;
  padding: 8px 0;
  transition: background-color 0.2s;
}

.el-collapse-item__content div:hover {
  background-color: #f9f9f9;
  border-radius: 4px;
}

.el-collapse-item__content .el-avatar {
  margin-right: 10px;
}

.el-collapse-item__content span {
  font-size: 14px;
  color: #555;
}

.el-header {
  /* background-color: #ffffff; */
  border-top-right-radius: 8px;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
}

/* .drawer-wrap{
  

} */
#showedList {
  margin-top: 10px;
  padding: 10px;
  border-radius: 5px;
}

.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

}

.info-btn {
  margin-left: 30px;
}

.user-description {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
  max-width: 400px;
  /* Limit the width of the description */
  line-height: 1.5;
  /* Improve readability */
  white-space: normal;
  /* Allow text to wrap */
}

.user-info .el-avatar {
  border: 2px solid #e5e5e5;
}

.user-info h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.user-info p {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0;
}

.fan-follow-wrap {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: row;
}

.fan-follow-wrap-item {
  margin-right: 5px;
}

.fan-follow-wrap-item .count {
  font-weight: 500;
  font-size: 14px;
  margin-right: 4px;
}

.fan-follow-wrap-item .show {
  color: #aa8d8d;
  font-size: 14px;
  line-height: 120%;
  cursor: pointer;
}

.el-main {
  background-color: transparent;
  padding: 0;


  /* max-height: 85vh; */
}

.main-content-wrap {
  overflow-x: scroll;
  scrollbar-width: none;
  /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none;
  /* IE/Edge 隐藏滚动条 */

}

.type-wrap {
  display: flex;
  justify-content: center;
  /* 当元素到达 top: 0 时固定 */
  background-color: #f5f5f5;
  padding: 10px 0;
}

.type-wrap .choosen {
  background-color: rgb(247, 247, 247);
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.type-wrap .btn:hover {
  background-color: rgb(247, 247, 247);
}

.post-wrap {
  overflow-x: scroll;

  scrollbar-width: none;
  padding: 16px;
  /* min-width: 1000px; */
  color: #333;
  /* display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center; */
}
.post-container {
  margin: 0 auto; 
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center; 
}


.follow-fan-item {
  cursor: pointer;
}
</style>