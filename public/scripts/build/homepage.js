const container = document.getElementById('content');

if(document.getElementById('role')){
    localStorage.setItem('role',document.getElementById('role').textContent);
}

if(document.getElementById('msg')){
    localStorage.setItem('name',document.getElementById('msg').textContent);
}

if(document.getElementById('my-id')){
    localStorage.setItem('id',document.getElementById('my-id').textContent);
}

if(document.getElementById('my-email')){
    localStorage.setItem('email', document.getElementById('my-email').textContent);
}

/**
 * Slideshow setup
 */
let slides = [ '/images/slides/homepage.png', '/images/slides/image1.png', '/images/slides/venuebkg.jpg' ];
let descs  = [ 'MUSEAM OF MODERN ARTS ROCHESTER IS OPEN TODAY!', 'THIS OTHER REALLY COOL MUSEAM IS ALSO OPEN!', 'OOO LOOK AT THIS PRETTY BACKGROUND!']
let count = 0;
slideShow = () =>{
    let headerImg = document.createElement('div');
    headerImg.id = 'header-image';
    headerImg.style.backgroundImage = `url(${slides[count]})`;

    let headerDesc = document.createElement('h2');
    headerDesc.id = 'header-desc';
    headerDesc.textContent = `${descs[count]}`;
    

    let forwardArrow = document.createElement('img');
    let backArrow    = document.createElement('img');

    forwardArrow.src = '/images/forwardArrow.png';
    backArrow.src    = '/images/backArrow.png';

    forwardArrow.id = 'forward-arrow';
    backArrow.id    = 'back-arrow';

    headerImg.appendChild(forwardArrow);
    headerImg.appendChild(backArrow);
    headerImg.appendChild(headerDesc);
    container.appendChild(headerImg);
}

buildContent = () =>{
    let content = document.createElement('div');
    content.id = 'content-page';

    let header = document.createElement('h1');
    header.classList.add('admissions-header');
    header.textContent = 'Go to Events and Venues Around Here in Rochester!';

    let headerDesc = document.createElement('p');
    headerDesc.classList.add('desc-content');
    headerDesc.textContent = 'You can view the different events and venues on here and purchase a ticket or a pass. This will be paperless ticketing for a quick and easy experience to go enjoy the venues and events you\'ve been wanting to see. Head over to our venues page, and pick a place you would want to visit. Once you\'ve found a place, you will have the option to schedule a time to go. When you show up to the venue, show them the QR code you recieved after payment.';

    content.appendChild(header);
    content.appendChild(headerDesc);

    let racfBox = document.createElement('div');
    racfBox.id = 'racf-box';

    let racfHead = document.createElement('h1');
    racfHead.classList.add('admissions-header');
    racfHead.textContent = 'What you can do with RACF';

    let headContainer = document.createElement('div');
    headContainer.id = 'head-contain';

    let head1 = document.createElement('div');
    let head2 = document.createElement('div');
    let head3 = document.createElement('div');
    head1.classList.add('blue-box');
    head2.classList.add('blue-box');
    head3.classList.add('blue-box');

    let headInfo1 = document.createElement('p');
    let headInfo2 = document.createElement('p');
    let headInfo3 = document.createElement('p');
    
    headInfo1.textContent = 'View local museams around Rochester';
    headInfo2.textContent = 'Purchase tickets to local museams';
    headInfo3.textContent = 'Get QR code to show at museam';

    head1.appendChild(headInfo1);
    head2.appendChild(headInfo2);
    head3.appendChild(headInfo3);
    
    headContainer.appendChild(head1);
    headContainer.appendChild(head2);
    headContainer.appendChild(head3);

    racfBox.appendChild(racfHead);
    racfBox.appendChild(headContainer);
    content.appendChild(racfBox);

    // Local venues
    let venueContain = document.createElement('div')
    let venueHead    = document.createElement('h1');
    let venueDesc    = document.createElement('p');
    
    venueContain.id = 'venue-contain';
    venueHead.classList.add('admissions-header');
    venueHead.textContent = 'Local Venues';
    venueDesc.textContent = 'Available venues in Rochester for us all to enjoy. Look through these venues and see more information about them and hopefully purchase a ticket to come and enjoy.';

    venueContain.appendChild(venueHead);
    venueContain.appendChild(venueDesc);

    // add in three venues
    displaySampleVenues(venueContain);

    content.appendChild(venueContain);
    
    // Local events
    let eventContain = document.createElement('div')
    let eventHead    = document.createElement('h1');
    let eventDesc    = document.createElement('p');
    
    eventContain.id = 'event-contain';
    eventHead.classList.add('admissions-header');
    eventHead.textContent = 'Local Events';
    eventDesc.textContent = 'Available events in Rochester for us all to come and enjoy. Look through these events and see more information about them and hopefully purchase a ticket to come and enjoy.';

    eventContain.appendChild(eventHead);
    eventContain.appendChild(eventDesc);
    content.appendChild(eventContain);

    displaySampleEvents(eventContain);
    content.appendChild(eventContain);

    container.appendChild(content);
}

