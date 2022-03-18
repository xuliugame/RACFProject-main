getEvents = () => {
    let parentDiv = document.createElement('div');
    parentDiv.id = 'big-container';
    $.ajax({
        type: 'GET',
        url: '/api/events',
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<result.length; i++){
                makeEventBox(result[i], parentDiv);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    document.getElementById('content').appendChild(parentDiv);
}

makeHeaderImage = () =>{
    let parent = document.getElementById('content');
    let divImg = document.createElement('div');

    divImg.id = 'header-img';
    divImg.style.backgroundImage = 'url(/images/rochester.jpg)';

    parent.append(divImg);
}

/**
 * <div class='container'>
 *  <p style='hidden'>ID</p>
 *  <img src='' class='event-img'>
 *  <h4 class='title'>Event / Venue</h4>
 * 
 *  <div class='date-container'>
 *      <h5 class='date'></h5>
 *      <h5 class='date'></h5>
 *  </div>
 * 
 *  <p  class='location'></p>
 *  <button></button> // todo
 * </div>
 */
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
    loc.setAttribute('placeholder', 'Search Events');
    
    bar.appendChild(geo);
    bar.appendChild(loc);
    bar.appendChild(geoImg);
    bar.appendChild(locImg);
    parent.appendChild(bar);

    let popEvents = document.createElement('h2');
    popEvents.classList.add('admissions-header');
    popEvents.id = 'header';
    popEvents.textContent = 'POPULAR EVENTS';
    parent.appendChild(popEvents);

    let eventList = document.createElement('ul');
    let event1 = document.createElement('li');
    let event2 = document.createElement('li');
    let event3 = document.createElement('li');
    let event4 = document.createElement('li');
    let event5 = document.createElement('li');
    let event6 = document.createElement('li');
    let event7 = document.createElement('li');
    let event8 = document.createElement('li');
    let event9 = document.createElement('li');


    eventList.id = 'categories';

    event1.id = 'all';
    event2.id = 'today';
    event3.id = 'foryou';
    event4.id = 'museams';
    event5.id = 'music';
    event6.id = 'educational';
    event7.id = 'culture';
    event8.id = 'nightlife';
    event9.id = 'foodanddrinks';


    event1.textContent = 'All';
    event2.textContent = 'Today';
    event3.textContent = 'For You';
    event4.textContent = 'Museams';
    event5.textContent = 'Music';
    event6.textContent = 'Educational';
    event7.textContent = 'Culture';
    event8.textContent = 'Nightlife';
    event9.textContent = 'Food & Drinks';

    eventList.appendChild(event1);
    eventList.appendChild(event2);
    eventList.appendChild(event3);
    eventList.appendChild(event4);
    eventList.appendChild(event5);
    eventList.appendChild(event6);
    eventList.appendChild(event7);
    eventList.appendChild(event8);
    eventList.appendChild(event9);

    parent.appendChild(eventList);

}

makeHeaderImage();
makeSearchBar();
getEvents();

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
        let address = document.getElementsByClassName('location')[i].textContent.toLowerCase();
        if(address.includes(searchString)){
            document.getElementsByClassName('container')[i].style.display = 'block';
        }else{
            document.getElementsByClassName('container')[i].style.display = 'none';
        }
    }
});

document.getElementById('all').addEventListener('click', ()=>{
    let list = document.getElementsByClassName('container');
    for(let i=0; i<list.length;i++){
        document.getElementsByClassName('container')[i].style.display = 'block';
    }
});

