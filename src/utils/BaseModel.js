/**
 * @description In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 19:13:08
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 19:14:59
 */

import { Toast } from "mint-ui";
import { BaseModel } from "@iskytrip/sdk";

export default class ActBaseModel extends BaseModel {
  dataformat(json) {
    if (+json.resultCode === 0) {
      return json.resultData;
    } else {
      Toast({
        duration: 1500,
        message: json.errMsg
      });
    }
  }
}
