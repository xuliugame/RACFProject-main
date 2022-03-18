getEvent = (id) =>{
    $.ajax({
        type: 'GET',
        url: `/api/events/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            makeHeader(result);
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
}

/**
 * <div class='container'>
 *  <p>Date</p>
 *  <h1>Name of event</h1>
 *  <h4>Venue Name</h4>
 *  <p>Price</p>
 *  <button>Get Coupon Code</button>
 * 
 *  <h3>About this event</h3>
 *  <p>About desc</p>
 *  
 *  // date and time box
 *  // location box
 */
makeHeader = (obj) =>{
    let container        = document.createElement('div');
    let dateTop          = document.createElement('p');
    let dateBottom       = document.createElement('p');
    let dateBottomHeader = document.createElement('h3');
    let location         = document.createElement('p');
    let locationHeader   = document.createElement('h3');
    let eventName        = document.createElement('h1');
    let venueName        = document.createElement('h4');
    let priceRange       = document.createElement('p');
    let venueButton      = document.createElement('button');
    let discountButton   = document.createElement('button');
    let aboutEventHeader = document.createElement('h3');
    let aboutEventDesc   = document.createElement('p');
    let eventImage       = document.createElement('div');
    let sideBarContain   = document.createElement('div');
    let shareHeader      = document.createElement('h3');

    let eventsMoreBox    = document.createElement('div');
    let moreEventsHeader = document.createElement('h3');

    container.id        = 'contain';
    dateTop.id          = 'date-top';
    eventName.id        = 'event-name';
    venueName.id        = 'venue-name';
    priceRange.id       = 'price-range';
    discountButton.id   = 'discount-button';
    aboutEventHeader.id = 'about-event-header';
    aboutEventDesc.id   = 'about-event-desc';
    eventImage.id       = 'event-image';

    sideBarContain.id   = 'side-bar-contain';
    dateBottomHeader.id = 'date-bottom-header';
    dateBottom.id       = 'date-bottom';
    locationHeader.id   = 'location-header';
    location.id         = 'location';
    venueButton.id      = 'venue-button';
    venueButton.setAttribute('onclick', `visitVenue(${obj.venue_id})`);

    shareHeader.id      = 'share-header';
    eventsMoreBox.id    = 'more-events-box';
    moreEventsHeader.id = 'more-events-header';

    makeDateHeader(obj.date_id, dateTop, dateBottom);

    eventName.textContent = obj.title;

    makeVenueName(obj.venue_id, venueName, location, obj, moreEventsHeader);

    makePriceRange(obj.id, priceRange);

    discountButton.textContent = 'Reserve me Tickets';
    aboutEventHeader.textContent = 'ABOUT THIS EVENT';
    aboutEventDesc.textContent = obj.description;

    eventImage.style.backgroundImage = `url(${obj.image})`;

    dateBottomHeader.textContent = 'DATE AND TIME';
    locationHeader.textContent   = 'LOCATION';
    venueButton.textContent      = 'Learn about the Venue';

    shareHeader.textContent = 'SHARE WITH FRIENDS';

    let socialImgs = document.createElement('ul');
    socialImgs.id = 'social';
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
    

    container.appendChild(dateTop);
    container.appendChild(eventName);
    container.appendChild(venueName);
    container.appendChild(priceRange);
    container.appendChild(discountButton);
    container.appendChild(eventImage);
    container.appendChild(aboutEventHeader);
    container.appendChild(aboutEventDesc);
    container.appendChild(shareHeader);
    container.appendChild(socialImgs);

    sideBarContain.appendChild(venueButton);
    sideBarContain.appendChild(dateBottomHeader);
    sideBarContain.appendChild(dateBottom);
    sideBarContain.appendChild(locationHeader);
    sideBarContain.appendChild(location);
    container.appendChild(sideBarContain);

    eventsMoreBox.appendChild(moreEventsHeader);
    moreEvents(obj, eventsMoreBox);
    container.appendChild(eventsMoreBox);

    document.getElementById('content').appendChild(container);
}

makeDateHeader = (date_id, element, element2) =>{
    //make ajax call to dates
    $.ajax({
        type: 'GET',
        url: `/api/dates/${date_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            element.textContent = result.date.split(',')[0] + ', ' + result.hours;
            // thursday, 21 january 2021
            element2.textContent = result.days + ', ' + result.date + ' ' + result.hours;
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    // Month day, time, EST
}

makeVenueName = (venue_id, element, element2, obj, element3) =>{
    $.ajax({
        type: 'GET',
        url: `/api/venues/${venue_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            element.textContent = result.title;
            let el = document.createElement('a');
            let el2 = document.createElement('p');
            el2.textContent = obj.address;
            el.textContent = result.title;
            element2.appendChild(el);
            element2.appendChild(el2);
            element3.textContent = 'MORE UPCOMING EVENTS BY ' + result.title.toUpperCase();
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
}

makePriceRange = (event_id, element) =>{
    // display price as a range
    // lowest price - highest price
    // if only one price, list only that price
    $.ajax({
        type: 'GET',
        url: `/api/event-price/${event_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            // returns a set of id's
            let priceList = {};
            let str;
            for(let i=0; i<result.length;i++){
                $.ajax({
                    type: 'GET',
                    url: `/api/price/${result[i].price_id}`,
                    dataType: 'json',
                    success: (res, status, xhr) => {
                        if(i == 0){
                            str = res.price;
                        }else{
                            str += ',' + res.price;
                        }
                        if(i>1){
                            let arr = str.split(',');
                            let sortedArr = arr.sort((a,b)=> a-b);
                            if(sortedArr.length == 1){
                                element.textContent = `$${sortedArr[0]}`;
                            }else{
                                element.textContent = `$${sortedArr[0]}.00 - $${sortedArr[sortedArr.length-1]}.00`;
                            }
                        }else{
                            element.textContent = `$${res.price}`;
                        }
                    },
                    error: (error,status, xhr) =>{
                        console.log(status + " " + error);
                    }
                });
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
}

moreEvents = (obj, element) =>{
    // based on obj.venue_id
    // get associated events with that venue
    // list three max events with the venue
    // link to events by clicking on
    let eventContain = document.createElement('div');
    eventContain.id = 'event-contain';
    $.ajax({
        type: 'GET',
        url: `/api/events/venues/${obj.venue_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            if(result.length > 1){
                for(let i=0; i<3; i++){
                    makeEventBox(result[i],eventContain);
                }
            }else{
                makeEventBox(result,eventContain);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    element.appendChild(eventContain);
}

makeEventBox = (obj, parentDiv) =>{

    let container = document.createElement('div');
    container.id = obj.id;
    container.setAttribute('onclick','visitEvent(this.id)');

    let image     = document.createElement('img');
    let title     = document.createElement('h4');
    let dates     = document.createElement('div');
    let days      = document.createElement('h5');
    let hours     = document.createElement('h5');
    let about     = document.createElement('p');

    let id = document.createElement('p');
    id.textContent = obj.id;
    id.classList.add('hiddenID');
    id.style.display = 'none';
    container.appendChild(id);

    dates.appendChild(days);
    dates.appendChild(hours);

    container.appendChild(image);
    container.appendChild(title);
    container.appendChild(dates);
    container.appendChild(about);


    container.classList.add('container');
    title.classList.add('title');
    dates.classList.add('date');
    about.classList.add('location');
    image.classList.add('event-img');

    $.ajax({
        type: 'GET',
        url: `/api/venues/one/${obj.venue_id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            if(result.length > 0){
                title.textContent += ' - ' + result[0].title;
            }
        },
        error: (error,status, xhr) =>{
            //console.log(status + " " + error);
            //title.textContent += 'null';
            console.log('No other events associated with this venue');
        }
    });
    if(obj.image != null){

        image.src = obj.image;
    
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

        $.ajax({
            type: 'GET',
            url: `/api/venues/${obj.venue_id}`,
            dataType: 'json',
            success: (res, status, xhr) => {
                about.textContent = res.address;
                
            },
            error: (error,status,xhr) => {
                console.log(status + " " + error);
                about.textContent = 'NULL';
            }
        });

        
        parentDiv.appendChild(container);
    }
}

visitEvent = (id) => {
    window.location.href=`/events/${id}`;
}

visitVenue = (id) => {
    window.location.href=`/venues/${id}`;
}

let id = document.getElementById('id').textContent;
getEvent(id);