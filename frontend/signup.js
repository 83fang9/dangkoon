const form = document.querySelector("#signup-form");

//password 비교하기
const checkpassword = () => {
    const formData = new FormData(form);   //new FormData 이다. 대문자 중요
    const password1 = formData.get("password");
    const password2 = formData.get("password2");

    if (password1 === password2) {
        return true;
    }else return false;
};

//회원 정보 제출 submit 로직
const handlesubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(form);
    // -> {id:'asjh', password:'1234'} 가져와서
    const sha256Password = sha256(formData.get('password')); //해시태그화
    // pasword는 sha256화 하고
    formData.set('password',sha256Password);
    //  console.log(formData.get('password'));

    const div = document.querySelector('#info')

    if (checkpassword()) {
    //sha256화한 PW를 다시 폼데이터에 (by body) 넣어 전송 -> POST
        const res = await fetch('/signup', {
            method:'POST',
            body: formData,
        });

        //서버에 200을 보내면 성공했다는 로직
        const data = await res.json();
        if (data === '200') {
        // div.innerText = "회원가입에 성공했습니다!!";
        // div.style.color = 'blue';
        alert('회원가입에 성공했습니다')
        window.location.pathname = '/login.html';
    };

    } else {     
        div.innerText = '비밀번호가 일치하지 않습니다';
        div.style.color = 'red';
    };

}; 


form.addEventListener("submit", handlesubmit)
