(function () {
    var globalWs = null; 
    var wsAddr = 'ws://127.0.0.1:15577';
	var lastSendMsg = "";
    var sendLrc = function (lrc) {
        if (window.WebSocket) {            
			var ws = globalWs;
			if (!ws) {
				ws = new WebSocket(wsAddr);
			} else if (ws.readyState == WebSocket.OPEN) {
				ws.send(JSON.stringify(lrc))
			}
			ws.onopen = function () {
				//注释掉，没打开就抛弃，避免一下连接成功推送很多歌词过去
				// ws.send(JSON.stringify(lrc))
			};
			ws.onmessage = function (e) {
				console.info(e.data);
			};
			ws.onerror = function () { 
				console.error("未安装或启动桌面歌词服务")			 
			}
			ws.onclose = function () {				 
				var ws2 = new WebSocket(wsAddr);
				ws2.onopen = ws.onopen
				ws2.onclose = ws.onclose
				ws2.onmessage = ws.onmessage;
				ws2.onerror = ws.onerror;
				ws = ws2;
				globalWs = ws;			 
			}
			globalWs = ws;            
        } else {
            console.error('浏览器不支持websocket')
        }
    };

    function updateLrc() {
        var lrc_list_dom = [];
        var activeClass = "";
        //获取歌词
        if (window.location.hostname == "music.migu.cn") {
            //咪咕音乐
            lrc_list_dom = document.querySelectorAll(".lyric p");
            activeClass = "on";
        } else if (window.location.hostname == "y.qq.com") {
            //qq音乐
            lrc_list_dom = document.querySelectorAll(".song_info__lyric_inner p")
            activeClass = "on";
        } else if (window.location.hostname == "music.163.com") {
            //网易云音乐
            lrc_list_dom = document.querySelectorAll(".listlyric.j-flag .j-flag")
            activeClass = "z-sel";

        }

        var lyric = [{
            text: '',
            active: false
        }, {
            text: '',
            active: false
        }];
        var exist = false;
        for (var i = 0; i < lrc_list_dom.length; i++) {
            if (lrc_list_dom[i].classList.contains(activeClass)) {
                if (i < lrc_list_dom.length - 1) {
                    lyric[i % 2].text = lrc_list_dom[i].innerText;
                    lyric[(i + 1) % 2].text = lrc_list_dom[i + 1].innerText;
                    lyric[i % 2].active = true;
                    lyric[(i + 1) % 2].active = false;
                } else {
                    lyric[i % 2].text = lrc_list_dom[i].innerText;
                    lyric[(i + 1) % 2].text = '';
                    lyric[i % 2].active = true;
                    lyric[(i + 1) % 2].active = false;
                }
                exist = true;
                break;
            }
        }
        if (!exist) {
            lyric = [{
                text: '',
                active: false
            }, {
                text: '',
                active: false
            }];
        }
		if(lastSendMsg != JSON.stringify(lyric)){
			//和上次不一样才需要发送
			sendLrc(lyric);
		}
		lastSendMsg = JSON.stringify(lyric);
        
    }
    window.setInterval(updateLrc, 500);
    console.log('桌面歌词插件加载完毕')

})();