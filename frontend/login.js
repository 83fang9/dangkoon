const form = document.querySelector("#login-form");

// let accessToken = null;

const handlesubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  // -> {id:'asjh', password:'1234'} 가져와서
  const sha256Password = sha256(formData.get("password")); //해시태그화
  // pasword는 sha256화 하고
  formData.set("password", sha256Password);

  const res = await fetch("/login", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const accessToken = data.access_token;
  console.log("서버에서 보내온 access 코드는", accessToken); // data = res.status
  console.log(res.status);
  window.localStorage.setItem("token", accessToken); //브라우저 로컬스토리지에 토큰 저장
  alert("로그인되었습니다");

  //   const infoDiv = document.querySelector("#info");
  //   infoDiv.innerText = "로그인되었습니다!!";
  window.location.pathname = "/";

  //   const btn = document.createElement("button");
  //   btn.innerText = "상품가져오기";
  //   btn.addEventListener("click", async () => {
  //     // 서버에서 엑세스토큰이 있어야 정보를 가져올 수 있기떄문에 헤더에 엑세스토큰을 넣어 보낸다
  //     const res = await fetch("/items", {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //   });
  //   infoDiv.appendChild(btn);

  //   if (res.status === 200) {
  //     alert("로그인에 성공했습니다");
  //     window.location.pathname = "/";
  //   } else if (res.status === 401) alert("ID 혹은 비밀번호가 틀렸습니다");
};

form.addEventListener("submit", handlesubmit);
