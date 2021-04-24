
//使用 WebSocket 的網址向 Server 開啟連結
let path, ws;
const hosts = ['127.0.0.1', 'localhost']
for (let i in hosts) {
    path = `ws://${hosts[i]}:6849`;
    console.log('Tested path :: ', path)
    try {
        ws = new WebSocket(path);
        break;
    } catch (e) {
        console.error('websocket creation error :: ', e)
    }
}
const connect = () => {

    //開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
    ws.onopen = () => {
        
        console.log('Websocket connected');
        ws.send(JSON.stringify({cmd: 'inited', data: null}))
    }

    //關閉後執行的動作，指定一個 function 會在連結中斷後執行
    ws.onclose = () => {
    }

    ws.onmessage = event => {

        const { cmd, data } = JSON.parse(event.data)

        try {
            switch (cmd) {
                case 'reply_inited':
                    console.log(data)
                    break;
                default:
            }

        } catch (error) {
            msg.innerHTML = error
        }
    }

    ws.onerror = () => {
        setTimeout(()=>{
            connect();
        },1000)
    }
}

connect()
