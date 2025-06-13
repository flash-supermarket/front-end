<template>
  <div class="background">
    

    <!-- <el-header>Header</el-header> -->
    <el-container class="container" style="position: relative;">
      <el-button class="ret-btn" @click="retBack" style="position: absolute;z-index: 100;top:5px;left:6px;">返回</el-button>
      <el-aside width="49%" class="left">
        <el-carousel :interval="5000" arrow="hover" height="720px" indicator-position="none">
          <el-carousel-item v-for="item in itemList" :key="item" class="loop-show">
            <el-image class="img-show" :src="item.url" fit="fill" />
            <el-descriptions class="margin-top" :column="2" size="large" :border="true" style="width: 100%">
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon size="12">
                      <Menu/>
                    </el-icon> -->
                    <span>商品名</span>
                  </div>
                </template>
                <span >{{
                  item.name
                }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon size="12">
                      <PriceTag />
                    </el-icon> -->
                    <span>价格</span>
                  </div>
                </template>
                {{ item.price }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon size="12">
                      <office-building />
                    </el-icon> -->
                    <span>简介</span>
                  </div>
                </template>
                {{ item.description.length > 200 ? item.description.substring(0, 200) + "...": item.description }}

              </el-descriptions-item>
            </el-descriptions>
          </el-carousel-item>
        </el-carousel>
      </el-aside>
      <el-main class="right" width="49%">
        <div class="user-info">
          <el-avatar size="large" :src="true_avatar" @click="gotoUser(postInfo.name)" class="info-img" />
          <div class="info-name" style="cursor: pointer;" @click="gotoUser(postInfo.name)">{{ postInfo.name }}</div>
          <el-button v-if="isUser == false && isFollowed == true" type="info" icon="Operation" class="info-btn"
            @click="unFollow">已关注</el-button>
          <el-button v-else-if="isUser==false && isFollowed==false" type="danger" icon="Plus" @click="follow" class="info-btn">关注</el-button>
          <el-button v-else type="primary" icon="Operation" class="info-btn" @click="editArticle">编辑帖子</el-button>
        </div>
        <div class="user-title">
          {{ postInfo.title }}
        </div>
        <div class="user-content">
          {{ postInfo.content }}
        </div>
        <div class="user-option">
          <div class="star-warp">
            <i class="iconfont" v-if="isStarred == true" style="color: #d32626" @click="cancelStar">&#xe626;</i>
            <i class="iconfont" v-else @click="starPost">&#xe626;</i>
            <span class="wrap-item">{{ starNum }}</span>
          </div>
          <div class="collect-wrap">
            <el-icon size="38" class="iconSet" v-if="isCollected == true">
              <StarFilled  class="wrap-item" @click="cancelCollect" />
            </el-icon>
            <el-icon size="38" class="iconSet" style="color:#453e3e;" v-else>
              <Star class="wrap-item" @click="collectPost" />
            </el-icon>
            <span class="wrap-item">{{ collectNum }}</span>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { getAvatarUrl, getUsername } from "@/http/cookie";
import { searchNGoods } from "@/es/searchGoods";
import {
  cancelCollect,
  collectRepo,
  cancelStar,
  starRepo,
  getListLikeById,
  getListCollectById
} from "@/apis/repoPage";
import {  getUserInfo , followUser, unFollowUser} from "@/apis/personPage";
import { search1Artical } from "@/es/createArtical";
import default_avatar from "@/assets/avatar.png";
export default {
  name: "repoPage",

  data() {
    return {
      test_url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      itemList: [
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          description: "测试图片",
          name: "测试商品",
          price: 10,
        },
      ],
      postInfo: {
        //帖子的主人的信息
        avatar: "",
        name: "",
        title: "",
        content: "this is a test content",
        repoId: "",
        fansList: [],
        starPersonList: [],
        collectPersonList: [],
      },
      myInfo: {
        username: "", // 访问者的名字
      },

      iconSize: 20,
    };
  },
  methods: {
    unFollow() {
      ElMessageBox.confirm(
        `你确定要取消关注 ${this.postInfo.name} 吗？`,
        "Warning",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const info = {
            userName: this.myInfo.username,
            followName: this.postInfo.name,
          };
          unFollowUser(info)
            .then((res) => {
              if (res.code === 200) {
                ElMessage.success("取关成功！");
                this.postInfo.fansList = this.postInfo.fansList.filter(
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
    follow() {
      const info = {
        userName: this.myInfo.username,
        followName: this.postInfo.name,
      };
      followUser(info)
        .then((res) => {
          console.log(res)
          if (res.code === 200) {
            ElMessage.success("关注成功！");
            this.postInfo.fansList.push({
              userName: info.userName,
              avatar: "",
            });
          } else {
            ElMessage.error("关注失败！");
            console.log(res);
          }
        })
        .catch((error) => {
          console.error("Error following user:", error);
          ElMessage.error("An error occurred while following the user");
        });
    },
    gotoUser(username) {
      this.$router.push("/person/" + username);
    },
    retBack() {
      this.$router.go(-1);
    },
    cancelStar() {
      const data = {
        userName: this.myInfo.username,
        repositoryId: this.postInfo.repoId,
      };
      cancelStar(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.starPersonList = this.postInfo.starPersonList.filter(
            (item) => item !== data.userName
          );
          ElMessage.success("取消点赞成功！");
        } else {
          ElMessage.error("取消点赞失败！");
        }
      });
    },
    starPost() {
      const data = {
        userName: this.myInfo.username,
        repositoryId: this.postInfo.repoId,
      };
      starRepo(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.starPersonList.push(data.userName);
          ElMessage.success("点赞成功！");
        } else {
          ElMessage.error("点赞失败！");
        }
      });
    },
    cancelCollect() {
      const data = {
        userName: this.myInfo.username,
        repositoryId: this.postInfo.repoId,
      };
      cancelCollect(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.collectPersonList = this.postInfo.collectPersonList.filter(
            (item) => item != data.userName
          );
          ElMessage.success("取消收藏成功！");
        } else {
          ElMessage.error("取消收藏失败！");
        }
      });
    },
    collectPost() {
      const data = {
        userName: this.myInfo.username,
        repositoryId: this.postInfo.repoId,
      };
      collectRepo(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.collectPersonList.push(data.userName);
          ElMessage.success("收藏成功！");
        } else {
          ElMessage.error("收藏失败！");
        }
      });
    },
    editArticle(){
      this.$router.push('/create/'+this.postInfo.repoId)

    }
  },
  computed: {
    isUser() {
      return this.postInfo.name === this.myInfo.username;
    },
    isFollowed() {
      return this.postInfo.fansList.some((item) => item.userName === this.myInfo.username);
    },
    isCollected() {
      return this.postInfo.collectPersonList.includes(this.myInfo.username);
    },
    isStarred() {
      return this.postInfo.starPersonList.includes(this.myInfo.username);
    },
    starNum(){
      return this.postInfo.starPersonList.length;
    },
    collectNum(){
      return this.postInfo.collectPersonList.length;
    },
    true_avatar(){
      // if(this.postInfo.avatar === ""|| this.postInfo.avatar === null||this.postInfo.avatar === undefined){
      //   return default_avatar;
      // }else return this.postInfo.avatar;
      return default_avatar;
    },
    
  },
  mounted() {
    //postInfo
    this.postInfo.repoId = parseInt(this.$route.params.repoId);
    console.log(this.postInfo.repoId);
    search1Artical(this.postInfo.repoId).then((res) => {
      console.log(res);
      this.postInfo.name = res._source.userName;
      this.postInfo.title = res._source.title;
      this.postInfo.content = res._source.description;
      this.itemList = [];
      for (let item of res._source.body) {
        const goods = {
          name: item.name,
          description: item.description.join(""),
          url: item.image,
          price: item.price,
          id: item.id,
          category: item.category,
        };
        this.itemList.push(goods);

        getUserInfo(this.postInfo.name).then((res) => {
      if (res.code === 200) {
        const data = res.data;
        this.postInfo.avatar = data.avatar;
        this.postInfo.fansList = data.fans;
        console.log(this.postInfo.fansList);
      } else {
        ElMessage.error("Failed to fetch user information");
        console.log(res);
      }
    })
      .catch((error) => {
        console.error("Error fetching user information:", error);
        ElMessage.error("An error occurred while fetching user information");
      });
      }
    });
    //postInfo.fansList,  postInfo.starList, postInfo.collectList, postInfo.avatar
    
    getListLikeById(this.postInfo.repoId).then((res) => {
      console.log(res);
      if (res.code === 200) {
        this.postInfo.starPersonList = res.data;
        // console.log(this.postInfo.starPersonList);
      }
    })
    //getListCollectById
    getListCollectById(this.postInfo.repoId).then((res) => {
      if(res.code === 200){
        this.postInfo.collectPersonList = res.data;
      }
    })
    //myInfo
    this.myInfo.username = getUsername();
    console.log("my name:", this.myInfo.username)
  },
};
</script>

