# 说明 
[建议和bug反馈](https://github.com/zt5/http-server/issues/new)

## 特性
- 在vscode中快速选择Chrome,Firefox,Microsoft Edge,Ie(仅在Windows平台有效),Safari(仅在Mac平台有效)浏览器打开html
- 设置中可以选择 Chrome,Firefox的特殊版本

## 如何使用
* html文件右键，编辑区右上角，编辑区菜单  都可以选择对应的浏览器

## 扩展设置
|属性名|类型|枚举值|默认|说明|
|:-|:-|:-|:-|:-|
|`devlog`|`boolean`|`true`,`false`|`false`|是否打印详细日志|
|`firefoxType`|`enum`|`normal`,`developer`|`nightly`|Firefox的版本类型 (`注¹`)|
|`chromeType`|`enum`|`normal`,`developer`|`canary`|Chrome的版本类型 (`注²`)|
|`port`|`number`|`-`|`7000`|服务器首选端口 (`注³`)|

## 注释
>`注¹`<br>  
>>`normal`：正式版本<br>
>>`developer`：[火狐开发者版本](https://www.mozilla.org/zh-CN/firefox/all/#product-desktop-developer)<br>
>>`nightly`：[火狐Nightly版本](https://www.mozilla.org/zh-CN/firefox/all/#product-desktop-nightly)
---
>`注²`<br>  
>>`normal`：正式版本<br>
>>`developer`：[谷歌开发者版本](https://www.google.cn/chrome/dev/)<br>
>>`canary`：[谷歌每日构建版本](https://www.google.cn/intl/zh-CN/chrome/canary/)
---
>`注³` 
>>服务器使用端口 如果被占用默认寻找可用端口
---