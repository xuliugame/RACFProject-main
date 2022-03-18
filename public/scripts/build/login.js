//back button

//login portion
buildLogin = () => {
    //grey box
    let greyBox = document.createElement('div');
    let header  = document.createElement('h2');
    let desc    = document.createElement('p');
    let signUp  = document.createElement('button');

    header.textContent = "Don't Have An Account?";
    desc.textContent   = "Want us to remember you for next time?";
    signUp.textContent = "Sign Up";

    header.classList.add('header');
    desc.classList.add('description');
    signUp.classList.add('second-button');

    header.id = 'back-header';
    greyBox.id = 'grey-box';
    signUp.id = 'sign-up';

    greyBox.appendChild(header);
    greyBox.appendChild(desc);
    greyBox.appendChild(signUp);


    //white box
    let whiteBox = document.createElement('div');
    let header2  = document.createElement('h2');
    let form     = document.createElement('form');
        let label1   = document.createElement('h5');
        let label2   = document.createElement('h5');
        let input1   = document.createElement('input');
        let input2   = document.createElement('input');
        let image1   = document.createElement('img');
        let image2   = document.createElement('img');
        let forgot1  = document.createElement('h5');
        let forgot2  = document.createElement('h5');
        let login    = document.createElement('button');
    form.appendChild(label1);
    form.appendChild(input1);
    form.appendChild(image1);
    form.appendChild(forgot1);
    form.appendChild(label2);
    form.appendChild(input2);
    form.appendChild(image2);
    form.appendChild(forgot2);
    form.appendChild(login);

    form.setAttribute('method','POST');
    form.setAttribute('action','/auth/login');

    header2.textContent  = 'Log In';
    label1.textContent   = 'EMAIL';
    label2.textContent   = 'PASSWORD';
    input1.placeholder   = 'sample@email.com';
    input2.placeholder = '************';
    forgot1.textContent  = 'FORGOT EMAIL';
    forgot2.textContent  = 'FORGOT PASSWORD';
    login.textContent    = 'Login';

    label1.classList.add('label');
    label2.classList.add('label');
    forgot1.classList.add('forgot');
    forgot2.classList.add('forgot');
    input1.classList.add('input-el');
    input2.classList.add('input-el');
    header2.classList.add('header');
    image1.classList.add('img-login');
    image2.classList.add('img-login');

    input1.id = 'email';
    input1.name = 'email';
    input2.id = 'password';
    input2.name = 'password';

    input2.setAttribute('type','password');

    login.id = 'btn-login';
    header2.id = 'front-header';
    whiteBox.id = 'white-box';

    image1.src = '/images/email.png';
    image2.src = '/images/password.png';

    whiteBox.appendChild(header2);
    whiteBox.appendChild(form);
    
    greyBox.appendChild(whiteBox);

    //back button
    let backDiv = document.createElement('div');
    
    backDiv.id = 'back-button';
    backDiv.style.backgroundImage = 'url(/images/home.png)';


    document.getElementById('content').appendChild(greyBox);
    document.getElementById('content').appendChild(backDiv);
}

buildLogin();

document.getElementById('sign-up').addEventListener('click', ()=>{
    window.location.href=`/signup`;
});

document.getElementById('back-button').addEventListener('click', ()=>{
    window.location.href=`/homepage`;
});