//login portion
buildSignUp = () => {
    //grey box
    let greyBox = document.createElement('div');
    let header  = document.createElement('h2');
    let desc    = document.createElement('p');
    let login  = document.createElement('button');

    header.textContent = "Have an account already?";
    desc.textContent   = "Go to the login page to speed up the process.";
    login.textContent = "Login";

    header.classList.add('header');
    desc.classList.add('description');
    login.classList.add('second-button');

    header.id = 'back-header';
    greyBox.id = 'grey-box';
    login.id = 'login';

    greyBox.appendChild(header);
    greyBox.appendChild(desc);
    greyBox.appendChild(login);


    //white box
    let whiteBox = document.createElement('div');
    let header2  = document.createElement('h2');
    let form     = document.createElement('form');
        let label1   = document.createElement('h5');
        let label2   = document.createElement('h5');
        let label3   = document.createElement('h5');
        let label4   = document.createElement('h5');
        let label5   = document.createElement('h5');
        let label6   = document.createElement('h5');
        let label7   = document.createElement('label');
        let label8   = document.createElement('label');
        let terms    = document.createElement('a');
        let input1   = document.createElement('input');
        let input2   = document.createElement('input');
        let input3   = document.createElement('input');
        let input4   = document.createElement('input');
        let input5   = document.createElement('input');
        let input6   = document.createElement('input');
        let break1   = document.createElement('br');
        let break2   = document.createElement('br');
        let input7   = document.createElement('input');
        let input8   = document.createElement('input');
        let signUp   = document.createElement('button');
    form.appendChild(label1);
    form.appendChild(input1);
    form.appendChild(label2);
    form.appendChild(input2);
    form.appendChild(label3);
    form.appendChild(input3);
    form.appendChild(label4);
    form.appendChild(input4);
    form.appendChild(label5);
    form.appendChild(input5);
    form.appendChild(label6);
    form.appendChild(input6);
    form.appendChild(break1);
    form.appendChild(input7);
    form.appendChild(label7);
    form.appendChild(break2);
    form.appendChild(input8);
    form.appendChild(label8);
    form.appendChild(signUp);

    form.setAttribute('action', '/auth/register');
    form.setAttribute('method','POST');

    header2.textContent  = 'Sign Up';

    label1.textContent   = 'ENTER YOUR FIRST & LAST NAME';
    label2.textContent   = 'ENTER YOUR EMAIL';
    label3.textContent   = 'ENTER YOUR ADDRESS';
    label4.textContent   = 'ENTER YOUR ZIP CODE';
    label5.textContent   = 'ENTER YOUR PASSWORD';
    label6.textContent   = 'RETYPE YOUR PASSWORD';
    label7.textContent   = 'I would like to recieve local venues, events, and updates from the RACF.'
    label8.textContent   = 'I agree to the RACF';
    terms.textContent    = ' Terms of Service.';

    label8.appendChild(terms);

    input1.placeholder   = 'John Doe';
    input2.placeholder   = 'sample@email.com';
    input3.placeholder   = '12 Boe Av., Rochester, NY';
    input4.placeholder   = '144532';
    input5.placeholder   = '*************';
    input6.placeholder   = '*************';
    signUp.textContent    = 'Create Account';

    input1.id = 'name';
    input1.name = 'name';
    input2.id = 'email';
    input2.name = 'email';
    input3.id = 'address';
    input3.name = 'address';
    input4.id = 'zip';
    input4.name = 'zip';
    input5.id = 'password';
    input5.name = 'password';
    input6.id = 'confirmpassword';
    input6.name = 'confirmpassword';
    input7.name = 'add-email-list';
    input8.name = 'terms-of-service';

    input7.classList.add('cbox');
    input8.classList.add('cbox');

    label7.for = 'add-email-list';
    label8.for = 'terms-of-service';

    label1.classList.add('label');
    label2.classList.add('label');
    label3.classList.add('label');
    label4.classList.add('label');
    label5.classList.add('label');
    label6.classList.add('label');
    input1.classList.add('input-el');
    input2.classList.add('input-el');
    input3.classList.add('input-el');
    input4.classList.add('input-el');
    input5.classList.add('input-el');
    input6.classList.add('input-el');
    header2.classList.add('header');

    input7.setAttribute('type','checkbox');
    input8.setAttribute('type','checkbox');

    input5.setAttribute('type','password');
    input6.setAttribute('type','password');


    signUp.id = 'btn-login';
    header2.id = 'front-header';
    whiteBox.id = 'white-box2';

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

buildSignUp();

document.getElementById('login').addEventListener('click', ()=>{
    window.location.href=`/create`;
});

document.getElementById('back-button').addEventListener('click', ()=>{
    window.location.href=`/homepage`;
});