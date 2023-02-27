<template>
  <view class="container">
    <view class="bg"></view>
    <view class="form">
      <view class="header">
        <view class="title">人工智能回答你需要的问题</view>
      </view>
      <u-transition :show="true" mode="fade-left">
        <view class="panel">
          <view class="head">
            <view class="title">填写您的问题</view>
            <view class="tips" @tap="show = true">切换自有KEY</view>
          </view>
          <view class="textarea">
            <u--textarea
              height="140"
              v-model="problem"
              placeholder="支持长按粘贴您的问题"
              confirm-type="send"
            >
            </u--textarea>
          </view>
          <view class="btn-group">
            <u-button
              iconColor="#ffffff"
              color="#0071ff"
              icon="edit-pen"
              text="获取问题答案"
              @tap="getAnswer"
            ></u-button>
          </view>
        </view>
      </u-transition>
      <mp-html
        :content="item.desc"
        v-for="item in ad('5')"
        :key="item.id"
      ></mp-html>
      <u-transition :show="true" mode="fade-left">
        <view class="panel">
          <view class="head">
            <view class="title">答案</view>
            <view class="tips"></view>
          </view>
          <view class="textarea">
            <u--textarea
              height="140"
              :value="answer"
              placeholder="支持可复制您的答案"
              confirm-type="send"
            >
            </u--textarea>
          </view>
          <view class="btn-group">
            <view class="btn get" style="width: 100%">
              <u-button
                iconColor="#ffffff"
                color="#0071ff"
                icon="edit-pen"
                text="复制答案"
                @tap="copy"
              >
              </u-button>
            </view>
          </view>
        </view>
      </u-transition>
    </view>
    <view class="content" style="padding: 20rpx">
      <mp-html
        :content="item.desc"
        v-for="item in ad('1')"
        :key="item.id"
      ></mp-html>
    </view>
    <change-key v-model="show" />
    <tabbar ref="tabBar" />
  </view>
</template>

<script>
import adMixin from "../../../mixins/ad.js";
import changeKey from "@/components/changeKey.vue";
export default {
  mixins: [adMixin],
  components: { changeKey },
  data() {
    return {
      problem: "",
      answer: "",
      adPosition: "1",
      show: false,
      key: "",
    };
  },
  onShow(){
    this.$nextTick(() => {
      this.$refs.tabBar.setTabbar()
    })
  },
  methods: {
    // 获取问题答案
    async getAnswer() {
      if (this.problem == "清除记忆") {
        this.next();
        return;
      }
      if (!this.problem) {
        uni.showToast({
          title: "你还没有输入问题呢！",
          icon: "none",
        });
        return;
      }
      let loading = true;
      this.answer = "思考中";
      // 思考动画
      const sleep = (ms) => {
        setTimeout(() => {
          if (loading == true) {
            if (this.answer == "思考中...") {
              this.answer = "思考中";
            } else {
              this.answer += ".";
            }
            sleep(ms);
          } else {
          }
        }, ms);
      };
      sleep(300);
      // end
      try {
        const { data } = await uni.$u.http.post(
          "/app/chatgpt/info",
          {
            prompt: this.problem,
            chat: this.chat,
            problem: this.problem,
            answer: this.answer,
            key: uni.getStorageSync("key") || "",
          },
          {
            timeout: 300000, // 由于接口请求时间较长
          }
        );
        if (data.code == 1000) {
          this.answer = data.data.choices[0].text;
        } else {
          this.answer = data.message;
        }
      } catch (e) {
        this.answer = e;
      }
      loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.share {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 40%;

  .u-button {
    box-shadow: 0rpx 10rpx 10rpx #eee !important;
  }
}

.tool {
  width: 90%;
  margin: 15rpx auto;

  .header {
    .title {
      margin-bottom: 30rpx;
    }
  }

  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 30%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #f0faf8;
      margin: 15rpx 0rpx;
      padding: 30rpx 0rpx;
      border-radius: 10rpx;

      .title {
        color: #1b2b20;
        margin-top: 15rpx;
      }

      .desc {
        color: #67776c;
        font-size: 24rpx;
      }
    }
  }
}

.alert {
  width: 90%;
  margin: 30rpx auto;
}

.form {
  width: 90%;
  margin: 0 auto;
  z-index: 999;

  .header {
    margin-bottom: 30rpx;

    .title {
      text-align: center;
      color: #fff;
      margin: 30rpx 0rpx;
    }
  }

  .panel {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 15rpx;
    box-shadow: 0rpx 10rpx 10rpx #eee;

    .head {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .tips {
        color: #dd6161;
      }
    }

    .textarea {
      margin-top: 30rpx;
    }
  }
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

.bg {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  background-color: $uni-color-primary;
  min-height: 200rpx;
  border-radius: 0rpx 0rpx 140rpx 140rpx;
  z-index: -1;
}
</style>
