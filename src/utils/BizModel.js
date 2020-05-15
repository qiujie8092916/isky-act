/**
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 15:59:43
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 19:15:29
 */
import BaseModel from "./BaseModel";
export class OssConfig extends BaseModel {
  constructor(props = {}) {
    super(props);
    this.method = "get";
    this.url = props.url;
    this.desc = "获取oss上api契约";
  }
}
