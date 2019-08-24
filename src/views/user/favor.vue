<template>
  <div class="left clearfix">
    <li
      @click="articleDetail(article.id)"
      v-for="article in articlesList"
      :key="article.id"
      class="item"
    >
      <span class="wrap-img">
        <img
          :data-src="article.imgurl"
          data-has-lazy-src="false"
          src="../../assets/bg.jpg"
          alt="文章封面"
        />
      </span>

      <div class="content">
        <h4 class="title">{{ article.title }}</h4>
        <!-- <p class="abstract">{{ article.desc }}</p> -->
        <div class="meta">
          <!-- <span>查看 {{ article.meta.views }}</span>
                <span>评论 {{ article.meta.comments }}</span>
                <span>赞 {{ article.meta.likes }}</span> -->
          <span v-if="article.createtime" class="time">
            {{ formatTime(article.createtime) }}
          </span>
        </div>
      </div>
    </li>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
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

@Component({
  components: {
    LoadEnd,
    LoadingCustom
  },
  computed: mapGetters(["userInfo"])
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
  // TS对vuex支持不完善 暂时先这样
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
.left .item {
  list-style: none;
  line-height: 20px;
  // padding-top: 0;
  // position: relative;
  margin: 10px 0;
  padding: 10px 0px;
  border-bottom: 1px solid #f0f0f0;
  word-wrap: break-word;
  cursor: pointer;
}
.item > .content {
  padding-left: 100px;
}
.title {
  color: #333;
  margin: 2px 0 4px;
  font-size: 15px;
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
.time {
  font-size: 12px;
  color: #666;
}
.item .wrap-img {
  float: left;
  display: block;
  overflow: hidden;
  width: 90px;
  height: 66px;
  border-radius: 6px;
  img {
    width: 100%;
    height: 100%;
    border: 1px solid #f0f0f0;
  }
}
</style>
