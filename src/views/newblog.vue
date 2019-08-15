<template>
  <div class="left clearfix">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="文章logo">
        <el-upload
          class="avatar-uploader"
          action="/api/blog/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.imgurl" :src="form.imgurl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容">
        <el-input type="textarea" v-model="form.content" rows="8"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit"
          >立即创建</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

@Component({
  components: {}
})
export default class Newblog extends Vue {
  // initial data
  form: any = {};
  // imageUrl: string = "";
  fileList: Array<object> = [];
  // lifecycle hook
  mounted() {}
  handleAvatarSuccess(res: any) {
    const imgurl = res.data.imgurl;
    this.$set(this.form, "imgurl", imgurl);
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
    this.addNewBlog(this.form);
  }
  async addNewBlog(form: any) {
    const res: any = await this.$https.post(this.$urls.addNew, {
      title: form.title,
      imgurl: form.imgurl,
      content: form.content
    });
    this.$message({
      message: "创建成功",
      type: "success",
      onClose: () => {
        this.$router.push("/articles");
      }
    });
  }
}
</script>

<style lang="less" scoped>
.fl {
  float: left;
}
.fr {
  float: right;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>
