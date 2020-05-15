/**
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 15:59:43
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 16:47:29
 */
import { BaseModel } from "@iskytrip/sdk";

export class OssConfig extends BaseModel {
  constructor(props = {}) {
    super(props);
    this.method = "get";
    this.url = props.url;
    this.desc = "获取oss上api契约";
  }
  dataformat = t => t.resultData;
}
