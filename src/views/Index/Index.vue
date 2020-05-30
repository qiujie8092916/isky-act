<template>
  <div class="index">
    <NavHeader
      style="z-index: 99"
      v-if="!isWechat"
      :is-back="true"
      :is-fixed="true"
      :background="'transparent'"
      :share-params="shareParams"
    />
    <div class="container">
      <div class="background-image-container colcb">
        <Button
          @onPress="goItem(dataSource.headerImage.id)"
          style="z-index: 1;margin-bottom: 2.77rem;"
        >
          <img
            class="background-header-image rowcc"
            v-if="dataSource.headerImage.image"
            :src="dataSource.headerImage.image"
          />
        </Button>
        <img
          class="background-image rowcc abs"
          v-if="dataSource.backgroundImage"
          :src="dataSource.backgroundImage"
        />
      </div>
      <div class="content-contaner colct">
        <img
          class="background-title rowcc"
          v-if="dataSource.title"
          :src="dataSource.title"
        />
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
        title: "",
        footer: "",
        headerImage: {},
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
        url: `https://static.iskytrip.com/webConfig/61childrensday/index.json?_t=${cache}`
      });

      const resultData = await ossConfigModel.execute();

      const { contentItem } = resultData;

      this.dataSource.title = resultData.title || "";
      this.dataSource.footer = resultData.footer || "";
      this.dataSource.headerImage = contentItem.shift();
      this.dataSource.contentItems = resultData.contentItem || [];
      this.dataSource.backgroundImage = resultData.backgroundImage || "";

      this.shareParams = resultData.shareParams || {};

      if (this.isWechat) {
        wx.miniProgram.postMessage({
          data: {
            shareData: {
              title: "V1贵宾室开幕｜¥9.9起带你体验贵宾服务",
              path: `pages/webview/webview?url=${escape(
                "https://static.iskytrip.com/activity/61childrensday/index.html"
              )}`,
              imageUrl:
                "https://static.iskytrip.com/webConfig/61childrensday/share.jpg"
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
  background: #f1bd60;
}

.background-image-container {
  height: 13.22rem;
}

.background-header-image {
  width: 6.83rem;
  height: 7.4rem;
}

.background-image {
  width: 100%;
}

.content-contaner {
  width: 100%;
  /*margin-right: 0.28rem;*/
}

.background-title {
  width: 4.51rem;
  margin-top: 0.56rem;
  margin-bottom: 0.46rem;
}

.content-item {
  width: 6.7rem;
  margin-bottom: 0.6rem;
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
