<template>
  <div class="left clearfix">
    <div v-if="!userInfo" class="tac mt20">请登录后查看</div>
    <div v-if="userInfo">
      <div style="text-align:right;padding:5px;border-bottom:1px solid #eee">
        <router-link to="/newblog">
          <el-button type="primary" size="mini"
            ><i class="el-icon-edit-outline"></i> 发表博客</el-button
          >
        </router-link>
      </div>
      <!-- <h3 v-if="params.tag_id" class="left-title">{{ tag_name }} 相关的文章：</h3> -->
      <ul class="articles-list" id="list">
        <transition-group name="el-fade-in">
          <li v-for="article in articlesList" :key="article.id" class="item">
            <div class="content">
              <h4 class="title">{{ article.title }}</h4>
              <!-- <p class="abstract">{{ article.desc }}</p> -->
              <div class="meta">
                <!-- <span>查看 {{ article.meta.views }}</span>
                <span>评论 {{ article.meta.comments }}</span>
                <span>赞 {{ article.meta.likes }}</span> -->
                <span v-if="article.createtime" class="time fl">
                  {{ formatTime(article.createtime) }}
                </span>
                <span class="fr">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="handleConfirm(article.id)"
                    >删除</el-button
                  >
                </span>
                <span class="fr">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="edit(article.id)"
                    >编辑</el-button
                  >
                </span>
              </div>
            </div>
          </li>
        </transition-group>
      </ul>
    </div>
    <LoadingCustom v-if="isLoading"></LoadingCustom>
    <LoadEnd v-if="isLoadEnd"></LoadEnd>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import {
  throttle,
  getScrollTop,
  getDocumentHeight,
  getWindowHeight,
  getQueryStringByName,
  timestampToTime
} from "@/utils/utils";
import LoadEnd from "@/components/loadEnd.vue";
import LoadingCustom from "@/components/loading.vue";

// 获取可视区域的高度
// const viewHeight = window.innerHeight || document.documentElement.clientHeight;
// 用新的 throttle 包装 scroll 的回调
// const lazyload = throttle(() => {
//   // 获取所有的图片标签
//   const imgs = document.querySelectorAll("#list .item img");
//   // num 用于统计当前显示到了哪一张图片，避免每次都从第一张图片开始检查是否露出
//   let num = 0;
//   for (let i = num; i < imgs.length; i++) {
//     // 用可视区域高度减去元素顶部距离可视区域顶部的高度
//     let distance = viewHeight - imgs[i].getBoundingClientRect().top;
//     let imgItem: any = imgs[i];
//     // 如果可视区域高度大于等于元素顶部距离可视区域顶部的高度，说明元素露出
//     if (distance >= 100) {
//       // 给元素写入真实的 src，展示图片
//       let hasLaySrc = imgItem.getAttribute("data-has-lazy-src");
//       if (hasLaySrc === "false") {
//         imgItem.src = imgItem.getAttribute("data-src");
//         imgItem.setAttribute("data-has-lazy-src", "true");
//       }
//       // 前 i 张图片已经加载完毕，下次从第 i+1 张开始检查是否露出
//       num = i + 1;
//     }
//   }
// }, 1000);

@Component({
  components: {
    LoadEnd,
    LoadingCustom
  }
})
export default class Admin extends Vue {
  // initial data
  isLoadEnd: boolean = false;
  isLoading: boolean = false;
  articlesList: Array<object> = [];
  dialogVisible: boolean = false;
  total: number = 0;
  tag_name: string = decodeURI(getQueryStringByName("tag_name"));
  params: any = {
    keyword: "",
    likes: "", // 是否是热门文章
    state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
    tag_id: getQueryStringByName("tag_id"),
    category_id: getQueryStringByName("category_id"),
    pageNum: 1,
    pageSize: 10
  };
  href: string = "/articleDetail?article_id=";

  // lifecycle hook
  mounted() {
    this.handleSearch();
  }
  get userInfo() {
    let userInfo: any = {
      username: ""
    };
    if (this.$store.state.user.userInfo) {
      userInfo = this.$store.state.user.userInfo;
    }
    if (window.sessionStorage && window.sessionStorage.getItem("userInfo")) {
      userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    }
    return userInfo.username;
  }
  // @Watch("$route")
  // routeChange(val: Route, oldVal: Route) {
  //   this.tag_name = decodeURI(getQueryStringByName("tag_name"));
  //   this.params.tag_id = getQueryStringByName("tag_id");
  //   this.params.category_id = getQueryStringByName("category_id");
  //   this.articlesList = [];
  //   this.params.pageNum = 1;
  //   this.handleSearch();
  // }
  handleConfirm(id: string) {
    this.$confirm("确认删除？")
      .then(_ => {
        this.delBlog(id);
      })
      .catch(_ => {});
  }
  async delBlog(id: string) {
    const res: any = await this.$https.post(this.$urls.delBlog + "?id=" + id);
    this.handleSearch();
  }
  formatTime(value: any) {
    return timestampToTime(value, true);
  }
  edit(id: string) {
    this.$router.push({ path: "/editblog", query: { id: id } });
  }
  async handleSearch() {
    this.isLoading = true;
    const res: any = await this.$https.get(this.$urls.getAdmin);
    this.isLoading = false;
    if (res.status === 200) {
      if (res.data.code === 0) {
        const data: any = res.data.data;
        this.articlesList = [];
        this.articlesList = data;
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
.left {
  .articles-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .title {
      color: #333;
      margin: 2px 0 4px;
      font-size: 16px;
      height: 46px;
      font-weight: 700;
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      /* autoprefixer:off*/
      -webkit-box-orient: vertical;
      /* autoprefixer:on*/
    }
    // .item > div {
    //   // padding-right: 120px;
    // }
    // .item .content {
    // }
    .item .wrap-img {
      position: absolute;
      top: 50%;
      margin-top: -50px;
      left: 0;
      width: 100px;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
      }
    }
    li {
      line-height: 20px;
      position: relative;
      // width: 100%;
      padding: 10px 0px;
      // padding-right: 150px;
      border-bottom: 1px solid #f0f0f0;
      word-wrap: break-word;
      cursor: pointer;
      &:hover {
        .title {
          color: #000;
        }
      }
      .abstract {
        min-height: 30px;
        margin: 0 0 8px;
        font-size: 13px;
        line-height: 24px;
        color: #555;
      }
      .meta {
        padding-right: 0 !important;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        height: 30px;
        a {
          margin-right: 10px;
          color: #b4b4b4;
          &::hover {
            transition: 0.1s ease-in;
            -webkit-transition: 0.1s ease-in;
            -moz-transition: 0.1s ease-in;
            -o-transition: 0.1s ease-in;
            -ms-transition: 0.1s ease-in;
          }
        }
        span {
          margin-right: 10px;
          color: #666;
        }
      }
    }
  }
}
</style>
