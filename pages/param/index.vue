<template>
  <view class="param">
    <mp-html :content="content"></mp-html>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  onLoad(e) {
    this.getContent(e.key);
  },
  methods: {
    async getContent(key) {
      const { data } = await uni.$u.http.get("/app/base/sys/param/data", {
        params: {
          key,
        },
      });
      this.content = data.data.data;
    },
  },
};
</script>

<style scoped>
.param {
  padding: 20rpx;
}
</style>
