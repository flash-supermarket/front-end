<template>
  <div class="common-layout">
    <top-bar style="margin-bottom: 12px"></top-bar>
    <el-dialog
      v-model="dialogFormVisible"
      title="编辑个人信息"
      width="500"
      @close="dialogFormVisible = false"
    >
      <el-form>
        <el-form-item label="new password" :label-width="formLabelWidth">
          <el-input
            v-model="form.password"
            style="width: 240px"
            type="password"
            placeholder="Please input password"
            show-password
          />
        </el-form-item>
        <el-form-item label="new description" :label-width="formLabelWidth">
          <el-input
            v-model="form.description"
            maxlength="50"
            style="width: 240px"
            placeholder="Please input"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false" type="warning"
            >取消</el-button
          >
          <el-button type="primary" @click="confirmEdit"> 提交修改 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-container class="main-container">
      <el-aside width="200px">
        <!--side bar-->
        <div class="demo-collapse">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item title="Following" name="1">
              <div v-for="item in followingList" :key="item.id">
                <el-avatar :src="item.avatar_url" size="small"></el-avatar>
                <span>{{ item.username }}</span>
              </div>
            </el-collapse-item>
            <el-collapse-item title="Follower" name="2">
              <div v-for="item in fansList" :key="item.id">
                <el-avatar :src="item.avatar_url" size="small"></el-avatar>
                <span>{{ item.username }}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-aside>
      <el-container>
        <el-header height="auto">
          <div class="user-info">
            <el-avatar :src="avatar_url" :size="80"></el-avatar>
            <div>
              <h2>{{ username || "Username" }}</h2>
              <div class="user-description">
                {{ description || "No description available" }}
              </div>
            </div>

            <el-button
              v-if="isOwner == true"
              icon="Edit"
              type="primary"
              @click="editInfo"
              style="margin-right: 10px; margin-left: auto"
            >
              编辑个人信息
            </el-button>
            <el-button
              v-else-if="isFollowed == true"
              type="info"
              icon="Operation"
              @click="unFollow"
              style="margin-right: 10px; margin-left: auto"
            >
              已关注
            </el-button>
            <el-button v-else type="danger" icon="Plus" @click="followUser" style="margin-right: 10px; margin-left: auto">
              关注
            </el-button>
          </div>
        </el-header>
        <el-main>
          <div class="repo-list">
            <div
              v-for="repo in paginatedBoxes"
              :key="repo.title"
              class="repo-item"
            >
              <h3>{{ repo.title }}</h3>
              <p>Details about {{ repo.title }}...</p>
            </div>
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :hide-on-single-page="false"
              :page-count="totalPage"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
            />
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
import { getUsername , getAvatarUrl} from "../http/cookie";
import { ElMessage } from "element-plus";
import { ElMessageBox } from "element-plus";
export default {
  name: "personPage",
  components: {
    topBar,
  },
  data() {
    return {
      username: "",
      description: "",
      avatar_url: "",
      password: "",
      activeName: "1",
      repoList: [
        { title: "Repo 1" },
        { title: "Repo 2" },
        { title: "Repo 3" },
        { title: "Repo 4" },
        { title: "Repo 5" },
        { title: "Repo 6" },
        { title: "Repo 7" },
        { title: "Repo 8" },
        { title: "Repo 9" },
        { title: "Repo 10" },
        { title: "Repo 11" },
        { title: "Repo 12" },
      ],
      pageSize: 5, // Changed from 8 to 6
      currentPage: 1,
      followingList: [{ avatar_url: "", username: "User1" }],
      fansList: [{ avatar_url: "", username: "User2" }],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      form: {
        username: "",
        password: "",
        description: "",
        avatar: "",
      },
    };
  },
  methods: {
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
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
      return this.fansList.some((item) => item.username === this.username);
    },
  },
  mounted() {
    this.username = this.$route.params.username;
    // getUserRepos(this.username).then((res) => {
    //   this.repoList = res.data;
    // });
    getUserInfo(this.username)
      .then((res) => {
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
  },
};
</script>

<style scoped>
.common-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.el-container {
  max-width: 1200px;
  margin: 0 auto;
  overflow: auto;
  max-height: 88vh;
}
.main-container {
  margin: 0 200px;
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
  background-color: #ffffff;
  border-top-right-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-description {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
  max-width: 400px; /* Limit the width of the description */
  line-height: 1.5; /* Improve readability */
  white-space: normal; /* Allow text to wrap */
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

.el-main {
  background-color: transparent;
  padding: 0;
  overflow: hidden;
  max-height: 85vh;
}

.repo-list {
  display: flex;
  flex-direction: column;
  gap: 19px;
  margin-bottom: 24px;
}

.repo-item {
  background-color: #ffffff;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.repo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.repo-item h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.repo-item p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.el-pagination {
  margin-bottom: auto;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: #ffffff;
  border-bottom-right-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.el-pagination :deep(.el-pager li) {
  font-size: 14px;
  margin: 0 4px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.el-pagination :deep(.el-pager li:hover) {
  background-color: #f0f0f0;
}

.el-pagination :deep(.el-pager li.is-active) {
  background-color: #409eff;
  color: #ffffff;
}

.el-pagination :deep(.btn-prev),
.el-pagination :deep(.btn-next) {
  font-size: 14px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.el-pagination :deep(.btn-prev:hover),
.el-pagination :deep(.btn-next:hover) {
  background-color: #f0f0f0;
}

.el-pagination :deep(.el-pagination__jump) {
  font-size: 14px;
  margin: 0 8px;
}

.el-pagination :deep(.el-pagination__total) {
  font-size: 14px;
  margin-left: 8px;
}
</style>