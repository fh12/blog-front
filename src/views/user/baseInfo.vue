<template>
  <div class="userCenter left clearfix">
    <div>111</div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class baseInfo extends Vue {
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
