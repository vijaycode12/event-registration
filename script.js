//To show message
function showError(id,message,inputId){
    const el = document.getElementById(id);
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
    el.innerHTML="";
    el.classList.remove('visible');

    if(inputId){
        document.getElementById(inputId).classList.remove('input-error');
        document.getElementById(inputId).classList.add('input-normal');
    }
}

function validateFirstName(){
    const firstName = document.getElementById('fname').value.trim();
    if(!firstName){
        showError('error-fname',"First Name is required",'fname');
        return false;
    }
    if(firstName.length<3){
        showError('error-fname',"First name should be atleast 3 letters",'fname');
        return false;
    }
    hideError('error-fname','fname');
    return true;
}

function validateLastName(){
    const lastName = document.getElementById('lname').value.trim();
    if(!lastName){
        showError('error-lname',"Last Name is required",'lname');
        return false;
    }
    if(lastName.length<3){
        showError('error-lname',"Last name should be atleast 3 letters",'lname');
        return false;
    }
    hideError('error-lname','lname');
    return true;
}

function validateEmail(){
    const email = document.getElementById('Email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email){
        showError('error-email',"Email is required",'Email');
        return false;
    }
    if(!emailRegex.test(email)){
        showError('error-email',"Enter a valid email",'Email');
        return false;
    }
    hideError('error-email','Email');
    return true;
}

function validatePhone(){
    const phone = document.getElementById('ph').value.trim();
    const phoneRegex=/^[6-9]\d{9}$/;
    if(!phone){
        showError('error-phone',"Phone number is required",'ph');
        return false;
    }
    if(!phoneRegex.test(phone)){
        showError('error-phone',"Enter a valid phone number",'ph');
        return false;
    }
    hideError('error-phone','ph');
    return true;
}

function validateEvent(){
    const event = document.getElementById('drop').value;
    if(!event){
        showError('error-event',"Event Type is required",'drop');
        return false;
    }
    hideError('error-event','drop');
    return true;
}

function validateQuery(){
    const query = document.getElementById('query').value;
    if(!query){
        showError('error-query',"Enter query",'query');
        return false;
    }
    hideError('error-query','query');
    return true;
}

document.getElementById('fname').addEventListener('input',validateFirstName);
document.getElementById('lname').addEventListener('input',validateLastName);
document.getElementById('Email').addEventListener('input',validateEmail);
document.getElementById('ph').addEventListener('input',validatePhone);
document.getElementById('drop').addEventListener('input',validateEvent);
document.getElementById('query').addEventListener('input',validateQuery);

['fname', 'lname', 'Email', 'ph','drop','query'].forEach(id=>
    document.getElementById(id).classList.add('input-normal')
);

const backendUrl = window.BACKEND_URL;


window.addEventListener('DOMContentLoaded',async()=>{
    document.querySelector('form').addEventListener('submit',async function(e) {
        
        e.preventDefault();

        console.log('Submit handler running');

        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isEventValid = validateEvent();
        const isQueryValid = validateQuery();

        if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPhoneValid || !isEventValid || !isQueryValid) {
            return;
        }

        const firstName = document.getElementById('fname').value.trim();
        const lastName = document.getElementById('lname').value.trim();
        const email = document.getElementById('Email').value.trim();
        const phone = document.getElementById('ph').value;
        const eventType = document.getElementById('drop').value;
        const query = document.getElementById('query').value;

        const Message = document.querySelector('.status-message');

        //CONNECTING TO BACKEND
        try{
            const response = await fetch(`${backendUrl}/api/v1/contact`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({firstName,lastName,email,phone,eventType,query}),
            })

            const data = await response.json();

            Message.classList.remove('success', 'fail');

            if(response.ok && data.success){
                Message.innerHTML='<i class="fa-solid fa-circle-check"></i> Message sent!';
                Message.classList.add('success');

                setTimeout(() => {
                    Message.innerHTML = '';
                    Message.classList.remove('success');
                    }, 5000);
            }
            else if(response.status===400){
                Message.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${data.message||"All fields are required"}`;
                Message.classList.add('fail');
                setTimeout(() => {
                    Message.innerHTML = '';
                    Message.classList.remove('fail');
                }, 5000);
            }
            else if(response.status>=400 && response.status<=500){
                Message.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i> ${data.message||"Failed to sent"}`;
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
            Message.classList.remove('success');
            Message.classList.add('fail');
            Message.innerHTML='<i class="fa-solid fa-circle-exclamation"></i> Network or server issue.Please try again later. ';
            setTimeout(() => {
                Message.innerHTML = '';
                Message.classList.remove('fail');
            }, 5000);
        }
    });

    const navList = document.querySelector('.navdata ul');
    let loginLi = navList.querySelector('login-li');
    let profileLi = document.getElementById('profile-li');

    if (profileLi) profileLi.remove();
    if (!loginLi) {
        loginLi = document.createElement("li");
        loginLi.id = "login-li";
        loginLi.innerHTML = `<a href="login.html">Login</a>`;
        navList.appendChild(loginLi);
    }
    loginLi.style.display = "none";

    let isLoggedIn = false;
    try{
        const res = await fetch(`${backendUrl}/api/v1/auth/me`,{credentials:"include"});
        
        const data = await res.json();

        isLoggedIn = data.success;
    }catch{}

    if(isLoggedIn){
        loginLi.style.display = "none";
        //We will add icon in place of log-in after login
        if(!document.getElementById('profile-li')){
            profileLi = document.createElement("li");
            profileLi.id = "profile-li";
            profileLi.innerHTML=`
            <div class="profile-container">
                <i class="fa-solid fa-user" id="navbar-profile-icon"></i>
                <div id="profile-dropdown">
                    <button id="signout-btn">Sign Out</button>
                </div>
            </div>
            `;
            navList.appendChild(profileLi);

            document.getElementById('navbar-profile-icon').onclick=()=>{
                const dd = document.getElementById('profile-dropdown');
                dd.style.display = dd.style.display === "block"?"none":"block";
            };

            document.getElementById('signout-btn').onclick = async () => {
                await fetch("http://localhost:5000/api/v1/auth/sign-out", { method: "POST", credentials: "include" });
                location.reload();
            };
            document.addEventListener('click', (event) => {
                const dropdown = document.getElementById('profile-dropdown');
                const icon = document.getElementById('navbar-profile-icon');
                if (dropdown && icon && !dropdown.contains(event.target) && !icon.contains(event.target)) {
                    dropdown.style.display = 'none';
                }
            });
            }
        }else{
            profileLi = document.getElementById("profile-li");
            if (profileLi) profileLi.remove();
            loginLi.style.display = "inline-block";

    }
});


