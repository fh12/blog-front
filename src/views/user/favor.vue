<template>
  <div class="left clearfix">
    <div style="text-align:right;padding:5px;border-bottom:1px solid #eee">
      <router-link to="/articles">
        <el-button type="success" size="small"
          ><i class="el-icon-circle-plus-outline"></i> 收藏更多</el-button
        >
      </router-link>
    </div>
    <ul class="articles-list">
      <li
        @click="articleDetail(article.id)"
        v-for="article in articlesList"
        :key="article.id"
        class="item"
      >
        <span class="wrap-img">
          <img v-if="article.imgurl !== 'null'" :src="article.imgurl" />
          <img
            v-if="article.imgurl == 'null'"
            src="./../../assets/logo.png"
            alt=""
          />
        </span>

        <div class="content">
          <h4 class="title">{{ article.title }}</h4>
          <div class="meta">
            <span class="f10">作者：</span>
            <span v-if="article.author" class="f10">
              {{ article.author }}
            </span>
          </div>
        </div>
      </li>
    </ul>
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

  formatTime(value: any) {
    return timestampToTime(value, true);
  }
  articleDetail(id: string) {
    this.$router.push({ path: "/articleDetail", query: { article_id: id } });
  }
  async handleSearch() {
    this.isLoading = true;
    const res: any = await this.$https.get(
      this.$urls.getUserFavor + "?userId=" + this.userInfo.userId
    );
    this.isLoading = false;
    if (res.data.code === 0) {
      this.articlesList = res.data.data;
    }
  }
}
</script>

<style lang="less" scoped>
.left .item {
  list-style: none;
  line-height: 20px;
  margin: 5px 0;
  padding: 5px 0px;
  border-bottom: 1px solid #f0f0f0;
  word-wrap: break-word;
  cursor: pointer;
}
.articles-list {
  padding-left: 10px;
}
.item > .content {
  padding-left: 60px;
}
.title {
  color: #333;
  margin: 2px 0 4px;
  font-size: 13px;
  height: 16px;
  width: 93%;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
}
.f10 {
  font-size: 10px;
  color: #666;
}
.item .wrap-img {
  float: left;
  display: block;
  overflow: hidden;
  width: 50px;
  height: 36px;
  border-radius: 6px;
  img {
    width: 100%;
    height: 100%;
    border: 1px solid #f0f0f0;
  }
}
</style>