document.getElementById('today').addEventListener('click', ()=>{
    let today = new Date().toLocaleDateString();
    console.log(today);
    let list = document.getElementsByClassName('container');
    for(let i=0; i<list.length;i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
});

document.getElementById('foryou').addEventListener('click', ()=>{
    // get 6 random events
    let list = document.getElementsByClassName('container');
    for(let i=0; i<list.length;i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
    for(let i=0; i<6;i++){
        let random = Math.floor(Math.random() * list.length);
        document.getElementsByClassName('container')[random].style.display = 'block';
    }
});

document.getElementById('museams').addEventListener('click', ()=>{
    
    let list = document.getElementsByClassName('container');

    for(let i=0; i<list.length; i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
    for(let i=0; i<list.length; i++){
        let id = document.getElementsByClassName('hiddenID')[i].textContent;
        
        $.ajax({
            type: 'GET',
            url: `/api/tags-events/${id}`,
            dataType: 'json',
            success: (res, status, xhr) => {
                res.forEach( (item) => {
                    if(item.tag_id == 4){
                        document.getElementsByClassName('container')[i].style.display = 'block';
                    }
                });
            },
            error: (error,status,xhr) => {
                console.log(status + " " + error);
                about.textContent = 'NULL';
            }
        });
    }
    
});

document.getElementById('music').addEventListener('click', ()=>{
    
    let list = document.getElementsByClassName('container');

    for(let i=0; i<list.length; i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
    for(let i=0; i<list.length; i++){
        let id = document.getElementsByClassName('hiddenID')[i].textContent;
        
        $.ajax({
            type: 'GET',
            url: `/api/tags-events/${id}`,
            dataType: 'json',
            success: (res, status, xhr) => {
                res.forEach( (item) => {
                    if(item.tag_id == 5){
                        document.getElementsByClassName('container')[i].style.display = 'block';
                    }
                });
            },
            error: (error,status,xhr) => {
                console.log(status + " " + error);
                about.textContent = 'NULL';
            }
        });
    }
    
});

document.getElementById('educational').addEventListener('click', ()=>{
    
    let list = document.getElementsByClassName('container');

    for(let i=0; i<list.length; i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
    for(let i=0; i<list.length; i++){
        let id = document.getElementsByClassName('hiddenID')[i].textContent;
        
        $.ajax({
            type: 'GET',
            url: `/api/tags-events/${id}`,
            dataType: 'json',
            success: (res, status, xhr) => {
                res.forEach( (item) => {
                    if(item.tag_id == 6){
                        document.getElementsByClassName('container')[i].style.display = 'block';
                    }
                });
            },
            error: (error,status,xhr) => {
                console.log(status + " " + error);
                about.textContent = 'NULL';
            }
        });
    }
    
});

document.getElementById('culture').addEventListener('click', ()=>{
    
    let list = document.getElementsByClassName('container');

    for(let i=0; i<list.length; i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
    for(let i=0; i<list.length; i++){
        let id = document.getElementsByClassName('hiddenID')[i].textContent;
        
        $.ajax({
            type: 'GET',
            url: `/api/tags-events/${id}`,
            dataType: 'json',
            success: (res, status, xhr) => {
                res.forEach( (item) => {
                    if(item.tag_id == 7){
                        document.getElementsByClassName('container')[i].style.display = 'block';
                    }
                });
            },
            error: (error,status,xhr) => {
                console.log(status + " " + error);
                about.textContent = 'NULL';
            }
        });
    }
    
});

document.getElementById('nightlife').addEventListener('click', ()=>{
    
    let list = document.getElementsByClassName('container');

    for(let i=0; i<list.length; i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
    for(let i=0; i<list.length; i++){
        let id = document.getElementsByClassName('hiddenID')[i].textContent;
        
        $.ajax({
            type: 'GET',
            url: `/api/tags-events/${id}`,
            dataType: 'json',
            success: (res, status, xhr) => {
                res.forEach( (item) => {
                    if(item.tag_id == 8){
                        document.getElementsByClassName('container')[i].style.display = 'block';
                    }
                });
            },
            error: (error,status,xhr) => {
                console.log(status + " " + error);
                about.textContent = 'NULL';
            }
        });
    }
    
});

document.getElementById('foodanddrinks').addEventListener('click', ()=>{
    
    let list = document.getElementsByClassName('container');

    for(let i=0; i<list.length; i++){
        document.getElementsByClassName('container')[i].style.display = 'none';
    }
    for(let i=0; i<list.length; i++){
        let id = document.getElementsByClassName('hiddenID')[i].textContent;
        
        $.ajax({
            type: 'GET',
            url: `/api/tags-events/${id}`,
            dataType: 'json',
            success: (res, status, xhr) => {
                res.forEach( (item) => {
                    if(item.tag_id == 9){
                        document.getElementsByClassName('container')[i].style.display = 'block';
                    }
                });
            },
            error: (error,status,xhr) => {
                console.log(status + " " + error);
                about.textContent = 'NULL';
            }
        });
    }
    
});

visitEvent = (id) => {
    window.location.href=`/events/${id}`;
}