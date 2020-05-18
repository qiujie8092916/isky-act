<!--
 * @description oss Api 契约
 * @exports class
 * @Author jieq
 * @Date 2020-05-15 16:10:16
 * @LastEditors jieq
 * @LastEditTime 2020-05-15 17:27:42
--> 
```
{
    // footer拼接图
    footer[String]: "",
    // app的footer拼接图
    footerApp[String]: "",
    // 背景大图
    backgroundImage[String]: "",
    // 跳转详情
    contentItem[Array<Object>]: [
        {
            // id
            id[number]: "",
            // 图片
            image[String]: "",
        }]
    ],
    // 分享数据 apollo
    shareParams[object]: {
        paramsReqList[Array]: [],
        sharePageType[String]: "",
        sharePageImage[String]: "",
        sharePageCategory[String]: "",
    }
}
```