<style scoped>
.background {
  margin: 0;
  padding: 10px;
  height: 100%;
  width: 100%;
  background-color: #f0f0f0;
  position: relative;
  /* 外层背景色 */
}

/* .ret-btn {
  position: absolute;
  top: 1%;
  left: 92%;
} */

.container {
  background-color: #ffffff;
  /* 内层背景色 */
  border-radius: 12px;
  /* 圆角大小 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 可选阴影效果 */
  width: 70%;
  /* 宽度控制 */
  max-width: 1200px;
  /* 最大宽度 */
  min-height: 87vh;
  /* 最小高度 */
  margin: 5vh auto;
  /* 垂直居中 */
  padding-bottom: 5px;
  /* 内边距 */
}

.left {
  background-color: #1c2024;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  width: 60%;
}

.right {
  padding: 0;
  overflow: hidden;
  border-left:#f0f0f0 1px;
  border-left-style: dashed;

}

.loop-show {
  display: flex;

  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
}

.cell-item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.img-show {
  width: 100%;
  height: auto;
}

.img-explain {
  color: white;
  text-align: center;
}

.user-info {
  overflow: hidden;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
}
.user-title{
  margin-bottom: 8px;
    font-weight: 600;
    font-size: 18px;
    line-height: 140%;
    padding: 0 10px;
}
.user-content {
  overflow: hidden;
  /* border-top: #afb1b4 solid 1px; */

  margin: 5px 10px;
  padding: 5px 0;
  height: 70%;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: var(--color-primary-label);
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.user-option {
  overflow: hidden;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  margin: 10px;
  padding: 10px 0;
  height: 46px;
}

.star-warp {
  display: flex;
  justify-content: center;
  align-items: center;
}

.collect-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 14px;
  margin-right: 4px;
}

.iconfont {
  cursor: pointer;
}

.iconSet {
  cursor: pointer;
  color: rgb(245, 188, 90);
}

.wrap-item {
  margin-left: 4px;
}

.info-img {
  text-align: center;
}

.info-name {
  padding-left: 14px;
  font-size: 20px;
  text-align: center;
  /* font-weight: bold; */
}

.info-btn {
  margin-left: auto;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}
</style>