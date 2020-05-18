<!--
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 13:12:27
 * @LastEditors jieq
 * @LastEditTime 2020-05-18 19:25:35
-->
<template>
  <div class="index">
    <NavHeader
      v-if="!isWechat"
      :is-back="true"
      :is-fixed="true"
      :background="'transparent'"
      :share-params="shareParams"
    />
    <div class="container">
      <div class="background-image-container rowcc">
        <img
          class="background-image rowcc"
          v-if="dataSource.backgroundImage"
          :src="dataSource.backgroundImage"
        />
      </div>
      <div class="content-contaner colct">
        <div
          class="content-item rowcc"
          :key="item.id"
          v-for="item in dataSource.contentItems"
        >
          <Button @onPress="goItem(item.id)">
            <img class="content-item-img rowcc" :src="item.image" alt="" />
          </Button>
        </div>
      </div>
    </div>
<!--    :style="{ height: !isWechat ? '2.41rem' : '3.54rem' }"-->
    <div class="footer rowcc">
      <img
        class="footer-image"
        v-if="dataSource.footer"
        :src="dataSource.footer"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

/** vendor */
import { _, Bridge, UtilDevice } from "@iskytrip/sdk";

/** custom */
import { OssConfig } from "../../utils/BizModel";

/** ui */
import Button from "@/components/Button.vue";
import NavHeader from "@/components/NavHeader.vue";

export default {
  name: "Index",
  components: {
    Button,
    NavHeader
  },
  data() {
    return {
      isWechat: false,
      dataSource: {
        footer: "",
        contentItems: [],
        backgroundImage: ""
      },
      shareParams: {}
    };
  },

  created() {
    if (UtilDevice.isWechat()) {
      this.isWechat = true;
    }
  },

  async mounted() {
    await this.getInitData();
    Bridge.airportLoading();
  },

  methods: {
    async getInitData() {
      const cache = _.timeCeil(new Date(), 10).setSeconds(0, 0);
      const ossConfigModel = new OssConfig({
        url: `https://static.iskytrip.com/webConfig/55shopping/index.json?_t=${cache}`
      });

      const resultData = await ossConfigModel.execute();
      this.shareParams = resultData.shareParams || {};
      this.dataSource.contentItems = resultData.contentItem || [];
      this.dataSource.backgroundImage = resultData.backgroundImage || "";
      this.dataSource.footer =
        (this.isWechat ? resultData.footer : resultData.footerApp) || "";

      if (this.isWechat) {
        wx.miniProgram.postMessage({
          data: {
            shareData: {
              title: "55购物节 | 贵宾休息室大促，助您安心出行！",
              path: `pages/webview/webview?url=${escape(
                "https://static.iskytrip.com/activity/55shopping/index.html"
              )}`,
              imageUrl:
                "https://static.iskytrip.com/webConfig/55shopping/share.jpg"
            }
          }
        });
      }

      return Promise.resolve();
    },

    goItem(id) {
      if (this.isWechat) {
        wx.miniProgram.navigateTo({
          url: `/pages/vip/vipRoomDetail/vipRoomDetail?productId=${id}`
        });
      } else {
        Bridge.appOpenWebView(
          `http://webapp.iskytrip.com/VipRoomDetail?productId=${id}`
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
.index {
  min-height: 100vh;
  position: relative;
  background: #76d1ff;
}

.background-image {
  width: 100%;
}

.content-contaner {
  width: calc(100% - 0.25rem);
  /*margin-right: 0.28rem;*/
}

.content-item {
  width: 6.7rem;
  margin-top: 0.45rem;
}

.content-item-img {
  width: 100%;
}

.footer {
  /* bottom: 0; */
  width: 100%;
  /* position: absolute; */
}

.footer-image {
  width: 100%;
}
</style>
