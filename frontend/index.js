//  구현해야 될 아이템
//      <div class="item-list">
//         <div class="item-list__img">
//           <img src="assets/img.svg" alt="" />
//         </div>

//         <div class="item-list__info">
//           <div class="item-list__info-title">게이밍 PC 팝니다</div>
//           <div class="item-list__info-meta">역삼동 19초 전</div>
//           <div class="item-list__info-price">80만원</div>
//         </div>
//       </div>

//timestamp로 DB에 저장된 시간을 현재와 비교하여 흘러간 시간을 불러오는 함수
//  한국시간 UTC+9시간 ## 보낼때 폼데이터로 보내는데 그러면 세계시간 기준이다
const calcTime = (timestamp) => {
  const curTime = new Date().getTime() - 9 * 60 * 60 * 1000; //9시간을 뺴준다 (밀리세컨기준)
  const time = new Date(curTime - timestamp); //new Date로 묶으면 이 객체에서 시간, 날짜 추출 가능하다.
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();

  if (hour > 0) return `${hour} 시간 전`;
  else if (minute > 0) return `${minute} 분전`;
  else if (second > 0) return `${second} 초전`;
  else return "방금 전";
};

const renderData = (data) => {
  const main = document.querySelector("main");

  data.reverse().forEach(async (obj) => {
    //리버스 입력이유: 어레이 반대로 해줌 -> 최신순부터 올라오게 하려고
    //하지만 async는 동기인데 forEach는 비동기라 파일이 크면 순서가 뒤섞일 수 있음
    // 그럴때 for~of 루프나 promise.all을 쓴다
    const div = document.createElement("div");
    div.className = "item-list";

    const InfoDiv = document.createElement("div");
    InfoDiv.className = "item-list__info";

    const imgDiv = document.createElement("div");
    imgDiv.className = "item-list__img";

    const img = document.createElement("img");
    // img.style.maxWidth = "300px";
    // img.style.height = "150px";
    const res = await fetch(`images/${obj.id}`); //이미지 가져온다. id에 따라
    const blob = await res.blob(); //이미지를 블롭화한다
    const url = URL.createObjectURL(blob); //블롭된 이미지를 URL로 만든다
    img.src = url; //이미지 url을 넣는다

    const InfoTitleDiv = document.createElement("div");
    InfoTitleDiv.className = "item-list__info-title";
    InfoTitleDiv.innerText = obj.title;

    const InfoMetaDiv = document.createElement("div");
    InfoMetaDiv.className = "item-list__info-meta";
    InfoMetaDiv.innerText = obj.place + " " + calcTime(obj.insertAt);

    const InfoPriceDiv = document.createElement("div");
    InfoPriceDiv.className = "item-list__info-price";
    InfoPriceDiv.innerText = obj.price;

    div.appendChild(imgDiv);
    imgDiv.appendChild(img);
    div.appendChild(InfoDiv);
    InfoDiv.appendChild(InfoTitleDiv);
    InfoDiv.appendChild(InfoMetaDiv);
    InfoDiv.appendChild(InfoPriceDiv);

    main.appendChild(div);
  });
};

const fetchList = async () => {
  const accessToken = window.localStorage.getItem("token");
  const res = await fetch("/items", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    alert("로그인이 필요합니다.");
    window.location.pathname = "/login.html";
    return;
  }
  const data = await res.json();
  renderData(data);
  //   console.log(data); -> 불러온 어레이 확인
};

fetchList();
