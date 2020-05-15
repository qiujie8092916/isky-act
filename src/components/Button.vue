<!--
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 14:14:31
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 15:13:20
-->
<template>
  <button class="btn" @click.stop="onPress"><slot></slot></button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class IconFont extends Vue {
  /** iconfont的class */
  @Prop() private font!: string;

  private onPress() {
    this.$emit("onPress");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.btn {
  border: 0;
  outline: none;
  background: transparent;
  &:active {
    opacity: 0.5;
  }
}
</style>
