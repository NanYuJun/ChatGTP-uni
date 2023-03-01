<template>
  <view>
    <view style="height: 100rpx" v-if="list.length > 1" />
    <view class="tabbar" v-if="list.length > 1">
      <view class="navigator">
        <view
          class="navigator-item"
          v-for="(item, index) in list"
          :key="item.pagePath"
          @click="switchTab(item, index)"
        >
          <img
            :src="item.iconPath"
            class="icon"
            v-if="selectedIndex !== index"
          />
          <img :src="item.selectedIconPath" class="icon" v-else />
          <text
            :class="['item-text', { 'text-active': selectedIndex === index }]"
            >{{ item.text }}</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: uni.getStorageSync("tabbar") || [],
      selectedIndex: uni.getStorageSync("selectedIndex") || 0,
    };
  },
  methods: {
    setTabbar() {
      this.list = uni.getStorageSync("tabbar") || [];
    },
    switchTab(item, index) {
      let url = item.pagePath;
      let pagePath = url;
      // #ifdef H5
      if (pagePath.indexOf("http") > -1) {
        window.open(pagePath);
        return;
      }
      // #endif
      uni.switchTab({ url });
      this.list.forEach((v, i) => {
        if (item.pagePath === v.pagePath) {
          uni.setStorageSync("selectedIndex", index);
        }
      });
    },
  },
};
</script>

<style>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  display: flex;
  align-content: center;
  justify-content: space-between;
  z-index: 999;
  background: #f5f5f5;
  border-top: 2rpx solid #eee;
}

.navigator {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

.navigator-item {
  display: flex;
  justify-content: center;
  flex: 1;
  align-items: center;
  flex-direction: column;
  width: 50rpx;
  height: 100%;
}

.item-text {
  margin-top: 6rpx;
  color: #777e86;
  font-size: 24rpx;
}

.text-active {
  color: #2e92fd !important;
}

.icon {
  width: 20px;
  height: 20px;
}
</style>
