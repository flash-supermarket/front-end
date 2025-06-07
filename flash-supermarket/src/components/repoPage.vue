<template>
  <div class="background">
    <el-button class="ret-btn" @click="retBack">返回</el-button>

    <!-- <el-header>Header</el-header> -->
    <el-container class="container">
      <el-aside width="49%" class="left">
        <el-carousel
          :interval="5000"
          arrow="hover"
          height="680px"
          indicator-position="outside"
        >
          <el-carousel-item
            v-for="item in itemList"
            :key="item"
            class="loop-show"
          >
            <el-image class="img-show" :src="item.url" fit="contain" />
            <el-descriptions
              class="margin-top"
              :column="2"
              size="small"
              :border=true
            >
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon size="12">
                      <Menu/>
                    </el-icon>
                    Name
                  </div>
                </template>
            {{ item.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon size="12">
                      <PriceTag />
                    </el-icon>
                    Price
                  </div>
                </template>
                {{item.price}}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon size="12">
                      <office-building />
                    </el-icon>
                    Description
                  </div>
                </template>
                {{item.description}}
              </el-descriptions-item>
            </el-descriptions>
          </el-carousel-item>
        </el-carousel>
      </el-aside>
      <el-main class="right" width="49%">
        <div class="user-info">
          <el-avatar
            size="large"
            src=""
            @click="gotoUser(username)"
            class="info-img"
          />
          <div class="info-name">manKobe</div>
          <el-button
            v-if="isUser == false && isFollowed == true"
            type="info"
            icon="Operation"
            class="info-btn"
            @click="unFollow"
            >已关注</el-button
          >
          <el-button
            v-else
            type="danger"
            icon="Plus"
            @click="followUser"
            class="info-btn"
            >关注</el-button
          >
        </div>
        <div class="user-content">
          {{ info.content }}
        </div>
        <div class="user-option">
          <div class="star-warp">
            <i class="iconfont" v-if="isStarred == true" style="color: #d32626"
              >&#xe626;</i
            >
            <i class="iconfont" v-else>&#xe626;</i>
            <span class="wrap-item">{{ starNum }}</span>
          </div>
          <div class="collect-wrap">
            <el-icon size="35" class="iconSet">
              <StarFilled v-if="isCollected == true" class="wrap-item" />
              <Star v-else class="wrap-item" />
            </el-icon>
            <span>{{ collectNum }}</span>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";
import { getUsername } from "@/http/cookie";
import { searchNGoods } from "@/es/searchGoods";
export default {
  name: "repoPage",

  data() {
    return {
      test_url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      itemList: [
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
          description: "测试图片",
          name: "测试商品",
          price: 10,
        },
      ],
      info: {
        avatar: "",
        name: "",
        title: "",
        content: "this is a test content",
      },
      repoId: "",
      username: "",
      fansList: [],
      collectList: [],
      starList: [],
      starNum: "12",
      collectNum: "13",
      iconSize: 20,
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
      };
      followUser(info)
        .then((res) => {
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
        })
        .catch((error) => {
          console.error("Error following user:", error);
          ElMessage.error("An error occurred while following the user");
        });
    },
    gotoUser(username) {
      this.$router.push("/personPage/" + username);
    },
    retBack() {
      this.$router.go(-1);
    },
  },
  computed: {
    isUser() {
      return getUsername() === this.username;
    },
    isFollowed() {
      return this.fansList.some((item) => item.username === this.username);
    },
    isCollected() {
      return true;
    },
    isStarred() {
      return true;
    },
  },
  mounted() {
    const num = 2;
    searchNGoods(num)
      .then((res) => {
        console.log(res);
        for(item in res) {
          const info = {};
          info.url = item._source.
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    // const repoId = this.$route.params.repoId;
    // getRepoInfoById(repoId)
    //   .then((res) => {
    //     if (res.code === 200) {
    //       this.info = res.data[0];
    //       this.username = this.info.name
    //     }
    // })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
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
.ret-btn {
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
}
.loop-show {
  display: flex;
  justify-content: center;
  /* align-items: center; */
  flex-direction: column;
}
.cell-item {
  display: flex;
  align-items: center;
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
.user-content {
  overflow: hidden;
  border-top: #afb1b4 solid 1px;

  margin: 10px 10px;
  padding: 10px 0;
  height: 70%;
}
.user-option {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-top: #afb1b4 solid 1px;
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
}
.iconfont {
  cursor: pointer;
}
.iconSet {
  cursor: pointer;
  color: #e1df5c;
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