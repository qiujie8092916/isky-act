<!--
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 13:24:31
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 13:53:59
-->
<template>
  <div :class="['iconfont', font]" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class IconFont extends Vue {
  /** iconfont的class */
  @Prop() private font!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
