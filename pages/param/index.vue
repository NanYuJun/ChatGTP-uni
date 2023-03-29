<template>
  <view class="param">
	  <!-- #ifndef MP-TOUTIAO -->
	  <u-navbar :title="content.name" autoBack="true" leftIconColor="#fff"   :bgColor="theme == 'light' ? '#0071ff' : '#2c2c2c'" :safeAreaInsetTop="true"
	  	:placeholder="true" titleStyle="color:#fff">
	  </u-navbar>
	  <!-- #endif -->
    <mp-html :content="content.data"></mp-html>
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
      this.content = data.data;
    },
  },
};
</script>

<style scoped>
.param {
  padding: 20rpx;
}
</style>
