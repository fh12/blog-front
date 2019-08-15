<template>
  <div class="comment-list">
    <div class="top-title">
      <span>{{ numbers }} 条评论</span>
    </div>
    <div v-for="(item, i) in list" :key="i" class="item">
      <div class="item-header">
        <div class="author">
          <div class="avator">
            <img v-if="!item.avatar" src="../assets/user.png" alt="默认图片" />
            <img v-else :src="item.avatar" alt="" />
          </div>
        </div>
        <div class="info">
          <div class="name">
            {{ item.nickname }}
          </div>
          <div class="time">
            {{ formatTime(item.createtime) }}
          </div>
        </div>
      </div>
      <div class="comment-detail">{{ item.comment }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { timestampToTime } from "@/utils/utils";

@Component
export default class CommentList extends Vue {
  @Prop({ default: () => [] }) list!: Array<object>;
  @Prop({ default: 0 }) numbers!: number;
  mounted() {
    console.log(this.list);
  }
  visible: boolean = false;
  content: any = "";
  commentId: any = "";
  nickname: any = {};

  formatTime(value: any) {
    return timestampToTime(value, true);
  }
}
</script>
<style lang="less" scoped>
.comment-list {
  text-align: center;
  // padding: 20px;
}
.comment-list {
  text-align: left;
  margin-top: 30px;
  padding-top: 30px;
  position: relative;
  // padding-left: 58px;
  border-top: 1px solid #eee;
  .avatar {
    position: absolute;
    left: 0px;
  }
  .el-icon-circle-plus {
    font-size: 40px;
  }
}
.clearfix {
  clear: both;
}
.comment-list {
  margin-top: 30px;
  .top-title {
    padding-bottom: 20px;
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px solid #f0f0f0;
  }
  .item {
    padding: 5px 0 15px;
    border-bottom: 1px solid #f0f0f0;
    .item-header {
      position: relative;
      padding-left: 45px;
      padding-bottom: 10px;
      .author {
        position: absolute;
        left: 0;
        display: inline-block;
        .avator {
          display: inline-block;
          margin-right: 5px;
          width: 40px;
          height: 40px;
          vertical-align: middle;
          img {
            width: 100%;
            height: 100%;
            // border: 1px solid #ddd;
            border-radius: 50%;
          }
        }
      }
      .info {
        display: inline-block;
        .name {
          font-size: 15px;
          color: #333;
        }
        .time {
          font-size: 12px;
          color: #969696;
        }
      }
    }
    .comment-detail {
      min-height: 40px;
    }
    .item-comment {
      .like {
        margin-right: 20px;
      }
    }
  }
}
.item-other {
  margin: 20px;
  padding: 10px;
  border-left: 2px solid #f0f0f0;
  .item-header {
    position: relative;
    padding-left: 45px;
    padding-bottom: 10px;
    .author {
      position: absolute;
      left: 0;
      display: inline-block;
      .avator {
        display: inline-block;
        margin-right: 5px;
        width: 38px;
        height: 38px;
        vertical-align: middle;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .info {
      display: inline-block;
      .name {
        font-size: 15px;
        color: #666;
        font-weight: 800;
      }
      .time {
        font-size: 12px;
        color: #969696;
      }
    }
  }
  .comment-detail {
    min-height: 40px;
    border-bottom: 1px dashed #f0f0f0;
  }
  .message {
    padding: 10px;
  }
}
</style>
