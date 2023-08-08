<template>
  <n-page>
    <view class="container">
      <view class="userinfo-card">
        <view class="card-box">
          <view class="user-section">
            <view class="avatar-wrap">
              <image
                class="avatar"
                :src="userInfo.avatar || '/static/userAvatar.jpg'"
              ></image>
            </view>
            <view class="portrait-box">
              <view class="info-box">
                <text class="username" @click="goLogin">{{
                  userInfo.nickname
                }}</text>
              </view>
              <view class="tuan">
                <text>邀请人数：{{ inviteTotal }}</text>
              </view>
            </view>
          </view>
          <view class="balance-card-wrap">
            <view class="balance-card">
              <view class="tit">余额(元)</view>
              <view class="xia">
                <view class="num">
                  <text style="font-size: 40upx">￥</text
                  >{{ userInfo.balance / 100 }}
                </view>
                <view
                  @click="go('pages/distribution/cash')"
                  class="withdraw-btn"
                  >立即提现</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="main">
        <!-- 工具 -->
        <view class="tool-card">
          <view class="tool-item" @click="go('pages/user/invitation')">
            <image
              src="@/static/rindex/tuandui.png"
              mode="widthFix"
              class="view-image-left"
            ></image>
            <view class="item-right">
              <view class="view-text">我的团队</view>
              <image
                src="@/static/right_icon.png"
                class="view-image-right"
              ></image>
            </view>
          </view>
          <view class="tool-item" @click="go('pages/distribution/cashlist')">
            <image
              src="@/static/rindex/tixian.png"
              mode="widthFix"
              class="view-image-left"
            ></image>
            <view class="item-right">
              <view class="view-text">提现记录</view>
              <image
                src="@/static/right_icon.png"
                class="view-image-right"
              ></image>
            </view>
          </view>
          <view class="tool-item" @click="go('pages/distribution/income')">
            <image
              src="@/static/rindex/shouyi.png"
              mode="widthFix"
              class="view-image-left"
            ></image>
            <view class="item-right">
              <view class="view-text">收益明细</view>
              <image
                src="@/static/right_icon.png"
                class="view-image-right"
              ></image>
            </view>
          </view>
          <view class="tool-item" @click="go('pages/share/index')">
            <image
              src="@/static/rindex/haibao.png"
              mode="widthFix"
              class="view-image-left"
            ></image>
            <view class="item-right">
              <view class="view-text">推广海报</view>
              <image
                src="@/static/right_icon.png"
                class="view-image-right"
              ></image>
            </view>
          </view>
        </view>
      </view>
    </view>
  </n-page>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      inviteTotal: 0,
    };
  },

  onLoad() {
    this.getInviterTotal();
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    async getInviterTotal() {
      const { data } = await uni.$u.http.post("/app/user/inviterLog/total");
      this.inviteTotal = data.data;
    },
  },
};
</script>
<style lang="scss" scoped>
page {
  background: #f2f3f7;
}

.container {
  width: 92%;

  .userinfo-card {
    .card-box {
      width: 100%;
      height: 400upx;
      position: relative;
      z-index: 0;

      .user-section {
        position: absolute;
        top: 0;
        z-index: 10;
        width: 100%;
        padding: 50upx 30upx 210upx;
        display: flex;

        .avatar-wrap {
          width: 100upx;
          height: 100upx;
          border-radius: 50%;
          overflow: hidden;

          .avatar {
            width: 100%;
            height: 100%;
          }
        }

        .portrait-box {
          margin-left: 18upx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .info-box {
            font-size: 38upx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #333;
          }

          .tuan {
            display: flex;
            align-items: center;

            .ma {
              font-size: 24upx;
              font-family: PingFang SC;
              font-weight: 500;
              color: #333;
            }

            .fuzi {
              width: 64upx;
              height: 34upx;
              background: #cccccc;
              border-radius: 15upx;
              font-size: 20upx;
              font-family: PingFang SC;
              font-weight: 500;
              color: #333333;
              text-align: center;
              line-height: 34upx;
              margin-left: 10upx;
            }
          }
        }
      }

      .balance-card-wrap {
        width: 100%;
        height: 200upx;
        padding: 0 20upx;
        position: absolute;
        bottom: 0;
        z-index: 10;

        .balance-card {
          width: 94%;
          height: 140upx;
          background: linear-gradient(90deg, #007aff 0%, #007aff 100%);
          border-radius: 15upx;
          padding: 30upx;

          .tit {
            font-size: 32upx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #fff;
          }

          .xia {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .num {
              font-size: 70upx;
              font-family: DINPro;
              font-weight: bold;
              color: #fff;
            }

            .withdraw-btn {
              width: 150upx;
              height: 60upx;
              line-height: 60upx;
              text-align: center;
              background: #fff;
              font-size: 28upx;
              font-family: PingFang SC;
              font-weight: 500;
              color: #007aff;
              border-radius: 10upx;
            }
          }
        }
      }
    }
  }

  .main {
    padding: 20upx;

    .income-card {
      width: 100%;
      background-color: #fff;
      border-radius: 20upx;
      padding: 30upx;
      margin-top: 20upx;

      .tit {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 32upx;
        line-height: 32upx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;

        image {
          width: 10upx;
          height: 21upx;
        }
      }

      .show-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 40upx;

        .view-category {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .num {
            font-size: 38upx;
            font-family: PingFang SC;
            font-weight: 800;
            color: #333333;
          }

          .text {
            font-size: 24upx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;
          }
        }

        .line {
          width: 1px;
          height: 65upx;
          background-color: #e6e6e6;
        }
      }
    }

    .tool-card {
      background-color: #ffffff;
      width: 100%;
      padding: 0 30upx;
      margin-top: 20upx;
      border-radius: 20upx;

      .tool-item {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100upx;
        align-items: center;
        justify-content: space-between;

        .view-image-left {
          width: 44upx;
        }

        .item-right {
          flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          .view-text {
            margin-left: 22upx;
            font-size: 28upx;
            font-family: PingFang SC;
            // font-weight: bold;
            color: #707070;
          }

          .view-image-right {
            width: 10upx;
            height: 21upx;
          }
        }
      }
    }
  }
}
</style>
