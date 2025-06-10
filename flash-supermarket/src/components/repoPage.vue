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
              size="large"
              :border="true"
              style="width: 100%"

            >
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <!-- <el-icon size="12">
                      <Menu/>
                    </el-icon> -->
                    <span>商品名</span>
                  </div>
                </template>
                <span style="font-weight: bold; font-size: 16px">{{
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
                {{ item.description }}
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
            @click="gotoUser(postInfo.name)"
            class="info-img"
          />
          <div class="info-name">{{ postInfo.name }}</div>
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
          {{ postInfo.content }}
        </div>
        <div class="user-option">
          <div class="star-warp">
            <i
              class="iconfont"
              v-if="isStarred == true"
              style="color: #d32626"
              @click="cancelStar"
              >&#xe626;</i
            >
            <i class="iconfont" v-else @click="starPost">&#xe626;</i>
            <span class="wrap-item">{{ postInfo.starNum }}</span>
          </div>
          <div class="collect-wrap">
            <el-icon size="38" class="iconSet">
              <StarFilled
                v-if="isCollected == true"
                class="wrap-item"
                @click="cancelCollect"
              />
              <Star v-else class="wrap-item" @click="collectPost" />
            </el-icon>
            <span>{{ postInfo.collectNum }}</span>
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
import {
  cancelCollect,
  collectRepo,
  cancelStar,
  starRepo,
} from "@/apis/repoPage";
import { getListCollect, getListStar } from "@/apis/personPage";
  import {search1Artical} from "@/es/createArtical";
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
        starNum: "12",
        collectNum: "13",
      },
      myInfo:{
        username: "", // 访问者的名字
        collectList: [],
        starList: [],
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
        userName: this.myInfo.username,
        followName: this.postInfo.name,
      };
      followUser(info)
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success("关注成功！");
            this.postInfo.fansList.push({
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
      this.$router.push("/person/" + username);
    },
    retBack() {
      this.$router.go(-1);
    },
    getCollectStarInterface() {
      const info = {
        userName: this.myInfo.username,
        repositoryId: this.postInfo.repoId,
      };
      return info;
    },
    cancelStar() {
      const data = this.getCollectStarInterface();
      cancelStar(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.starNum--;
          this.myInfo.starList = this.myInfo.starList.filter(
            (item) => item.repositoryId !== data.repositoryId
          );
          ElMessage.success("取消点赞成功！");
        } else {
          ElMessage.error("取消点赞失败！");
        }
      });
    },
    starPost() {
      const data = this.getCollectStarInterface();
      starRepo(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.starNum++;
          this.myInfo.starList.push(data.repositoryId);
          ElMessage.success("点赞成功！");
        } else {
          ElMessage.error("点赞失败！");
        }
      });
    },
    cancelCollect() {
      const data = this.getCollectStarInterface();
      cancelCollect(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.collectNum--;
          this.myInfo.collectList = this.myInfo.collectList.filter(
            (item) => item.repositoryId !== data.repositoryId
          );
          ElMessage.success("取消收藏成功！");
        } else {
          ElMessage.error("取消收藏失败！");
        }
      });
    },
    collectPost() {
      const data = this.getCollectStarInterface();
      collectRepo(data).then((res) => {
        if (res.code === 200) {
          this.postInfo.collectNum++;
          this.myInfo.collectList.push(data.repositoryId);
          ElMessage.success("收藏成功！");
        } else {
          ElMessage.error("收藏失败！");
        }
      });
    },
  },
  computed: {
    isUser() {
      return this.postInfo.name === this.myInfo.username;
    },
    isFollowed() {
      return this.postInfo.fansList.some((item) => item.username === this.myInfo.username);
    },
    isCollected() {
      return this.myInfo.collectList.includes(this.postInfo.repoId);
    },
    isStarred() {
      return this.myInfo.starList.includes(this.postInfo.repoId);
    },
  },
  mounted() {
    search1Artical().then((res) => {
      console.log(res);
      this.postInfo.name = res._source.userName;
      this.postInfo.title = res._source.title;
      this.postInfo.content = res._source.description;
      this.postInfo.repoId = res._source.id;
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
        }


    });
    //myInfo
    this.myInfo.username = getUsername();
    getListCollect(this.myInfo.username).then((res) => {
      if(res.code === 200){
        const data = res.data;
        this.myInfo.collectList = data;
      }else{
        console.error("Error fetching collect list:", res.message);
      }
    });
    getListStar(this.myInfo.username).then((res) => {
      if(res.code === 200){
        const data = res.data;
        this.myInfo.starList = data;
      }else{
        console.error("Error fetching star list:", res.message);
      }
    })

    //postInfo
    this.postInfo.repoId = this.$route.params.repoId;
    // es to get the whole repoInfo

    // const num = 2;
    // searchNGoods(num)
    //   .then((res) => {
    //     console.log(res);
    //     this.itemList = [];
    //     for (let item of res) {
    //       const goods = {
    //         name: item._source.title,
    //         description: item._source.description.join(""),
    //         url: item._source.images[0].large,
    //         price: item._source.price,
    //         id: item._id,
    //         category: item._source.main_category,
    //       };
    //       this.itemList.push(goods);
    //     }
    //     // console.log(this.itemList)
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
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
  align-items: center;
  flex-direction: column;
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