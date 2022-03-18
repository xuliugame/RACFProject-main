makeFooter = () =>{
    var footer = document.createElement('div');
    footer.id = 'footer';


    // Social container
    let socialContainer = document.createElement('div');
    let social  = document.createElement('h2');
    let socialImgs = document.createElement('ul');
        let instagram = document.createElement('li');
        let facebook  = document.createElement('li');
        let youtube   = document.createElement('li');
        let linkedin  = document.createElement('li');
            let instagramLogo = document.createElement('img');
            let facebookLogo  = document.createElement('img');
            let youtubeLogo   = document.createElement('img');
            let linkedinLogo  = document.createElement('img');

    socialImgs.appendChild(instagram);
    socialImgs.appendChild(facebook);
    socialImgs.appendChild(youtube);
    socialImgs.appendChild(linkedin);
        instagram.appendChild(instagramLogo);
        facebook.appendChild(facebookLogo);
        youtube.appendChild(youtubeLogo);
        linkedin.appendChild(linkedinLogo);
    
    instagramLogo.src = '/images/instagram.png';
    facebookLogo.src  = '/images/facebook.png';
    youtubeLogo.src   = '/images/youtube.png';
    linkedinLogo.src  = '/images/linkedin.png';

    social.textContent = 'SOCIAL MEDIA';
    social.classList.add('admissions-header');
    social.id = 'social-media';
    socialImgs.id = 'social-imgs';
    socialContainer.id = 'social-container';

    socialContainer.appendChild(social);
    socialContainer.appendChild(socialImgs);
    footer.appendChild(socialContainer);


    // support container
    let supportContainer = document.createElement('div');
    let support = document.createElement('h2');
    let supportList = document.createElement('ul');
        let phone = document.createElement('li');
        let fax = document.createElement('li');
        let email = document.createElement('li');
        let address = document.createElement('li');

    support.textContent = 'SUPPORT';
    support.classList.add('admissions-header');
    support.id = 'support';
    supportContainer.id = 'support-container';

    let phoneHeader = document.createElement('b');
    let phoneTotal  = document.createElement('p');
    phoneHeader.textContent = 'PHONE';

    let faxHeader = document.createElement('b');
    let faxTotal  = document.createElement('p');
    faxHeader.textContent = "FAX";

    let emailHeader = document.createElement('b');
    let emailTotal  = document.createElement('p');
    emailHeader.textContent = 'EMAIL';

    let addressHeader = document.createElement('b');
    let addressTotal  = document.createElement('p');
    addressHeader.textContent = 'ADDRESS';


    phone.appendChild(phoneHeader);
    phone.appendChild(phoneTotal);
    fax.appendChild(faxHeader);
    fax.appendChild(faxTotal);
    email.appendChild(emailHeader);
    email.appendChild(emailTotal);
    address.appendChild(addressHeader);
    address.appendChild(addressTotal);

    supportList.appendChild(phone);
    supportList.appendChild(fax);
    supportList.appendChild(email);
    supportList.appendChild(address);

    supportContainer.appendChild(support);
    supportContainer.appendChild(supportList);
    footer.appendChild(supportContainer);

    $.ajax({
        type: 'GET',
        url: `/api/contact/1`,
        dataType: 'json',
        success: (result, status, xhr) => {
            phoneTotal.textContent   += result.phone;
            faxTotal.textContent     += result.fax;
            emailTotal.textContent   += result.email;
            addressTotal.textContent += result.address;
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    let newsContainer = document.createElement('div');
    let news          = document.createElement('h2');
    let newsInput     = document.createElement('input');
    let newsSubmit    = document.createElement('button');

    news.textContent = 'NEWS SIGN UP';
    newsSubmit.textContent = 'GO';
    news.classList.add('admissions-header');
    newsInput.setAttribute('placeholder','Email Address');

    newsContainer.id = 'news-container';
    news.id = 'news';

    newsContainer.appendChild(news);
    newsContainer.appendChild(newsInput);
    newsContainer.appendChild(newsSubmit);
    footer.appendChild(newsContainer);
    

    // Act Rochester
    let actContainer = document.createElement('div');
    let actHeader    = document.createElement('h2');
    let actInfo      = document.createElement('p');

    actHeader.textContent = 'ACT ROCHESTER';
    actInfo.textContent   = 'An initiative of the Community Foundation, ACT Rochester uses data to assess our region on key indicators of well-being.';

    actContainer.id = 'act-container';
    actHeader.id    = 'act';
    
    actHeader.classList.add('admissions-header');

    actContainer.appendChild(actHeader);
    actContainer.appendChild(actInfo);
    footer.appendChild(actContainer);

    // Quick links
    let quickContainer = document.createElement('div');
    let quickHeader    = document.createElement('h2');
    let linkList       = document.createElement('ul');
        let link1       = document.createElement('li');
        let link2       = document.createElement('li');
        let link3       = document.createElement('li');
        let link4       = document.createElement('li');
            let linkOne   = document.createElement('a');
            let linkTwo   = document.createElement('a');
            let linkThree = document.createElement('a');
            let linkFour  = document.createElement('a');

    link1.appendChild(linkOne);
    link2.appendChild(linkTwo);
    link3.appendChild(linkThree);
    link4.appendChild(linkFour);

    linkOne.textContent = 'Grant Portal';
    linkOne.setAttribute('href','https://www.google.com');

    linkTwo.textContent = 'Financials';
    linkTwo.setAttribute('href','https://www.google.com');

    linkThree.textContent = 'Staff Directory';
    linkThree.setAttribute('href','https://www.google.com');

    linkFour.textContent = 'Donor Central';
    linkFour.setAttribute('href','https://www.google.com');

    linkList.appendChild(link1);
    linkList.appendChild(link2);
    linkList.appendChild(link3);
    linkList.appendChild(link4);

    quickContainer.id = 'quick-container';
    quickHeader.id    = 'quick';
    
    quickHeader.textContent = 'QUICK LINKS';
    quickHeader.classList.add('admissions-header');

    quickContainer.appendChild(quickHeader);
    quickContainer.appendChild(linkList);
    footer.appendChild(quickContainer);

    document.getElementById('foot').append(footer);
}

makeFooter();