<template>
  <div style="width: 100%">
    <div class="article clearfix">
      <div
        v-show="!isLoading"
        :style="{ width: isMobileOrPc ? '100%' : '75%' }"
        class="article-left fl"
      >
        <div class="header">
          <h1 class="title">{{ articleDetail.title }}</h1>
          <div class="author">
            <div class="avatar">
              <img class="auth-logo" src="../assets/userLogo.jpeg" alt="" />
            </div>
            <div class="info">
              <span class="name">
                <span>{{ articleDetail.author }}</span>
              </span>
              <div
                props-data-classes="user-follow-button-header"
                data-author-follow-button=""
              />
              <div class="meta">
                <span class="publish-time">
                  {{
                    articleDetail.createtime
                      ? formatTime(articleDetail.createtime)
                      : ""
                  }}
                </span>
                <!-- <span class="wordage"> 字数 {{ articleDetail.numbers }} </span> -->
                <!-- <span class="views-count">
                  阅读 {{ articleDetail.meta.views }}
                </span> -->
                <!-- <span class="comments-count">
                  评论 {{ articleDetail.meta.comments }}
                </span>
                <span class="likes-count">
                  喜欢 {{ articleDetail.meta.likes }}
                </span> -->
              </div>
            </div>
            <span class="clearfix" />
          </div>
        </div>
        <div class="content">
          <div
            id="content"
            class="article-detail"
            v-html="articleDetail.content"
          ></div>
        </div>
        <div class="heart">
          <el-button
            type="danger"
            size="large"
            icon="heart"
            :loading="isLoading"
            @click="likeArticle"
          >
            点赞
          </el-button>
        </div>
        <div class="comment">
          <el-input
            placeholder="文明社会，理性评论"
            type="textarea"
            v-model="content"
          ></el-input>
          <el-button
            style="margin-top: 15px"
            type="primary"
            :loading="btnLoading"
            @click="handleAddComment"
            >发 送</el-button
          >
        </div>
        <CommentList
          :numbers="articleDetail.numbers"
          :list="articleDetail.comments"
        />
      </div>
      <div
        v-if="!isMobileOrPc"
        style="width: 23%"
        class="article-right fr anchor"
        v-html="articleDetail.toc"
      ></div>
      <LoadingCustom v-if="isLoading"></LoadingCustom>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  timestampToTime,
  getQueryStringByName,
  isMobileOrPc
} from "@/utils/utils";
import markdown from "@/utils/markdown";
import LoadingCustom from "@/components/loading.vue";
import CommentList from "@/components/commentList.vue";

declare var document: any;

@Component({
  components: {
    LoadingCustom,
    CommentList
  }
})
export default class ArticleDetail extends Vue {
  reverse: boolean = true;
  btnLoading: boolean = false;
  isLoadEnd: boolean = false;
  isLoading: boolean = false;
  isMobileOrPc: boolean = isMobileOrPc();
  articlesList: Array<object> = [];
  listList: Array<object> = [];
  total: number = 0;
  params: any = {
    id: ""
  };
  content: string = "";
  articleDetail: any = {
    toc: "",
    author: "",
    category: [],
    comments: [],
    createtime: "",
    desc: "",
    id: null,
    img_url: "",
    numbers: 0,
    title: ""
  };
  cacheTime: number = 0; // 缓存时间
  times: number = 0; // 评论次数
  likeTimes: number = 0; // 点赞次数

  mounted() {
    this.params.id = this.$route.query.article_id;
    this.handleSearch();
    this.getComments();
  }

  refreshArticle() {
    this.handleSearch();
  }

  async handleAddComment() {
    if (!this.articleDetail.id) {
      this.$message({
        message: "该文章不存在！",
        type: "error"
      });
      return;
    }

    if (this.times > 2) {
      this.$message({
        message: "您今天评论的次数已经用完，明天再来评论吧！",
        type: "warning"
      });
      return;
    }

    let now = new Date();
    let nowTime = now.getTime();
    if (nowTime - this.cacheTime < 4000) {
      this.$message({
        message: "您评论太过频繁，1 分钟后再来留言吧！",
        type: "warning"
      });
      return;
    }

    if (!this.content) {
      this.$message({
        message: "请输入内容!",
        type: "warning"
      });
      return;
    }
    let userId = "";
    let nickname = "";
    if (window.sessionStorage.userInfo) {
      let userInfo = JSON.parse(window.sessionStorage.userInfo);
      userId = userInfo.userId;
      nickname = userInfo.nickname;
    } else {
      this.$message({
        message: "登录才能评论，请先登录！",
        type: "warning"
      });
      return;
    }

    this.btnLoading = true;
    const res: any = await this.$https.post(this.$urls.addComment, {
      blogId: this.articleDetail.id,
      userId,
      comment: this.content
    });
    this.btnLoading = false;
    this.times++;
    if (res.data.code === 0) {
      this.cacheTime = nowTime;
      this.content = "";
      this.getComments();
      this.$message({
        message: "评论成功",
        type: "success"
      });
    } else {
      this.$message({
        message: "评论失败",
        type: "error"
      });
    }
  }
  formatTime(value: any) {
    return timestampToTime(value, true);
  }