displaySampleVenues = (el) =>{
    // hit venues api
    let venueContainer = document.createElement('div');
    venueContainer.id = 'venue-container';

    $.ajax({
        type: 'GET',
        url: '/api/venues',
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<2; i++){
                makeVenueBox(result[i], venueContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    el.appendChild(venueContainer);

    // button to see more venues
    let button = document.createElement('button');
    button.id = 'see-more';
    button.textContent = 'See more venues';
    el.appendChild(button);

}

makeVenueBox = (obj, el) =>{

    let container = document.createElement('div');
    let image     = document.createElement('img');
    let title     = document.createElement('h4');
    let address   = document.createElement('p');
    let dates     = document.createElement('div');
    let days      = document.createElement('h5');
    let hours     = document.createElement('h5');
    let about     = document.createElement('p');

    dates.appendChild(days);
    dates.appendChild(hours);

    container.appendChild(image);
    container.appendChild(title);
    container.appendChild(address);
    container.appendChild(dates);
    container.appendChild(about);

    container.classList.add('container');
    title.classList.add('title');
    address.classList.add('address');
    dates.classList.add('date');
    about.classList.add('about');
    image.classList.add('event-img');

    if(obj.image == null){
        image.src = '/images/default_events.png';
    }else{
        image.src = obj.image;
    }
    title.textContent += obj.title;

    // address field to box from venue_info
    address.textContent = obj.address;

    $.ajax({
        type: 'GET',
        url: `/api/dates/${obj.date_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            days.textContent = result.days;
            hours.textContent = result.hours;
        },
        error: (error,status,xhr) => {
            console.log(status + " " + error);
            dates.textContent = 'NULL';
        }
    });
    about.textContent += obj.about;
    console.log(obj);
    container.setAttribute('onclick',`visitVenue(${obj.id})`);

    el.appendChild(container);
}

visitVenue = (id) => {
    window.location.href=`/venues/${id}`;
}
visitEvent = (id) => {
    window.location.href=`/events/${id}`;
}

displaySampleEvents = (el) => {

    let eContainer = document.createElement('div');
    eContainer.id = 'e-contain';

    $.ajax({
        type: 'GET',
        url: '/api/events',
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<2; i++){
                makeEventBox(result[i],eContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    el.appendChild(eContainer);
    // button to see more venues
    let button = document.createElement('button');
    button.id = 'see-more-events';
    button.textContent = 'See more events';
    el.appendChild(button);
}

makeEventBox = (obj, el) =>{

    let container = document.createElement('div');
    let image     = document.createElement('img');
    let title     = document.createElement('h4');
    let dates     = document.createElement('div');
    let days      = document.createElement('h5');
    let hours     = document.createElement('h5');
    let about     = document.createElement('p');

    dates.appendChild(days);
    dates.appendChild(hours);

    container.appendChild(image);
    container.appendChild(title);
    container.appendChild(dates);
    container.appendChild(about);

    container.classList.add('container');
    title.classList.add('title');
    dates.classList.add('date');
    about.classList.add('about');
    image.classList.add('event-img');

    $.ajax({
        type: 'GET',
        url: `/api/venues/one/${obj.venue_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            title.textContent += ' - ' + result[0].title;
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
            title.textContent += 'null';
        }
    });
    if(obj.image == null){
        image.src = '/images/default_events.png';
    }else{
        image.src = obj.image;
    }
    title.textContent += obj.title;

    $.ajax({
        type: 'GET',
        url: `/api/dates/${obj.date_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            days.textContent = result.days;
            hours.textContent = result.hours;
        },
        error: (error,status,xhr) => {
            console.log(status + " " + error);
            dates.textContent = 'NULL';
        }
    });
    about.textContent += obj.about;
    
    container.setAttribute('onclick', `visitEvent(${obj.id})`);

    el.appendChild(container);
}


slideShow();
buildContent();

document.getElementById('forward-arrow').addEventListener('click', () =>{
    let headerImg = document.getElementById('header-image');
    let headerDesc = document.getElementById('header-desc');

    if( count < slides.length){
        count++;
        if(count == slides.length){
            count = 0;
        }
        headerImg.style.backgroundImage = `url(${slides[count]})`;
        headerDesc.textContent = `${descs[count]}`;
    }
});

document.getElementById('back-arrow').addEventListener('click', () =>{
    let headerImg = document.getElementById('header-image');
    let headerDesc = document.getElementById('header-desc');

    if(count == 0){
        count = slides.length-1;
        headerImg.style.backgroundImage = `url(${slides[count]})`;
        headerDesc.textContent = `${descs[count]}`;
    }else{
        count--;
        headerImg.style.backgroundImage = `url(${slides[count]})`;
        headerDesc.textContent = `${descs[count]}`;
    }
});
document.getElementById('see-more').addEventListener('click', () =>{
    window.location.href=`/venues`;
});
document.getElementById('see-more-events').addEventListener('click', () =>{
    window.location.href=`/events`;
});