//To show message
function showError(id,message,inputId){
    const el = document.getElementById(id);
    el.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    el.classList.add('visible');

    if(inputId){
        document.getElementById(id).classList.add('input-error');
        document.getElementById(id).classList.remove('input-normal');
    }
}

//To hide error
function hideError(id,inputId){
    const el = document.getElementById(id);
    el.innerHTML='';
    el.classList.remove('visible');

    if(inputId){
        document.getElementById(id).classList.remove('input-error');
        document.getElementById(id).classList.add('input-normal');
    }
}

function validateEmail(){
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email){
        showError('error-email',"Email is Required",'email');
        return false;
    }
    if(!emailRegex.test(email)){
        showError('error-email',"Enter valid email",'email');
        return false;
    }
    hideError('error-email','email');
    return true;
}

function validatePassword(){
    const password = document.getElementById('password').value;

    if(!password){
        showError('error-pass',"Password is Required",'password');
        return false;
    }
    if(password.length<6){
        showError('error-pass',"Password should be atleast 6 characters",'password');
        return false;
    }
    hideError('error-pass','password');
    return true;
}

document.getElementById('email').addEventListener('input',validateEmail);
document.getElementById('password').addEventListener('input',validatePassword);

['email','password'].forEach(id=>{
    document.getElementById(id).classList.add('input-normal');
})

window.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('form').addEventListener('submit',async function(e) {

    e.preventDefault();
    
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if(!isEmailValid || !isPasswordValid){
        return;
    }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const Message = document.querySelector('.status-message');

    const backendUrl = window.BACKEND_URL;


    //CONNECTING TO BACKEND

    try{
        const response = await fetch(`${backendUrl}/api/v1/auth/log-in`,{
            method:'POST',
            credentials: 'include',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email,password}),
        });

        const data = await response.json();

        Message.classList.remove('success', 'fail');

        if(response.ok && data.success){
            Message.innerHTML = '<i class="fa-solid fa-circle-check"></i> Login successful! Redirecting...';
            Message.classList.add('success');

            // Hide message after 5 seconds
            setTimeout(() => {
                Message.innerHTML = '';
                Message.classList.remove('success');
            }, 4000);

            // Redirect or other login success logic here
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
        else {
            Message.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${data.message || 'Login failed'}`;
            Message.classList.add('fail');

            // Hide message after 5 seconds
            setTimeout(() => {
                Message.innerHTML = '';
                Message.classList.remove('fail');
            }, 4000);
        }
    }catch (error) {
      Message.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Network error. Please try again.';
      Message.classList.add('fail');
      Message.classList.remove('success');

      setTimeout(() => {
        Message.innerHTML = '';
        Message.classList.remove('fail');
      }, 5000);
    }
});
});