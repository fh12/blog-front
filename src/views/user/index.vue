<template>
  <div class="userCenter left clearfix">
    <div class="userInfo">
      <div class="fl avatar-wrap">
        <el-avatar
          :size="80"
          icon="el-icon-user-solid"
          :src="userInfo.avatar"
        ></el-avatar>
      </div>
      <div class="userBox">
        <div v-if="!userInfo.username" class="username">
          未登录
        </div>
        <div v-else>
          <div class="username">{{ userInfo.nickname }}</div>
          <div class="phone">{{ userInfo.phone }}</div>
        </div>
      </div>
    </div>
    <div v-if="userInfo.username" class="userItem">
      <div class="item">
        <router-link to="/baseInfo">
          <i class="color1 el-icon-info"></i
          ><span class="itemname">个人信息</span>
          <i class="fr ico-right el-icon-arrow-right"></i>
        </router-link>
      </div>
      <div class="item">
        <router-link to="/myblog">
          <i class="color2 el-icon-s-order"></i
          ><span class="itemname">我的文章</span>
          <i class="fr ico-right el-icon-arrow-right"></i>
        </router-link>
      </div>
      <div class="item">
        <router-link to="/friends">
          <i class="color3 el-icon-user-solid"></i
          ><span class="itemname">我的好友</span>
          <i class="fr ico-right el-icon-arrow-right"></i>
        </router-link>
      </div>
      <div class="item">
        <router-link to="/favor">
          <i class="color4 el-icon-star-on"></i
          ><span class="itemname">我的点赞</span>
          <i class="fr ico-right el-icon-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class userCenter extends Vue {
  get userInfo() {
    let userInfo: any = {};
    if (this.$store.state.user.userInfo) {
      userInfo = this.$store.state.user.userInfo;
    }
    let localUserInfo = sessionStorage.getItem("USER_INFO");
    if (localUserInfo && typeof localUserInfo === "string") {
      userInfo = JSON.parse(localUserInfo);
    }
    return userInfo;
  }
}
</script>
<style scoped>
.color1 {
  color: lightblue;
}
.color2 {
  color: rgb(17, 238, 128);
}
.color3 {
  color: rgb(255, 159, 32);
}
.color4 {
  color: rgb(236, 17, 171);
}
.userInfo {
  padding: 10px;
  height: 100px;
  border-bottom: 1px solid #ddd;
}
.userItem .item {
  height: 50px;
  line-height: 50px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
}
.itemname {
  color: #333;
  margin-left: 10px;
}
.ico-right {
  display: block;
  line-height: 50px;
}
.userBox {
  padding-left: 100px;
}
.username {
  font-weight: 600;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
}
.phone {
  font-size: 14px;
}
</style>
