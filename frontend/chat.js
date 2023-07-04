function displayChat(chat) {
  const ul = document.querySelector("#chat-ul");
  const li = document.createElement("li");
  li.innerText = `[id:${chat.id}] ${chat.content}`;
  ul.appendChild(li);
}

async function readChat() {
  const res = await fetch("/chats"); // <- get (fetch만 있으면 = get)
  const jsonRes = await res.json(); // res를 서버로 가져오는데 -> 자바스크립트로 가져오니 .json으로 만들어 jsonRes 만듬
  //console.log(jsonRes);   //배열로 서버에 저장했으니 가져오면 배열로 가져오게 될꺼야
  const ul = document.querySelector("#chat-ul"); // ul 인데 class가 chat-ul 인 ul을 가져올꺼야
  ul.innerHTML = ""; // ul에 가져오면 있던건 지워버려
  jsonRes.forEach(displayChat); //불러온 jsonRes배열을 디플챗 함수에 하나하나 적용해 -> 1,2,3 차례로 디스플레이에 보여짐
}

readChat();

async function createChat(value) {
  //넘어온 발류
  console.log(value); //체크포인트 (넘어온 발류)
  const res = await fetch("/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: new Date().getTime(),
      content: value,
    }), //서버는 문자열로만 보내기 때문에 스트링화 하여 보낸다
  });

  // const jsonRes = await res.json();
  readChat();
}

function handleSubmit(event) {
  event.preventDefault();
  //   console.log("동작?");   //연결된지 확인
  const input = document.querySelector("#chat-input");
  //console.log(input.value); // 인풋값 잘 가져오는지 확인
  createChat(input.value); // 발류값 넘겨쥼
  input.value = ""; //인풋란에 남아있는 발류는 지워쥼
}

//chat-form안에서 submit이라는 이벤트가 발생시 -> handleSubmit을 실행한다
const form = document.querySelector("#chat-form");
form.addEventListener("submit", handleSubmit);

readChat();
