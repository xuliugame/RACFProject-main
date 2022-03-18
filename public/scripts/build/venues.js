getVenues = () => {
    let venueContainer = document.createElement('div');
    venueContainer.id = 'venue-container';

    let venueHeadContainer = document.createElement('div');
    venueHeadContainer.id = 'venue-head-contain';

    let venueHeader = document.createElement('h1');
    venueHeader.textContent = 'Local Venues';
    venueHeader.id = 'title';

    let venueInfo = document.createElement('p');
    venueInfo.textContent = 'Available venues in Rochester for us all to enjoy. Look through these venues and see more information about them and hopefully purchase a ticket to come and enjoy.'
    venueInfo.id = 'long-desc';


    $.ajax({
        type: 'GET',
        url: '/api/venues',
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<result.length; i++){
                makeVenueBox(result[i], venueContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    venueHeadContainer.appendChild(venueHeader);
    venueHeadContainer.appendChild(venueInfo);
    document.getElementById('content').appendChild(venueHeadContainer);
    document.getElementById('content').appendChild(venueContainer);
}


/**
 * <div class='container'>
 *  <img src='' class='event-img'>
 *  <h4 class='title'>Event / Venue</h4>
 * 
 *  <div class='date-container'>
 *      <h5 class='date'></h5>
 *      <h5 class='date'></h5>
 *  </div>
 * 
 *  <p  class='about'></p>
 *  <button></button> // todo
 * </div>
 */
makeVenueBox = (obj, el) =>{
    console.log(obj);
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

    container.setAttribute('onclick',`visitVenue(${obj.id})`);

    el.appendChild(container);
}

makeHeaderImage = () =>{
    let parent = document.getElementById('content');
    let divImg = document.createElement('div');

    divImg.id = 'header-img';
    divImg.style.backgroundImage = 'url(/images/rochester.jpg)';

    parent.append(divImg);
}

makeSearchBar = () =>{
    let parent = document.getElementById('content');
    let bar    = document.createElement('form');
    let geoImg = document.createElement('img');
    let locImg = document.createElement('img'); 
    let geo    = document.createElement('input');
    let loc    = document.createElement('input');

    bar.id = 'search-contain';
    geo.id = 'geo';
    loc.id = 'loc';
    geoImg.src = '/images/geo.png';
    locImg.src = '/images/loc.png';
    geo.setAttribute('placeholder','Rochester');
    loc.setAttribute('placeholder', 'Search Venues');
    
    bar.appendChild(geo);
    bar.appendChild(loc);
    bar.appendChild(geoImg);
    bar.appendChild(locImg);
    parent.appendChild(bar);

}

makeHeaderImage();
makeSearchBar();
getVenues();


visitVenue = (id) => {
    window.location.href=`/venues/${id}`;
}

// Event Listeners
document.getElementById('loc').addEventListener('keyup', () =>{
    console.log(document.getElementById('loc').value);
    let searchString = document.getElementById('loc').value;
    searchString = searchString.toLowerCase();
    // if the name of the venue does not match, remove it from the list
    let list = document.getElementsByClassName('container');
    for(let i=0; i<list.length;i++){
        let title = document.getElementsByClassName('title')[i].textContent.toLowerCase();
        if(title.includes(searchString)){
            document.getElementsByClassName('container')[i].style.display = 'block';
        }else{
            document.getElementsByClassName('container')[i].style.display = 'none';
        }
    }
});

document.getElementById('geo').addEventListener('keyup', () =>{
    let searchString = document.getElementById('geo').value;
    searchString = searchString.toLowerCase();
    // if the name of the venue does not match, remove it from the list
    let list = document.getElementsByClassName('container');
    for(let i=0; i<list.length;i++){
        let address = document.getElementsByClassName('address')[i].textContent.toLowerCase();
        if(address.includes(searchString)){
            document.getElementsByClassName('container')[i].style.display = 'block';
        }else{
            document.getElementsByClassName('container')[i].style.display = 'none';
        }
    }
});
