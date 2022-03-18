/**
 * <div id='bar-top'>
 *  <img id='cart'/>
 *  <img id='profile'/>
 * </div>
 * 
 * <div id='racf-logo'></div>
 * 
 * <ul id='nav'>
 *  <li>Homepage</li>
 *  <li>About Us</li>
 *  <li>Venues</li>
 *  <li>Events</li>
 *  <li>Contact Us</li>
 * </ul>
 * 
 * <div id='bar-bot'>
 *  <p id='motd'>Find a museam near you</p>
 * </div>
 */

makeGuestNav = () =>{

    let container = document.createElement('div');

    container.id = 'nav-contain';

    let barTop  = document.createElement('div');
    let cart    = document.createElement('img');
    let profile = document.createElement('img');

    barTop.id   = 'bar-top';
    cart.id     = 'cart';
    profile.id  = 'profile';
    cart.src    = '/images/cart.png';
    profile.src = '/images/profile.png';

    barTop.appendChild(cart);
    barTop.appendChild(profile);

    container.appendChild(barTop);

    let racfLogo = document.createElement('div');
    racfLogo.id  = 'racf-logo';

    container.appendChild(racfLogo);

    let nav       = document.createElement('ul');
    let homepage  = document.createElement('li');
    let aboutUs   = document.createElement('li');
    let venues    = document.createElement('li');
    let events    = document.createElement('li');
    let contactUs = document.createElement('li');
        let homeLink = document.createElement('a');
        let aboutLink = document.createElement('a');
        let venueLink = document.createElement('a');
        let eventLink = document.createElement('a');
        let contactLink = document.createElement('a');

    nav.id = 'nav';

    homeLink.textContent    = 'Homepage';
    aboutLink.textContent   = 'About Us';
    venueLink.textContent   = 'Venues';
    eventLink.textContent   = 'Events';
    contactLink.textContent = 'Contact Us';

    homeLink.href    = '/homepage';
    aboutLink.href   = '/about';
    venueLink.href   = '/venues';
    eventLink.href   = '/events';
    contactLink.href = '/contact';
    
    homepage.appendChild(homeLink);
    aboutUs.appendChild(aboutLink);
    venues.appendChild(venueLink);
    events.appendChild(eventLink);
    contactUs.appendChild(contactLink);


    nav.appendChild(homepage);
    nav.appendChild(aboutUs);
    nav.appendChild(venues);
    nav.appendChild(events);
    nav.appendChild(contactUs);

    container.appendChild(nav);

    let barBot = document.createElement('div');
    let motd   = document.createElement('p');

    barBot.id = 'bar-bot';
    motd.id   = 'motd';
    motd.textContent = 'Find a museam near you today. '

    barBot.appendChild(motd);

    container.appendChild(barBot);
    
    document.getElementById('navigation').appendChild(container);
}

//makeGuestNav();

makeFormalNav = () =>{

    console.log(localStorage);

    let container = document.createElement('div');
    container.id = 'nav-contain';

    // Top bar
    let barTop = document.createElement('div');
    barTop.id = 'bar-top';

    let topNav = document.createElement('ul');
        let slot1 = document.createElement('li');
        let slot2 = document.createElement('li');
        let slot3 = document.createElement('li');
            let slot1Link = document.createElement('a');
            let slot2Link = document.createElement('a');
            let slot3Link = document.createElement('a');
    
    slot1Link.textContent = 'About Us';
    slot2Link.textContent = 'Make a Donation';
    slot3Link.textContent = 'Grant Portal';

    slot3Link.href = '/grant';

    // Add linking for these pages here

    slot1.appendChild(slot1Link);
    slot2.appendChild(slot2Link);
    slot3.appendChild(slot3Link);
    topNav.appendChild(slot1);
    topNav.appendChild(slot2);
    topNav.appendChild(slot3);

    barTop.appendChild(topNav);
    
    // cart icon, create account div
    let cart    = document.createElement('img');
    cart.id     = 'cart';
    cart.src = '/images/cart.png';
    barTop.appendChild(cart);

    //create acc div
    let createAccount = document.createElement('div');
    createAccount.id = 'create-account';
    let create = document.createElement('p');
    create.id = 'name';
    create.textContent = 'Create an Account';

    if(localStorage.name.length > 1){
        create.textContent = localStorage.name;
    }

    if(localStorage.role == "3"){
        slot3Link.textContent = 'Admin Grant Portal';
        slot3Link.href = '/adminGrant';
    }

    if(localStorage.role == "2"){
        slot3Link.textContent = 'Partner Portal';
        slot3Link.href = '/partnerPortal';
    }


    createAccount.appendChild(create);
    barTop.appendChild(createAccount);
    container.appendChild(barTop);


    // logo
    let logoLink = document.createElement('div');
    logoLink.id = 'logoLink';
    let logo = document.createElement('img');
    logo.id = 'logo';
    logo.src = '/images/racfLogo2.png';

    let botNav = document.createElement('ul');
        let link1 = document.createElement('li');
        let link2 = document.createElement('li');
        let link3 = document.createElement('li');
        let link4 = document.createElement('li');
            let link1Link = document.createElement('a');
            let link2Link = document.createElement('a');
            let link3Link = document.createElement('a');
            let link4Link = document.createElement('a');

    botNav.id = 'bot-nav';

    link1Link.textContent = 'Home';
    link2Link.textContent = 'Venues';
    link3Link.textContent = 'Events';
    link4Link.textContent = 'Discount Info'

    link1Link.href='/homepage';
    link2Link.href='/venues';
    link3Link.href='/events';
    link4Link.href='/discountInfo';

    link1.appendChild(link1Link);
    link2.appendChild(link2Link);
    link3.appendChild(link3Link);
    link4.appendChild(link4Link);
    botNav.appendChild(link1);
    botNav.appendChild(link2);
    botNav.appendChild(link3);
    botNav.appendChild(link4);


    
    logoLink.appendChild(logo);
    logoLink.appendChild(botNav);
    container.appendChild(logoLink);

    let barBot = document.createElement('div');
    let motd   = document.createElement('p');

    barBot.id = 'bar-bot';
    motd.textContent = 'Find a museam near you today. '

    barBot.appendChild(motd);

    container.appendChild(barBot);

    document.getElementById('navigation').appendChild(container);
}

makeFormalNav();

document.getElementById('create-account').addEventListener('click', ()=>{
    window.location.href=`/create`;
});