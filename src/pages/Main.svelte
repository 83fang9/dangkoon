<script>
  let hour = new Date().getHours();
  let min = new Date().getMinutes();

  setInterval(() => (min = min + 1), 1000);
</script>

<header>
  <div class="info-bar">
    <div class="info-bar__time">{hour}:{min}</div>
    <div class="info-bar__icons">
      <img src="assets/chart-bar.svg" alt="signal" />
      <img src="assets/wifi.svg" alt="wifi" />
      <img src="assets/battery.svg" alt="battery" />
    </div>
  </div>

  <div class="menu-bar">
    <div class="menu-bar__location">
      <div>고운동</div>
      <div class="menu-bar__location-icon">
        <img src="assets/arrow-down.svg" alt="arrow" />
      </div>
    </div>
    <div class="menu-bar__icons">
      <img src="assets/search.svg" alt="search" />
      <img src="assets/menu.svg" alt="menu" />
      <img src="assets/alert.svg" alt="alert" />
    </div>
  </div>
</header>

<main>
  <a class="write-btn" href="#/write"> +글쓰기</a>
</main>

<footer>
  <div class="footer-block">
    <div class="footer-icons">
      <div class="footer-icons__img">
        <img src="assets/home.svg" alt="" />
      </div>
      <div>홈</div>
    </div>
    <div class="footer-icons">
      <div class="footer-icons__img">
        <img src="assets/document.svg" alt="" />
      </div>
      <div>동네생활</div>
    </div>
    <div class="footer-icons">
      <div class="footer-icons__img">
        <img src="assets/location.svg" alt="" />
      </div>
      <div>내 근처</div>
    </div>
    <div class="footer-icons">
      <img src="assets/chat.svg" alt="" />
      <div>
        <a class="chat-btn" href="chat.html">채팅</a>
      </div>
    </div>
    <div class="footer-icons">
      <div class="footer-icons__img">
        <img src="assets/user.svg" alt="" />
      </div>
      <div>나의 당근</div>
    </div>
  </div>
</footer>
<div class="media-info-msg">화면사이즈를 줄여주세요</div>

<style>
</style>
