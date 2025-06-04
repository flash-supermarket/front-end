<template>
  <div class="background">
    <el-button class="ret-btn">返回</el-button>
    

      <!-- <el-header>Header</el-header> -->
      <el-container class="container">
        <el-aside width="49%" class="left">
          <el-carousel :interval="5000" arrow="hover" height="680px" indicator-position="outside">
            <el-carousel-item v-for="item in itemList" :key="item" class="loop-show">
              <el-image class="img-show"  :src="item.url" fit="contain" />
              <div class="img-explain">{{ item.description }}</div>
            </el-carousel-item>
          </el-carousel>
        </el-aside>
        <el-main class="right" width="49%">
          <div class="user-info">
            <el-avatar size="large" src="" @click="gotoUser(username)" class="info-img"/>
            <div class="info-name">manKobe</div>
            <el-button v-if="isUser==false && isFollowed==true" type="info"
              icon="Operation"
              class="info-btn"
              @click="unFollow">已关注</el-button>
            <el-button v-else type="danger" icon="Plus" @click="followUser" class="info-btn">关注</el-button>
          </div>
        </el-main>
      </el-container>

    


  </div>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { getUsername } from "@/http/cookie";
export default {
  name: "repoPage",

  data() {
    return {
      test_url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      itemList: [{ url:"https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg", description: "测试图片" }],
      info: {
        avatar: "",
        name: "",
        title: "",
        content: "",
      },
      username: "",
      fansList: [],
    };
  },
  methods: {
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
                  (item) => item.username !== info.userName
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
            username: info.userName,
            avatar_url: getAvatarUrl(),
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
    }
  },
  computed: {
    isUser(){
      return true;
    },
    isFollowed(){
      return true;
    }
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
.ret-btn{
  position: absolute;
  top: 1%;
  left: 92%;
}

.container {
  background-color: #ffffff;
  /* 内层背景色 */
  border-radius: 12px;
  /* 圆角大小 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 可选阴影效果 */
  width: 90%;
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
  width: 49%;
}
.right {
  
  padding: 0;
  
}
.loop-show{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.img-show{
  width: 100%;
  height: auto;

}
.img-explain{
  color: white;
  text-align: center;
}
.user-info{
  display: flex;
  /* justify-content: center; */
  align-items: center; 
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
}
.info-img{
  text-align: center;
}
.info-name{
  padding-left: 14px;
  font-size: 20px;
  text-align: center;
  /* font-weight: bold; */
}
.info-btn{
  margin-left:auto;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

</style>