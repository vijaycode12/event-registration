//To show messages
function showError(id,message,inputId){
    const el=document.getElementById(id);
    el.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    el.classList.add('visible');
    
    if(inputId){
        document.getElementById(inputId).classList.add('input-error');
        document.getElementById(inputId).classList.remove('input-normal');
    }
}

//To hide messages
function hideError(id,inputId){
    const el = document.getElementById(id);
    el.innerHTML = '';
    el.classList.remove('visible');

    if(inputId){
        document.getElementById(inputId).classList.remove('input-error');
        document.getElementById(inputId).classList.add('input-normal');
    }
}

//Validation Function
function validateUsername(){
    const username = document.getElementById('name').value.trim();
    if(!username){
        showError('error-name','Username is required','name');
        return false;
    }
    if(username.length<=2){
        showError('error-name','Username must be more that 2 characters','name');
        return false;
    }
    hideError('error-name','name');
    return true;
}

function validateEmail(){
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
        showError('error-email','Email is required','email');
        return false;
    }
    if(!emailRegex.test(email)){
        showError('error-email','Enter a valid email','email');
        return false;
    }
    hideError('error-email','email');
    return true;
}

function validatePassword(){
    const password = document.getElementById('password').value;
    if(!password){
        showError('error-pass','Password is required','password');
        return false;
    }
    if(password.length<6){
        showError('error-pass','Password must be atleast 6 characters','password');
        return false;
    }
    hideError('error-pass','password');
    return true;
}

function validateConfirmPassword(){
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('re-password').value;
    if(!confirmPassword){
        showError('error-repass','Please Re-Enter the password','re-password');
        return false;
    }
    if(password!=confirmPassword){
        showError('error-repass','Password does not match','re-password');
        return false;
    }
    hideError('error-repass','re-password');
    return true;
}

//This lines are return for live validation 
document.getElementById('name').addEventListener('input', validateUsername);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);
document.getElementById('re-password').addEventListener('input', validateConfirmPassword);

//Clear previous error messages
['name', 'email', 'password', 're-password'].forEach(id=>
    document.getElementById(id).classList.add('input-normal')
);

window.addEventListener('DOMContentLoaded', () => {
document.querySelector('form').addEventListener('submit',async function (e) {

    e.preventDefault();

    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    return;
  }

    const username = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('re-password').value;

    const Message = document.querySelector('.status-message');

    const backendUrl = window.BACKEND_URL;


  //CONNECTING TO THE BACKEND
    try{
        const response = await fetch(`${backendUrl}/api/v1/auth/sign-up`,{
            method:'POST',
            credentials:'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username,email,password,confirmPassword}),
        });

        const data = await response.json();

        Message.classList.remove('success', 'fail');

        if(response.ok && data.success){
            Message.innerHTML='<i class="fa-solid fa-circle-check"></i> Signup successful! Redirecting to login...';
            Message.classList.add('success');

            //This function will redirect to Login page after succesfull signup 
            setTimeout(()=>{
                Message.innerHTML = '';
                Message.classList.remove('success');
                window.location.href='login.html';
            },3700);
        }
        else if(response.status===409){
            Message.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${data.message||"User already exists"}`;
            Message.classList.add('fail');
            setTimeout(() => {
                Message.innerHTML = '';
                Message.classList.remove('fail');
            }, 3700);
        }
        else if(response.status>=400 && response.status<500){
            Message.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${data.message||"Invalid Input"}`;
            Message.classList.add('fail');
            setTimeout(() => {
                Message.innerHTML = '';
                Message.classList.remove('fail');
            }, 5000);
        }
        else{
            Message.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${data.message||data.error}`;
            Message.classList.add('fail');
            setTimeout(() => {
                Message.innerHTML = '';
                Message.classList.remove('fail');
            }, 5000);
        }
    }catch(error){
        Message.innerHTML='<i class="fa-solid fa-circle-exclamation"></i> Network or server issue.Please try again later. ';
        Message.classList.add('fail');
        Message.classList.remove('success');
         setTimeout(() => {
                Message.innerHTML = '';
                Message.classList.remove('fail');
            }, 5000);
    }

});
});