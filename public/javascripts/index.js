function $(s){
    return document.querySelectorAll(s);
}

var lis = $("#list li");

for(var i = 0;i<lis.length;i++){

    lis[i].onclick = function(){

        for(var j=0;j<lis.length;j++){
            lis[j].className = "";
        }
        this.className = "selected";

        load("/media/"+ this.title);

    }

}

// ajax 请求
var xhr = new XMLHttpRequest();

var ac = new (window.AudioContext || window.webkitAudioContext)(); //创建对象

var gainNode = ac[ac.createGain?"createGain":"createGainNode"]()   //控制音量

gainNode.connect(ac.destination);


var source= null;
var count = 0; // 计数器

function load(url){
    var n = ++count;
    source && source[source.stop ? "stop" : "noteOff"](); // 停止播放音乐 
    xhr.abort(); // 终止掉上一次请求

    xhr.open("GET",url);  // 打开一个请求
    xhr.responseType = "arraybuffer"  // 请求返回数据类型 （）
    xhr.onload= function(){ // 请求成功 回调
        // 解码音频数据  成功回调 错误回调
        if(n != count){
           return;
        }
        ac.decodeAudioData(xhr.response, function(buffer){
            if(n != count) return;
            // if(n != count){
            //     console.log(n)
            //     console.log(count)
            // }
            console.log("解码成功")
            // 创建对象
            var bufferSource = ac.createBufferSource();
            bufferSource.buffer = buffer;

            // 控制音量
            bufferSource.connect(gainNode);

            // bufferSource.connect(ac.destination);  没有必要在连接了

            bufferSource[bufferSource.start?"start": "noteOn"](0); // 播放

            source = bufferSource // 暂时保存下来

        }, function(err){
            console.log(err)
        })

    }
    xhr.send(); // 发送请求
}

// 改变音量大小函数
function changeVolume(percent){
    gainNode.gain.value = percent*percent
}


$("#volume")[0].onchange = function(){
    changeVolume(this.value/this.max);
}

$("#volume")[0].onchange() // 先调用一下 让60 生效
