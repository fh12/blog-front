<template>
  <el-dialog
    :title="handleFlag === 'login' ? '登录' : '注册'"
    :width="isMobile ? '90%' : '50%'"
    :visible="dialogVisible"
    @close="cancel"
  >
    <el-form>
      <el-formItem label="用户名" :label-width="formLabelWidth">
        <el-input
          v-model="params.username"
          placeholder="用户名"
          autocomplete="off"
        >
        </el-input>
      </el-formItem>
      <el-formItem label="密码" :label-width="formLabelWidth">
        <el-input
          type="password"
          placeholder="密码"
          v-model="params.password"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="昵称"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="params.nickname"
          placeholder="用户名或昵称"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="手机"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="params.phone"
          placeholder="手机号"
          autocomplete="off"
        ></el-input>
      </el-formItem>
      <el-formItem
        v-if="handleFlag === 'register'"
        label="简介"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="params.desc"
          placeholder="个人简介"
          autocomplete="off"
        ></el-input>
      </el-formItem>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button type="success" @click="handleOAuth">github 授权登录</el-button> -->
      <el-button
        v-if="handleFlag === 'login'"
        :loading="btnLoading"
        type="primary"
        @click="handleOk('login')"
        >登 录</el-button
      >
      <el-button
        v-if="handleFlag === 'register'"
        :loading="btnLoading"
        type="primary"
        @click="handleOk('register')"
        >注 册</el-button
      >
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import config from "@/utils/config";

@Component({
  // components: {}
})
export default class RegisterAndLogin extends Vue {
  @Prop({ default: false }) visible!: boolean;
  @Prop({ default: false }) handleFlag!: string;
  @Prop({ default: false }) isMobile!: string;

  // initial data
  btnLoading: boolean = false;
  loading: boolean = false;
  formLabelWidth: string = this.isMobile ? "60px" : "80px";
  params: any = {
    username: "",
    name: "",
    password: "",
    phone: "",
    desc: ""
  };

  // lifecycle hook
  mounted() {}

  // computed
  get dialogVisible() {
    return this.visible;
  }

  handleOk() {
    if (!this.params.username) {
      this.$message({
        message: "用户名不能为空！",
        type: "warning"
      });
      return;
    }
    if (this.handleFlag === "register") {
      if (!this.params.password) {
        this.$message({
          message: "密码不能为空！",
          type: "warning"
        });
        return;
      } else if (!this.params.username) {
        this.$message({
          message: "用户名不能为空！",
          type: "warning"
        });
        return;
      }
      const re = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (this.params.phone && !re.test(this.params.phone)) {
        this.$message({
          message: "请输入正确的手机号!",
          type: "warning"
        });
        return;
      }
    }
    this.submit();
  }

  // this.$emit
  @Emit()
  cancel() {
    return false;
  }
  @Emit("ok")
  async submit() {
    let res: any = "";
    this.btnLoading = true;
    if (this.handleFlag === "register") {
      res = await this.$https.post(this.$urls.register, this.params);
    } else {
      res = await this.$https.post(this.$urls.login, this.params);
    }
    this.btnLoading = false;
    if (res.status === 200) {
      if (res.data.code === 0) {
        const data: any = res.data.data;
        this.$store.commit("SAVE_USER", data);
        this.$message({
          message: res.data.message,
          type: "success"
        });
        return false;
      } else {
        this.$message({
          message: res.data.message,
          type: "error"
        });
        return true;
      }
    } else {
      this.$message({
        message: "网络错误!",
        type: "error"
      });
      return true;
    }
  }
}
</script>
