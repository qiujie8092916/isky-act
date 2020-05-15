<!--
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 13:13:55
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 16:18:42
-->
<template>
  <div
    class="header rowsc"
    :style="{ opacity, background, paddingTop: signalBarHeight + 'px' }"
  >
    <div class="head-left rowcc">
      <template v-if="isBack || isClose">
        <Button :style="btnOpt" @onPress="_back">
          <IconFont
            class="header-iconfont"
            :font="isBack ? 'iconjiantou_zuo' : 'iconguanbi'"
          />
        </Button>
      </template>
    </div>
    <div class="head-center rowcc">{{ title }}</div>
    <div class="head-right rowcc">
      <template v-if="shareParams">
        <Button :style="btnOpt" @onPress="_share">
          <IconFont class="header-iconfont" font="iconfenxiang" />
        </Button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
/** offcial */
import { Component, Prop, Vue } from "vue-property-decorator";

/** vendor */
import { Toast } from "mint-ui";
import { Bridge, UtilDevice } from "@iskytrip/sdk";

/** custom */
import Button from "./Button.vue";
import IconFont from "./IconFont.vue";

@Component({
  components: {
    Button,
    IconFont
  }
})
export default class Header extends Vue {
  /**
   * @prop {() => any} back 点击返回键（关闭键）事件
   */
  @Prop() private back?: Function;
  /**
   * @prop {object} shareParams 分享数据
   */
  @Prop() private shareParams?: object;
  /**
   * @prop {boolean} isFixed 点击返回键（关闭键）事件
   */
  @Prop({ default: false }) private isFixed?: boolean;
  /**
   * @prop {string} [title=''] 标题
   */
  @Prop({ default: "" }) private title?: string;
  /**
   * @prop {number} [opacity=''] header的透明度
   */
  @Prop({ default: 1 }) private opacity?: number;
  /**
   * @prop {boolean} [isBack=false] 是否显示返回键
   */
  @Prop({ default: false }) private isBack?: boolean;
  /**
   * @prop {boolean} [isClose=false] 是否显示关闭键（isBack、isClose不可同时为true，优先isBack）
   */
  @Prop({ default: false }) private isClose?: boolean;
  /**
   * @prop {boolean} [isIconBg=true] header的背景色为透明色 按钮是否需要有背景色（让其视觉清晰）
   */
  @Prop({ default: true }) private isIconBg?: boolean;
  /**
   * @prop {string} [background=''] header的背景色
   */
  @Prop({ default: "white" }) private background?: string;

  private signalBarHeight = 0;

  get btnOpt(): object {
    return this.background.toLowerCase() === "transparent"
      ? {
          borderRadius: "100%",
          background: "rgba(255,255,255,0.7)"
        }
      : {};
  }

  created(): void {
    // if (UtilDevice.isApp()) {
    //     if (this._query.signalBarHeight) {
    //             resolve(+this._query.signalBarHeight)
    //         } else {
    //             Bridge.appGetSignalBarHeight(height => {
    //                 resolve(height)
    //             })
    //         }
    // }
    if (this.$route.query.signalBarHeight) {
      this.signalBarHeight = parseFloat(this.$route.query.signalBarHeight);
    } else {
      Bridge.appGetSignalBarHeight(height => {
        this.signalBarHeight = parseFloat(height);
      });
    }
  }

  _back(): void {
    if (this.back) {
      this.$emit("back");
    } else {
      if (UtilDevice.isApp()) {
        Bridge.appViewBack(1, {});
      } else {
        window.history.back();
      }
    }
  }

  _share(): void {
    console.log("share", this.shareParams);
    if (!UtilDevice.isApp()) {
      return Toast({
        duration: 1500,
        message: "当前环境不支持分享，请至App分享"
      });
    }
    Bridge.appOpenPage("share", this.shareParams);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  height: 44px;
  box-sizing: content-box;
}

.header-iconfont {
  font-size: 24px;
  &:active {
    opacity: 0.5;
  }
}

.head-left {
  width: 44px;
  margin-left: 20px;
}

.head-right {
  width: 44px;
  margin-right: 20px;
}

.head-center {
  font-size: 16px;
}
</style>
