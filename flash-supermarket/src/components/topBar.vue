<template>
    <div class="header" :style="{ backgroundColor: `rgba(255, 255, 255, ${props.opacityValue})`, boxShadow: `0px 0px ${props.opacityValue*2}px grey inset`}">
        <div class="header-logo">
            <img src="/shophub-title.png" class="logo" @click="gotoHome" style="width:150px;height:50px;margin-top:8px;margin-left:20px; cursor: pointer;" :style="{ display: showName ? 'inline-block' : 'none' }">
        </div>
        <div class="header-navigation">
            <div class="navigation-bar" @click="gotoCreate" :style="{color: `rgb(${(1 - props.opacityValue) * 255}, ${(1 - props.opacityValue) * 255}, ${(1 - props.opacityValue) * 255})`,left: showName ? '170px' : '0px', top: '1px'}">创建清单</div>
        </div>
        <div class="header-login">  
            <button v-if="!login_status" class="login-button" @click="gotoLogin">登录/注册</button>
            <el-dropdown v-else placement="bottom">
                <el-avatar class="login-avatar" :size="36" fit="cover" src="/shophub.png">
                </el-avatar>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="gotoPerson">个人中心</el-dropdown-item>
                        <el-dropdown-item @click="quitLogin">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const login_status  = ref(false);
const showName = ref(true);
const componentWidth = ref(0);
const router = useRouter();
componentWidth.value = window.innerWidth;
const updateWidth = () => {
    componentWidth.value = window.innerWidth;
    showName.value = componentWidth.value > 550;
};
const gotoHome = () => {
  window.location.href = '/'
}
const gotoCreate = () => {
    router.push("/create");
}
const gotoLogin = () => {
    router.push("/login");
}
const gotoPerson= () => {
    router.push("/person");
}
const quitLogin = () => {
    router.push("/login");
}
onMounted(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
});

const props = defineProps<{
    opacityValue: number;
}>();
</script>

<style scoped>
.header {
width: 100%;
height: 60px;
line-height: 60px;
position: sticky;
z-index: 999;
left: 0;
top: 0;
background-color: white;
opacity: 1;
}
.header-logo {
position: absolute;
height: 100%;
left: 0;
min-width: 50px;
}
.header-navigation {
position: absolute;
max-width: 55%;
height: 100%;
left: 10px;
}
.header-login {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0px;
  width: 110px;
}
.login-button {
  position: absolute;
  top: 13px;
  text-align: center;
  padding: 9px 17px;
  width: 90px;  
  height: 35px;
  font-size: 13px;
  color: white;
  background-color: rgba(0,123,255,1);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-avatar {
  position: absolute;
  right: -100px;
  top: 12px;
  font-size: 16px;
  background-color: white;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}
.navigation-title {
position: absolute;
color:rgb(51, 136, 199);
font-family: Arial, Helvetica, sans-serif;
font-weight:550;
width: 150px;
font-size:27px;
}
.navigation-title:hover {
  cursor: pointer;
}
.navigation-bar {
position: absolute;
width: 80px;
height: 100%;
font-family: "Arial";
font-size: 18px;
text-align: center;
}
.navigation-bar:hover {
cursor: pointer;
}
.navigation-bar1 {
left: 180px;
}
.navigation-bar2 {
left: 280px;
}
.avatar {
position: absolute;
top: 11px;
right: 10px;
box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
cursor: pointer;
}
.avatar:hover{
box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
}
</style>