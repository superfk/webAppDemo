// 宣告變數，取得DOM元素參考
const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const btn = document.getElementById("btn");
let path, ws;

//使用 WebSocket 的網址向 Server 開啟連結
const hosts = ["127.0.0.1", "localhost"];
for (let i in hosts) {
  path = `ws://${hosts[i]}:6849`;
  console.log("Tested path :: ", path);

  try {
    ws = new WebSocket(path);
    break;
  } catch (e) {
    console.error("websocket creation error :: ", e);
  }
}

const connect = () => {
  //開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
  ws.onopen = () => {
    console.log("Websocket connected");
    ws.send(JSON.stringify({ cmd: "inited", data: null }));
  };

  //關閉後執行的動作，指定一個 function 會在連結中斷後執行
  ws.onclose = () => {};

  ws.onmessage = (event) => {
    const { cmd, data } = JSON.parse(event.data);

    try {
      switch (cmd) {
        case "reply_inited":
          console.log(data);
          break;
        default:
      }
    } catch (error) {
      msg.innerHTML = error;
    }
  };

  ws.onerror = () => {
    setTimeout(() => {
      connect();
    }, 1000);
  };
};

connect();

// 事件監聽
num1.addEventListener("change", (e) => {
  console.log(e.target.value);
});

num2.addEventListener("change", (e) => {
  console.log(e.target.value);
});

btn.addEventListener("click", (event) => {
  const v1 = num1.value;
  const v2 = num2.value;
  ws.send(JSON.stringify({
    cmd: "add",
    value1: v1,
    value2: v2,
  }));
});
