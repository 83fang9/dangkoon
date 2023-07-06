const form = document.querySelector("#login-form");

const checkpassword = () => {
    const formData = new FormData(form);   //new FormData 이다. 대문자 중요
    const password1 = formData.get("password");
    const password2 = formData.get("password2");



    if (password1 === password2) {
        return true;
    }else return false;
};

const handlesubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(form);
    // -> {id:'asjh', password:'1234'} 가져와서
    const sha256Password = sha256(formData.get('password')); //해시태그화
    // pasword는 sha256화 하고
    formData.set('password',sha256Password);

    const res = await fetch('/login', {
        method:'POST',
        body: formData,
    });
    const data = await res.json();
   
}; 


form.addEventListener("submit", handlesubmit)