  async getComments() {
    const res = await this.$https.get(
      this.$urls.getComments + "?blogId=" + this.params.id
    );
    if (res.data.code === 0) {
      const count = res.data.data.count;
      const commentList = res.data.data.commentList;
      this.$set(this.articleDetail, "numbers", count);
      this.$set(this.articleDetail, "comments", commentList);
    }
  }
  async handleSearch() {
    // this.isLoading = true;
    const res: any = await this.$https.get(
      this.$urls.getArticleDetail + "?id=" + this.params.id
    );
    // this.isLoading = false;
    if (res.data.code === 0) {
      this.articleDetail = res.data.data;
      if (this.articleDetail) {
        const article = markdown.marked(res.data.data.content);
        article.then((res: any) => {
          this.articleDetail.content = res.content;
          this.articleDetail.toc = res.toc;
        });
      }
    } else {
      this.$message({
        message: res.data.message,
        type: "error"
      });
    }
  }

  async likeArticle() {
    if (!this.articleDetail.id) {
      this.$message({
        message: "该文章不存在！",
        type: "warning"
      });
      return;
    }

    if (this.likeTimes > 0) {
      this.$message({
        message: "您已经点过赞了！悠着点吧！",
        type: "warning"
      });
      return;
    }

    let userId: any = "";
    if (window.sessionStorage.userInfo) {
      let userInfo = JSON.parse(window.sessionStorage.userInfo);
      userId = userInfo.id;
    } else {
      this.$message({
        message: "登录才能点赞，请先登录！",
        type: "warning"
      });
      return;
    }
    let params: any = {
      id: this.articleDetail.id,
      userId
    };
    const res: any = await this.$https.post(this.$urls.likeArticle, params);
    // this.isLoading = false;
    if (res.status === 200) {
      this.likeTimes++;
      if (res.data.code === 0) {
        ++this.articleDetail.meta.likes;
        this.$message({
          message: res.data.message,
          type: "success"
        });
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
}
</script>
<style lang="less" scoped>
.anchor {
  display: block;
  position: sticky;
  top: 213px;
  margin-top: 213px;
  border-left: 1px solid #eee;
  .anchor-ul {
    position: relative;
    top: 0;
    max-width: 250px;
    border: none;
    -moz-box-shadow: 0 0px 0px #fff;
    -webkit-box-shadow: 0 0px 0px #fff;
    box-shadow: 0 0px 0px #fff;

    li.active {
      color: #009a61;
    }
  }
  a {
    color: #333;
  }
}
.article {
  width: 100%;
  .header {
    .title {
      margin: 20px 0 0;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
    }
    .author {
      position: relative;
      margin: 30px 0 40px;
      padding-left: 50px;
      .avatar {
        position: absolute;
        left: 0;
        top: 0;
        width: 48px;
        height: 48px;
        vertical-align: middle;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        float: left;
        vertical-align: middle;
        // display: inline-block;
        margin-left: 8px;
        a {
          color: #333;
        }
      }
      .name {
        margin-right: 3px;
        font-size: 16px;
        vertical-align: middle;
      }
      .meta {
        margin-top: 5px;
        font-size: 12px;
        color: #969696;
        span {
          padding-right: 5px;
        }
      }
      .tags {
        float: right;
        padding-top: 15px;
        // padding-right: 20px;
        .tag {
          // padding: 0 10px;
          margin-left: 5px;
          border-right: 2px solid #eee;
        }
      }
    }
  }
  .content {
    min-height: 300px;
  }
}
.heart {
  height: 60px;
  text-align: center;
  margin: 50px;
}
.loader {
  color: rgb(226, 44, 44);
  text-align: center;
  padding: 50px;
  font-size: 16px;
}
.clearfix {
  clear: both;
}
</style>
