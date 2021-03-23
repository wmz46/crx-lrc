# 使用
- 1.chrome的扩展程序 加载已解压的扩展程序。新版本chrome使用crx包离线安装会无法启用。
- 2.启用桌面歌词应用。下载地址：https://github.com/wmz46/DesktopLrc/releases 找到最新版本的default.zip包下载后，解压运行exe程序即可。
- 3.打开咪咕网页播放音乐。

支持咪咕音乐、qq音乐和网易云音乐。网易云音乐使用时需要打开歌词面板。

# 原理
一切基于chrome插件可以在原页面注入并执行脚本的原理实现

- 1.通过定时器，获取页面歌词。
- 2.页面通过websocket和本地桌面歌词应用通讯。
- 3.桌面歌词应用显示歌词

# 协议
当打开咪咕音乐、qq音乐或网易云音乐的网页时，会尝试连接本地websocket，端口固定`15577`，失败会一直自动重连，直到连接成功。

当连接成功时，会通过ws定时发送歌词信息，格式如下：
```json
[{"text": "第一句歌词", "active": true}, { "text": "第二句歌词", "active": false }]
```
注意：ws服务器接收的是上述格式的json字符串，记得反序列化。

每次都只会发送两句歌词，因为桌面歌词程序只需要显示两行歌词，发多无益。

数组第一个永远是奇数歌词，第二个永远是偶数歌词。也就是当播到第二句时，歌词信息如下：
```json
[{"text": "第三句歌词", "active": false}, { "text": "第二句歌词", "active": true }]
```

text为歌词内容，active表示是否是当前播放的歌词，歌词高亮用。

如果你想自己开发一个桌面歌词软件，可以根据此协议进行处理。

