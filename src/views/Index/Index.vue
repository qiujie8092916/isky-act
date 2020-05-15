<!--
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 13:12:27
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 16:58:34
-->
<template>
  <div class="index">
    <NavHeader v-if="isInApp" :is-back="true" :share-params="shareParams" />
  </div>
</template>

<script>
// @ is an alias to /src

/** vendor */
import { Bridge, UtilDevice } from "@iskytrip/sdk";

/** custom */
import { OssConfig } from "../../utils/BizModel";

/** ui */
import NavHeader from "@/components/NavHeader.vue";

export default {
  name: "Index",
  components: {
    NavHeader
  },
  data() {
    return {
      isInApp: false,
      shareParams: {
        // paramsReqList: [],
        // sharePageCategory: "vipRoomActivity",
        // sharePageImage:
        //   "https://static.iskytrip.com/activity/img/no_deleting.2.png",
        // sharePageType: "wxApp"
      }
    };
  },

  created() {
    if (UtilDevice.isApp()) {
      this.isInApp = true;
    }
  },

  async mounted() {
    await this.getInitData();
    Bridge.airportLoading();
  },

  methods: {
    async getInitData() {
      const ossConfigModel = new OssConfig({
        url: `https://static.iskytrip.com/webConfig/55shopping/index.json${
          this.$route.query.ver ? `?ver=${this.$route.query.ver}` : ""
        }`
      });
      const res = await ossConfigModel.execute();
      console.log(res);
      return Promise.resolve();
    }
  }
};
</script>
