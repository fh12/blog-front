<template>
  <div class="userCenter left clearfix">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="我的昵称">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="我的头像">
        <el-upload
          class="avatar-uploader"
          action="/api/blog/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input type="textarea" v-model="form.resume" rows="8"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class baseInfo extends Vue {
  form: any = {};
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
  mounted() {
    this.form = this.userInfo;
  }
  handleAvatarSuccess(res: any, file: any) {
    const avatar = res.data.imgurl;
    this.$set(this.form, "avatar", avatar);
  }
  beforeAvatarUpload(file: any) {
    const isJPG = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJPG) {
      this.$message.error("上传头像图片只能是 JPG 格式!");
    }
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 2MB!");
    }
    return isJPG && isLt2M;
  }
  onSubmit() {
    this.updateUser(this.form);
  }
  async updateUser(form: any) {
    const res: any = await this.$https.post(
      this.$urls.updateUser + "?userId=" + this.userInfo.userId,
      this.form
    );
    if (res.data.code === 0) {
      this.$store.commit("SAVE_USER", this.form);
      this.$message({
        message: "修改成功",
        type: "success",
        onClose: () => {
          this.$router.push("/user");
        }
      });
    }
  }
}
</script>
<style scoped>
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
