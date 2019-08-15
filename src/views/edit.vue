<template>
  <div class="left clearfix">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="文章标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="文章logo">
        <el-upload
          class="avatar-uploader"
          action="img/"
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
        <el-button type="primary" size="mini" @click="onSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component
export default class Edits extends Vue {
  form: any = {};
  params: any = {
    id: ""
  };
  mounted() {
    console.log(111);
    this.params.id = this.$route.query.id;
    this.handleSearch();
  }
  handleAvatarSuccess(res: any, file: any) {
    this.form.imgurl = URL.createObjectURL(file.raw);
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
    this.updateBlog(this.form);
  }
  async handleSearch() {
    const res: any = await this.$https.get(
      this.$urls.getArticleDetail + "?id=" + this.params.id
    );
    if (res.status === 200) {
      if (res.data.code === 0) {
        this.form = res.data.data;
        // const article = markdown.marked(res.data.data.content);
        // console.log("this.form :", this.form.tags);
        // article.then((res: any) => {
        //   this.form.content = res.content;
        //   this.form.toc = res.toc;
        //   // console.log("this.articleDetail.toc :", this.articleDetail.toc);
        // });
        // let keyword = res.data.data.keyword.join(",");
        // let description = res.data.data.desc;
        // let title = res.data.data.title;
        // document.title = title;
        // document.querySelector("#keywords").setAttribute("content", keyword);
        // document
        //   .querySelector("#description")
        //   .setAttribute("content", description);
      } else {
        this.$message({
          message: res.data.message,
          type: "error"
        });
      }
    } else {
      this.$message({
        message: "网络错误!",
        type: "error"
      });
    }
  }
  async updateBlog(form: any) {
    const res: any = await this.$https.post(
      this.$urls.updateBlog + "?id=" + this.params.id,
      {
        title: form.title,
        imgurl: form.imgurl,
        content: form.content
      }
    );
    this.$message({
      message: "修改成功",
      type: "success",
      onClose: () => {
        this.$router.push("/admin");
      }
    });
  }
}
</script>
<style scoped>
.avatar {
  width: 80px;
  height: 80px;
}
</style>
