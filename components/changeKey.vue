<template>
  <u-popup
    :show="openModal"
    :round="10"
    mode="bottom"
    :closeable="true"
    @close="closeModal"
    class="change-key"
  >
    <view class="change-key">
      <view class="title"> 自有KEY: </view>
      <u--textarea
        height="50"
        v-model="key"
        placeholder="输入您的key"
      ></u--textarea>
      <mp-html
        :content="item.desc"
        v-for="item in ad('4')"
        :key="item.id"
      ></mp-html>
      <view class="btn-group">
        <view class="btn paste">
          <u-button
            icon="reload"
            text="使用共享KEY"
            @tap="ChangeCommKey"
          ></u-button>
        </view>
        <view class="btn get">
          <u-button
            iconColor="#ffffff"
            color="#0071ff"
            icon="edit-pen"
            text="切换KEY"
            @tap="changeKey"
          >
          </u-button>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import adMixin from "@/mixins/ad.js";
export default {
  mixins: [adMixin],
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      openModal: false,
    };
  },
  watch: {
    value: {
      handler(val) {
        this.openModal = val;
        this.key = uni.getStorageSync("key");
      },
      immediate: true,
    },
  },
  methods: {
    ChangeCommKey() {
      this.key = "";
      this.changeKey();
    },
    // 切换key
    changeKey() {
      uni.setStorageSync("key", this.key);
      uni.showToast({
        title: "切换成功！",
        icon: "none",
      });
      this.closeModal();
    },
    // 关闭弹框
    closeModal() {
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.change-key {
  padding: 0 20rpx 20rpx 20rpx;
  .title {
    margin: 30rpx 0;
  }
  .u-textarea {
    margin-top: 20rpx;
  }
  .btn-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 30rpx;

    .paste {
      width: 40%;
    }

    .get {
      width: 56%;
    }
  }
}
</style>
