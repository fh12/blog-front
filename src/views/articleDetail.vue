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
              <img
                v-if="articleDetail.authorAvatar"
                class="auth-logo"
                :src="articleDetail.authorAvatar"
                alt=""
              />
              <img
                v-if="!articleDetail.authorAvatar"
                class="auth-logo"
                src="../assets/user.png"
                alt=""
              />
            </div>
            <div class="info">
              <span class="name">
                <span>{{
                  articleDetail.authorNickname || articleDetail.author
                }}</span>
              </span>
              <div
                props-data-classes="user-follow-button-header"
                data-author-follow-button=""
              />
              <div class="meta mt10">
                <span class="publish-time">
                  {{
                    articleDetail.createtime
                      ? formatTime(articleDetail.createtime)
                      : ""
                  }}
                </span>
              </div>
            </div>
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
          <div class="heart-wrap">
            <like
              :like="likeActive"
              @likeClick="handleLike"
              :count="articleDetail.likeCount"
            ></like>
          </div>
          <span class="favor fr" @click="handleFavor">
            <i
              :class="favorActive ? 'el-icon-star-on' : 'el-icon-star-off'"
            ></i>
          </span>
        </div>
        <div class="comment">
          <el-input
            placeholder="文明社会，理性评论"
            type="textarea"
            v-model="content"
          ></el-input>
          <el-button
            class="mt15"
            type="primary"
            size="small"
            :loading="btnLoading"
            @click="handleAddComment"
            >评 论</el-button
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
import like from "@/components/like.vue";

declare var document: any;

@Component({
  components: {
    LoadingCustom,
    CommentList,
    like
  }
})
export default class ArticleDetail extends Vue {
  likeActive: boolean = false;
  favorActive: boolean = false;
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
    comments: [],
    createtime: "",
    id: null,
    img_url: "",
    numbers: 0,
    title: "",
    likeCount: 0
  };
  cacheTime: number = 0; // 缓存时间
  times: number = 0; // 评论次数
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
    this.params.id = this.$route.query.article_id;
    this.handleSearch();
    this.getComments();
  }

  async handleAddComment() {
    if (!this.articleDetail.id) {
      this.$message({
        message: "该文章不存在！",
        type: "error"
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
    if (!this.userInfo.userId) {
      this.$message({
        message: "登录才能评论，请先登录！",
        type: "warning"
      });
      return;
    }
    this.btnLoading = true;
    const res: any = await this.$https.post(this.$urls.addComment, {
      blogId: this.articleDetail.id,
      userId: this.userInfo.userId,
      userAvatar: this.userInfo.avatar,
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
      this.$forceUpdate();
    }
  }
  async handleSearch() {
    this.isLoading = true;
    const res: any = await this.$https.get(
      this.$urls.getArticleDetail + "?id=" + this.params.id
    );
    this.isLoading = false;
    if (res.data.code === 0) {
      this.articleDetail = res.data.data;
      const likeArr = this.articleDetail.likes.split(",");
      if (
        this.userInfo.userId &&
        likeArr.includes(this.userInfo.userId.toString())
      ) {
        this.likeActive = true;
      }
      const favorArr = this.articleDetail.favor.split(",");
      if (
        this.userInfo.userId &&
        favorArr.includes(this.userInfo.userId.toString())
      ) {
        this.favorActive = true;
      }
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

  async handleLike() {
    if (!this.userInfo) {
      this.$message({
        message: "登录才能点赞，请先登录！",
        type: "warning"
      });
      return;
    }
    let params: any = {
      id: this.articleDetail.id,
      userId: this.userInfo.userId
    };
    const res: any = await this.$https.post(this.$urls.likeArticle, params);
    if (res.data.code === 0) {
      this.likeActive = true;
      const count = this.articleDetail.likeCount;
      this.$set(this.articleDetail, "likeCount", count + 1);
      this.$message({
        message: res.data.message,
        type: "success"
      });
    } else {
      this.likeActive = false;
      this.$message({
        message: res.data.message,
        type: "error"
      });
    }
  }
  async handleFavor() {
    if (!this.userInfo) {
      this.$message({
        message: "登录才能收藏，请先登录！",
        type: "warning"
      });
      return;
    }
    if (this.favorActive) {
      return;
    }
    let params: any = {
      id: this.articleDetail.id,
      userId: this.userInfo.userId
    };
    const res: any = await this.$https.post(this.$urls.favorArticle, params);
    if (res.data.code === 0) {
      this.favorActive = true;
      this.$message({
        message: res.data.message,
        type: "success"
      });
    } else {
      this.favorActive = false;
      this.$message({
        message: res.data.message,
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
      height: 50px;
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
        font-size: 12px;
        color: #969696;
        span {
          padding-right: 5px;
        }
      }
      .tags {
        float: right;
        padding-top: 15px;
        .tag {
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
  height: 40px;
  width: 100px;
  text-align: center;
  margin: 50px auto;
}
.favor {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 50%;
}
.favor i {
  padding-top: 2px;
  font-size: 24px;
  color: #ff9133;
}
.heart-wrap {
  float: left;
  height: 26px;
  width: 26px;
  padding-top: 6px;
  padding-left: 6px;
  border: 1px solid #ddd;
  border-radius: 50%;
}
.loader {
  color: rgb(226, 44, 44);
  text-align: center;
  padding: 50px;
  font-size: 16px;
}
.ico-avater {
  font-size: 48px;
}
.clearfix {
  clear: both;
}
</style>
