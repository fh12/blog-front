<template>
  <div>
    <span class="bjLike">
      <i
        class="icolikes"
        :class="{ like: likeActive }"
        @click="handleClick"
        style="left:-20px"
      ></i>
      <span class="ml30">{{ favorCount }}</span>
    </span>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component
export default class Nav extends Vue {
  @Prop({ default: 0 }) count!: number;
  @Prop({ default: false }) like!: boolean;
  favorCount: number = 0;
  likeActive: boolean = false;
  @Watch("count")
  addCount(val: number) {
    this.favorCount = val;
  }
  @Watch("like")
  changelike(val: boolean) {
    this.likeActive = val;
  }
  mounted() {
    if (this.count === 0) {
      this.favorCount = 0;
    } else {
      this.favorCount = this.count;
    }
    this.likeActive = this.like;
  }
  handleClick() {
    if (!this.likeActive) {
      this.$emit("likeClick");
      this.favorCount++;
    }
    if (!this.likeActive) {
      this.likeActive = true;
    }
  }
}
</script>
<style scoped>
.bjLike {
  display: inline-block;
  position: relative;
  height: 18px;
  line-height: 18px;
}

.icolikes {
  font-size: 20px;
  background-image: url("~@/assets/like.png");
  background-position: left;
  background-repeat: no-repeat;
  height: 60px;
  width: 60px;
  cursor: pointer;
  position: absolute;
  bottom: -21px;
  background-size: 2900%;
}

.like {
  display: inline-block;
  -webkit-animation-name: likeBlast;
  animation-name: likeBlast;
  -webkit-animation-duration: 0.8s;
  animation-duration: 0.8s;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-timing-function: steps(28);
  animation-timing-function: steps(28);
  background-position: right;
}

@keyframes likeBlast {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}
</style>
