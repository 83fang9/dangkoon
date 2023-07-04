const form = document.getElementById("write-form"); //form에서 요소를 가져온다

const handleSubmitForm = async (event) => {
  event.preventDefault(); //이벤트 순식간에 넘어가는거 방지 (submit에 사용 -> reload방지)

  const body = new FormData(form); //fastapi는 폼데이터 형식으로 보낸다
  body.append("insertAt", new Date().getTime()); //시간을 추가로 넣어주기 위한 작업 (세계시간기준임)

  try {
    const res = await fetch("/items", {
      //fetch만 쓰면 get -> POST
      method: "POST",
      body: body,
    });

    const data = await res.json();
    if (data === "200") window.location.pathname = "/";
  } catch (e) {
    console.error(e); //try{ } catch{ } -> try하고 에러나면 catch 실행
  }

  // console.log("제출완료");
};

form.addEventListener("submit", handleSubmitForm); // 제출되면 이벤트 ㄱㄱ
