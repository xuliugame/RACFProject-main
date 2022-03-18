/*

Partner portal should include functions to....


1) Create Venues / Events
2) Add coupon codes attached to specific venues / events
3) View analytics about their venue


*/

let id = localStorage.id;

buildPage = () =>{

    let content = document.getElementById('content');
    content.innerHTML = "";

    let header = document.createElement('h1');
    header.textContent = 'Partner Portal';
    let desc = document.createElement('p');
    desc.textContent = 'This is the partner portal. Here you can create events and venues. You can also upload discounts which people can apply to your venues/events. Clicking the view stats button will yeild charts and graphs related to your venue with information we have about them.';

    let manageVenue = document.createElement('button');
    manageVenue.textContent = 'Manage Venue(s)';
    manageVenue.id = 'man-venue';
    manageVenue.setAttribute('onclick', 'manageVenues()');


    let manageEvents = document.createElement('button');
    manageEvents.textContent = 'Manage Event(s)';
    manageEvents.id = 'man-events';
    manageEvents.setAttribute('onclick','manageEvents()');

    let uploadCoupon = document.createElement('button');
    uploadCoupon.textContent = 'Upload Coupon(s)';
    uploadCoupon.id = 'man-coupon';
    uploadCoupon.setAttribute('onclick','uploadCoupons()');

    let viewStats = document.createElement('button');
    viewStats.textContent = 'View Statistics';
    viewStats.id = 'man-stats';

    content.appendChild(header);
    content.appendChild(desc);
    content.appendChild(manageVenue);
    content.appendChild(manageEvents);
    content.appendChild(uploadCoupon);
    content.appendChild(viewStats);
}

buildPage();



uploadCoupons = () =>{

    let content = document.getElementById('content');
    content.innerHTML = "";
    
    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'buildPage()');
    content.appendChild(back);

    if(document.getElementById('msg')){
        document.body.removeChild(document.getElementById('msg'));
    }

    let header = document.createElement('h1');
    header.textContent = 'Partner Portal: Manage Coupons';
    let desc = document.createElement('p');
    desc.textContent = 'Here you can view, create, edit, or delete coupon codes for venues you own. You have the ability to see the number of active coupon codes you have so far (below).';

    let create = document.createElement('button');
    create.textContent = 'Create Coupon Codes';
    create.setAttribute('onclick','createCodes()');

    let edit = document.createElement('button');
    edit.textContent = 'Edit Coupon Codes';
    edit.setAttribute('onclick', 'editCodes()');

    let deleteCodes = document.createElement('button');
    deleteCodes.textContent = 'Delete Coupon Codes';
    deleteCodes.setAttribute('onclick', 'deleteCodes()');

    content.appendChild(header);
    content.appendChild(desc);
    content.appendChild(create);
    content.appendChild(edit);
    content.appendChild(deleteCodes);

    // list contents of discount-codes where partner id matches venue id in discount-codes
    let headerDisc = document.createElement('h2');
    headerDisc.textContent = 'Your active coupons';

    let discountListDiv = document.createElement('div');
    discountListDiv.id = 'discount-list-div';
    $.ajax({
        type: 'GET',
        url: `/api/discount-code/partner/${localStorage.id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            // returns result.id
            console.log(result);
            try{
                let venueID = result[0].id;
                $.ajax({
                    type: 'GET',
                    url: `/api/discount-code/`,
                    dataType: 'json',
                    success: (result, status, xhr) => {
                        result.forEach(e=>{
                            if(e.venue_id == venueID){
                                // get name from venueid
                                let venueName = document.createElement('p');
                                let venueCode = document.createElement('p');
                                let venueAmount = document.createElement('p');

                                venueCode.textContent = "Code: " + e.code;
                                venueAmount.textContent = e.amount + '% off';
                                discountListDiv.appendChild(venueName);
                                discountListDiv.appendChild(venueCode);
                                discountListDiv.appendChild(venueAmount);
                                $.ajax({
                                    type: 'GET',
                                    url: `/api/venues/one/${e.venue_id}}`,
                                    dataType: 'json',
                                    success: (result, status, xhr) => {
                                        venueName.textContent = "Venue name: " + result[0].title;
                                    },
                                    error: (error,status, xhr) =>{
                                        console.log(status + " " + error);
                                    }
                                });
                            }
                        });
                    },
                    error: (error,status, xhr) =>{
                        console.log(status + " " + error);
                    }
                });
            }
            catch (err){
                console.log(err);
            }
            
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    content.appendChild(headerDisc);
    content.appendChild(discountListDiv);
}

createCodes = () =>{

    let content = document.getElementById('content');
    content.innerHTML = "";
    
    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'uploadCoupons()');
    content.appendChild(back);

    if(document.getElementById('msg')){
        document.body.removeChild(document.getElementById('msg'));
    }

    let header = document.createElement('h1');
    header.textContent = 'Partner Portal: Create Coupons';
    let desc = document.createElement('p');
    desc.textContent = 'Here you can create coupon codes for venues you own. Please select one of your venues from the dropdown list, and then click \'add\' to add a coupon code. !!Notice!! These coupon codes are NOT valid on this website. These are for external venue use ONLY.';

    content.appendChild(header);
    content.appendChild(desc);

    let codeInputDiv = document.createElement('div');
    codeInputDiv.id = 'code-input-div';

    // list all their venues in a select
    let lvid = document.createElement('label');
    lvid.setAttribute('for','vid');
    lvid.textContent = 'Which venue would you like to add a custom coupon for?';
    let vid = document.createElement('select');
    vid.id = 'vid';
    vid.name = 'vid';

    $.ajax({
        type: 'GET',
        url: `/api/venues/partner/${localStorage.id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            result.forEach(e=>{
                console.log
                let option = document.createElement('option');
                option.value = e.id;
                option.textContent = e.title;
                vid.appendChild(option);
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    codeInputDiv.appendChild(lvid);
    codeInputDiv.appendChild(vid);
    

    
    // prompt them to enter a code and an amount
    let lcodeInput = document.createElement('label');
    lcodeInput.setAttribute('for','code-input');
    lcodeInput.textContent = 'Coupon code: ';
    let codeInput = document.createElement('input');
    codeInput.name = 'code-input';
    codeInput.id = 'code-input';
    codeInput.maxLength = 100;
    codeInput.setAttribute('type', 'text');

    // prompt them to enter a code and an amount
    let lacodeInput = document.createElement('label');
    lacodeInput.setAttribute('for','acode-input');
    lacodeInput.textContent = 'Amount off in percentages: ';
    let acodeInput = document.createElement('input');
    acodeInput.name = 'amount-input';
    acodeInput.id = 'amount-input';
    acodeInput.setAttribute('type', 'number');

    codeInputDiv.appendChild(lcodeInput);
    codeInputDiv.appendChild(codeInput);
    codeInputDiv.appendChild(lacodeInput);
    codeInputDiv.appendChild(acodeInput);

    let submitButton = document.createElement('button');
    submitButton.id = 'enter-code-button';
    submitButton.textContent = 'Create';
    submitButton.setAttribute('onclick', 'enterCouponCode()');

    codeInputDiv.appendChild(submitButton);
    // insert into /discount-code
    content.appendChild(codeInputDiv);
}

enterCouponCode = () =>{
    //let venueId = document.get
    let sel = document.getElementById('vid');
    let venueId = sel.options[sel.selectedIndex].value;

    let couponCode = document.getElementById('code-input').value;
    let couponAmount = document.getElementById('amount-input').value;

    console.log(venueId + " " + couponCode + " " + couponAmount);
    
    var dataObj = {
        venue_id: venueId,
        code: couponCode,
        amount: couponAmount
    };

    $.ajax({
        type: 'POST',
        url: `/api/discount-code/`,
        dataType: 'json',
        data: dataObj,
        success: (result, status, xhr) => {
            let msg = document.createElement('p');
            msg.id = 'msg';
            msg.textContent = 'Coupon Created successfully';
            document.body.insertBefore(msg, document.body.firstChild);
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
            let msg = document.createElement('p');
            msg.id = 'msg';
            msg.textContent = 'Coupon Failed to be created';
            document.body.insertBefore(msg, document.body.firstChild);
        }
    });
}

editCodes = () =>{
    // list to them their coupon codes

    // select to edit it

    // update /discount-code
}

deleteCodes = () =>{

    let content = document.getElementById('content');
    content.innerHTML = "";
    
    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'uploadCoupons()');
    content.appendChild(back);

    if(document.getElementById('msg')){
        document.body.removeChild(document.getElementById('msg'));
    }

    // list contents of discount-codes where partner id matches venue id in discount-codes
    let headerDisc = document.createElement('h2');
    headerDisc.textContent = 'Your active coupons';

    let discountListDiv = document.createElement('div');
    discountListDiv.id = 'discount-list-div';

    let selToDel = document.createElement('select');
    selToDel.id = 'sel-to-del';
    $.ajax({
        type: 'GET',
        url: `/api/discount-code/partner/${localStorage.id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            // returns result.id
            let venueID = result[0].id;
            $.ajax({
                type: 'GET',
                url: `/api/discount-code/`,
                dataType: 'json',
                success: (result, status, xhr) => {
                    result.forEach(e=>{
                        if(e.venue_id == venueID){
                            // get name from venueid
                            let toDel = document.createElement('option');
                            
                            //console.log(toDel.value);
                            $.ajax({
                                type: 'GET',
                                url: `/api/venues/one/${e.venue_id}}`,
                                dataType: 'json',
                                success: (result, status, xhr) => {
                                    toDel.value = `${venueID}-${e.code}-${e.amount}`;
                                    toDel.textContent = `${result[0].title}-${e.code}-${e.amount}`;
                                    selToDel.appendChild(toDel);
                                },
                                error: (error,status, xhr) =>{
                                    console.log(status + " " + error);
                                }
                            });
                        }
                    });
                },
                error: (error,status, xhr) =>{
                    console.log(status + " " + error);
                }
            });
            
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    let submitButton = document.createElement('button');
    submitButton.id = 'delete-code-button';
    submitButton.textContent = 'Delete';
    submitButton.setAttribute('onclick', 'deleteCouponCode()');
    
    content.appendChild(headerDisc);
    content.appendChild(selToDel);
    content.appendChild(submitButton);
    // list their coupon codes

    // select to delete it

    // delete from /coupon-code
}

deleteCouponCode = () =>{
    let sel = document.getElementById('sel-to-del');
    let str = sel.options[sel.selectedIndex].value;
    let strArr = str.split("-");

    $.ajax({
        type: 'DELETE',
        url: `/api/discount-code/${strArr[0]}/${strArr[1]}/${strArr[2]}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            let msg = document.createElement('p');
            msg.id = 'msg';
            msg.textContent = 'Coupon deleted successfully';
            document.body.insertBefore(msg, document.body.firstChild);
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
            let msg = document.createElement('p');
            msg.id = 'msg';
            msg.textContent = 'Coupon not deleted';
            document.body.insertBefore(msg, document.body.firstChild);
        }
    });
}






// EVENTS
manageEvents = () =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";
    
    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'buildPage()');
    content.appendChild(back);

    let header = document.createElement('h1');
    header.textContent = 'Partner Portal: Manage Events';
    let desc = document.createElement('p');
    desc.textContent = 'Here you can view, create, edit, or delete your events. You have the ability to see all events that you are associated with so far.';

    let create = document.createElement('button');
    create.textContent = 'Create Event';
    create.setAttribute('onclick','createEventz()');

    let edit = document.createElement('button');
    edit.textContent = 'Edit Event';
    edit.setAttribute('onclick', 'editEventz()');

    let deleteVenue = document.createElement('button');
    deleteVenue.textContent = 'Delete Event';
    deleteVenue.setAttribute('onclick', 'deleteEventz()');

    let viewHeader = document.createElement('h2');
    viewHeader.textContent = 'Your Events';

    content.appendChild(header);
    content.appendChild(desc);
    content.appendChild(create);
    content.appendChild(edit);
    content.appendChild(deleteVenue);
    content.appendChild(viewHeader);

    let eventContainer = document.createElement('div');
    eventContainer.id = 'event-container';

    $.ajax({
        type: 'GET',
        url: `/api/events/partners/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<result.length; i++){
                makeEventBox(result[i], eventContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    content.appendChild(eventContainer);
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

createEventz = () =>{

    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'manageEvents()');
    content.appendChild(back);

    let header = document.createElement('h1');
    header.textContent = 'Partner Portal: Create New Event';
    let desc = document.createElement('p');
    desc.textContent = 'This is the page to create a new event. If you hit the back button, your information on this form will not be saved. Once this event is created, you can both edit and delete the event. Make sure you fill out all fields before hitting submit.';

    content.appendChild(header);
    content.appendChild(desc);

    // form with elements:
    // title, image, address, description, venue_id, date_id, about
    let form = document.createElement('form');
    form.setAttribute('method','POST');
    form.setAttribute('enctype','multipart/form-data');
    form.setAttribute('action','/auth/createEvent');

    let ltitle = document.createElement('label');
    ltitle.setAttribute('for','titled');
    ltitle.textContent = 'Title of your Event';
    let title = document.createElement('input');
    title.id = 'titled';
    title.name = 'titled';
    title.required = true;
    title.maxLength = '50';
    title.setAttribute('type','text');

    //image
    let limage = document.createElement('label');
    limage.setAttribute('for','image');
    limage.textContent = 'Image that will be displayed with your event.'
    let image = document.createElement('input');
    image.setAttribute('type','file');
    image.name = 'image';
    image.id = 'image;'

    let labout = document.createElement('label');
    labout.setAttribute('for','about');
    labout.textContent = 'Short description for your event. This will be the text displayed when your event is in the list of venues.';
    let about = document.createElement('input');
    about.id = 'about';
    about.name = 'about';
    about.required = true;
    about.maxLength = '300';
    about.setAttribute('type','text');

    let laddress = document.createElement('label');
    laddress.setAttribute('for','address');
    laddress.textContent = 'Address of your event.';
    let address = document.createElement('input');
    address.id = 'address';
    address.name = 'address';
    address.required = true;
    address.maxLength = '50';
    address.setAttribute('type','text');

    let ldesc = document.createElement('label');
    ldesc.setAttribute('for','description');
    ldesc.textContent = 'Long description for your event. This will be the text displayed when your event is selected by the user.';
    let description = document.createElement('textarea');
    description.id = 'description';
    description.name = 'description';
    description.required = true;

    // dates venue is open
    let ldate = document.createElement('label');
    ldate.setAttribute('for','date');
    ldate.textContent = 'Days and hours your event is available.';
    let date = document.createElement('select');
    date.id = 'date';
    date.name = 'date';

    $.ajax({
        type: 'GET',
        url: `/api/dates/`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            result.forEach(e=>{
                let option = document.createElement('option');
                option.value = e.id;
                option.textContent = e.hours + " " + e.days;
                date.appendChild(option);
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    // set the prices for: General Admission, Children, Sr citizen
    let pricesSection = document.createElement('h3');
    pricesSection.textContent = 'Prices and Discounts.'

    let lgenPrice = document.createElement('label');
    lgenPrice.setAttribute('for','general');
    lgenPrice.textContent = 'General Admission';
    let genPrice = document.createElement('input');
    genPrice.setAttribute('type','number')
    genPrice.id = 'general';
    genPrice.name = 'general';
    genPrice.required = true;

    let lsrPrice = document.createElement('label');
    lsrPrice.setAttribute('for','senior');
    lsrPrice.textContent = 'Senior Citizens (62+)';
    let srPrice = document.createElement('input');
    srPrice.setAttribute('type','number');
    srPrice.id = 'senior';
    srPrice.name = 'senior';
    srPrice.required = true;

    let lkidPrice = document.createElement('label');
    lkidPrice.setAttribute('for','children');
    lkidPrice.textContent = 'Children (12 and under)';
    let kidPrice = document.createElement('input');
    kidPrice.setAttribute('type', 'number');
    kidPrice.id = 'children';
    kidPrice.name = 'children';
    kidPrice.required = true;

    // List available discounts
    let discountsDiv = document.createElement('div');
    let discountsHeader = document.createElement('h3');
    discountsHeader.textContent = 'Enter Prices for the following categories.';
    discountsDiv.appendChild(discountsHeader);
    discountsDiv.appendChild(lgenPrice);
    discountsDiv.appendChild(genPrice);
    discountsDiv.appendChild(lsrPrice);
    discountsDiv.appendChild(srPrice);
    discountsDiv.appendChild(lkidPrice);
    discountsDiv.appendChild(kidPrice);
    $.ajax({
        type: 'GET',
        url: `/api/discounts/`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            result.forEach(e=>{
                let lele = document.createElement('label');
                lele.setAttribute('for',`${e.name}`);
                lele.textContent = `Enter discount for: ${e.name}`;
                let ele = document.createElement('input');
                ele.setAttribute('type', 'number');
                ele.id = `${e.name}`;
                ele.name = `${e.name}`;
                ele.required = true;
                discountsDiv.appendChild(lele);
                discountsDiv.appendChild(ele);
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    

    // Venue ID
    let lvid = document.createElement('label');
    lvid.setAttribute('for','vid');
    lvid.textContent = 'Which venue would you like to add this event to?';
    let vid = document.createElement('select');
    vid.id = 'vid';
    vid.name = 'vid';

    $.ajax({
        type: 'GET',
        url: `/api/venues/partner/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            result.forEach(e=>{
                console.log
                let option = document.createElement('option');
                option.value = e.id;
                option.textContent = e.title;
                vid.appendChild(option);
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });


    // Up to three tags
    let ltag1 = document.createElement('label');
    ltag1.setAttribute('for','vid');
    ltag1.textContent = 'Please add up to three related tags for your event.';
    let tag1 = document.createElement('select');
    tag1.id = 'tag1';
    tag1.name = 'tag1';

    let tag2 = document.createElement('select');
    tag2.id = 'tag2';
    tag2.name = 'tag2';

    let tag3 = document.createElement('select');
    tag3.id = 'tag3';
    tag3.name = 'tag3';

    $.ajax({
        type: 'GET',
        url: `/api/tags/`,
        dataType: 'json',
        success: (result, status, xhr) => {
            let c = 0;
            result.forEach(e=>{
                if(c > 2){
                    let option = document.createElement('option');
                    option.value = e.id;
                    option.textContent = e.name;
                    let option1 = document.createElement('option');
                    option1.value = e.id;
                    option1.textContent = e.name;
                    let option2 = document.createElement('option');
                    option2.value = e.id;
                    option2.textContent = e.name;
                    tag1.appendChild(option1);
                    tag2.appendChild(option2);
                    tag3.appendChild(option);
                }
                c++;
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    let submit = document.createElement('button');
    submit.setAttribute('type','submit');
    submit.setAttribute('value','Submit');
    submit.textContent = 'Submit';

    form.appendChild(ltitle);
    form.appendChild(title);
    form.appendChild(limage);
    form.appendChild(image);
    form.appendChild(labout);
    form.appendChild(about);
    form.appendChild(laddress);
    form.appendChild(address);
    form.appendChild(ldesc);
    form.appendChild(description);
    form.appendChild(ldate);
    form.appendChild(date);
    form.appendChild(discountsDiv);
    form.appendChild(lvid);
    form.appendChild(vid);
    form.appendChild(ltag1);
    form.appendChild(tag1);
    form.appendChild(tag2);
    form.appendChild(tag3);
    form.appendChild(submit);

    content.appendChild(form);
}

editEventz = () =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'manageEvents()');
    content.appendChild(back);

    let updateHeader = document.createElement('h1');
    updateHeader.textContent = 'Partner Portal: Update an event';
    let updateDesc = document.createElement('p');
    updateDesc.textContent = 'This is the page to update an event. Please select an event you would like to update.';

    content.appendChild(updateHeader);
    content.appendChild(updateDesc);

    let eventContainer = document.createElement('div');
    eventContainer.id = 'event-container';

    $.ajax({
        type: 'GET',
        url: `/api/events/partners/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<result.length; i++){
                makeEventBoxForUpdate(result[i], eventContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    content.appendChild(eventContainer);
}

deleteEventz = () =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'manageEvents()');
    content.appendChild(back);

    let deleteHeader = document.createElement('h1');
    deleteHeader.textContent = 'Partner Portal: Delete an event';
    let deleteDesc = document.createElement('p');
    deleteDesc.textContent = 'This is the page to delete a specific event. Click on an event below to delete, you will then be prompted to confirm your deletion. Once you hit confirm, this action cannot be undone.';

    content.appendChild(deleteHeader);
    content.appendChild(deleteDesc);

    let eventContainer = document.createElement('div');
    eventContainer.id = 'event-container';
    
    $.ajax({
        type: 'GET',
        url: `/api/events/partners/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<result.length; i++){
                makeEventBoxForDelete(result[i], eventContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    content.appendChild(eventContainer);
}

deleteEventConfirm = (id) =>{
    var txt;
    if( confirm("Are you sure you want to delete this event? This action cannot be undone!")){
        
        // Delete from event_price
        $.ajax({
            type: 'DELETE',
            url: `/api/event-price/${id}`,
            dataType: 'json',
            success: (result, status, xhr) => {
                console.log('Deleted from event-price successfully');
            },
            error: (error,status,xhr) => {
                console.log('Could not delete from event_price');
            },
            complete: (result,status,xhr) =>{
                // Delete from event_discounts
                $.ajax({
                    type: 'DELETE',
                    url: `/api/event-discounts/${id}`,
                    dataType: 'json',
                    success: (result, status, xhr) => {
                        console.log('Deleted from event_discounts successfully');
                    },
                    error: (error,status,xhr) => {
                        console.log('Could not delete from event_discounts');
                    },
                    complete: (result,status,xhr) =>{
                        // delete from tags events
                        $.ajax({
                            type: 'DELETE',
                            url: `/api/tags-events/${id}`,
                            dataType: 'json',
                            success: (result, status, xhr) => {
                                console.log('Deleted from tags_events successfully');
                            },
                            error: (error,status,xhr) => {
                                console.log('Could not delete from tags_events');
                            },
                            complete: (result,status,xhr) =>{
                                // delete from events!
                                $.ajax({
                                    type: 'DELETE',
                                    url: `/api/events/${id}`,
                                    dataType: 'json',
                                    success: (result, status, xhr) => {
                                        console.log('Deleted Event Successfully');
                                        alert('Event deleted successfully.');
                                    },
                                    error: (error,status, xhr) =>{
                                        console.log('Could not delete event.');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}

makeEventBoxForUpdate = (obj, parentDiv) =>{

    let container = document.createElement('div');
    container.id = obj.id;
    container.setAttribute('onclick','updateEventz(this.id)');

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

makeEventBoxForDelete = (obj, el) =>{
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

    container.setAttribute('onclick',`deleteEventConfirm(${obj.id})`);

    el.appendChild(container);
}

updateEventz = (id) =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'editEventz()');
    content.appendChild(back);

    let updateHeader = document.createElement('h1');
    updateHeader.textContent = 'Partner Portal: Update your event';
    let updateDesc = document.createElement('p');
    updateDesc.textContent = 'This is the page to update an event. Please select a field you would like to update.';

    content.appendChild(updateHeader);
    content.appendChild(updateDesc);

    // title, image, about, address, description, phone_number, homepage, date_id, motd
    let list = document.createElement('select');
    list.id = 'sel-list';
    list.setAttribute('onChange', `displayUpdateFieldEvents(${id})`);

    let choose = document.createElement('option');
    choose.textContent = 'Choose an option';

    let title = document.createElement('option');
    title.value = 'title';
    title.textContent = 'title';
    
    let image = document.createElement('option');
    image.value = 'image';
    image.textContent = 'image';

    let about = document.createElement('option');
    about.value = 'about';
    about.textContent = 'about';

    let address = document.createElement('option');
    address.value = 'address';
    address.textContent = 'address';

    let description = document.createElement('option');
    description.value = 'description';
    description.textContent = 'description';

    let date = document.createElement('option');
    date.value = 'date';
    date.textContent = 'date';
        
    list.appendChild(choose);
    list.appendChild(title);
    list.appendChild(image);
    list.appendChild(about);
    list.appendChild(address);
    list.appendChild(description);
    list.appendChild(date);

    content.appendChild(list);
}

displayUpdateFieldEvents = (id) =>{

    let content = document.getElementById('content');

    let sel = document.getElementById('sel-list');
    let value = sel.options[sel.selectedIndex].value;
    console.log(value);
    switch(value){
        
        case "image":
            createTextInputE(value, '0', id);
            break;
        case "title":
            createTextInputE(value, '50', id);
            break;
        case "about":
            createTextInputE(value, '300', id);
            break;
        case "address":
            createTextInputE(value, '50', id);
            break;
        case "description":
            createTextInputE(value, '1000', id);
            break;
        case "date":
            createTextInputE(value, '0', id);
            break;
        default:
            console.log('defaulted');
            break;
    }
}

createTextInputE = (field, max, id) =>{
    console.log(`Field: ${field} Max: ${max} Id: ${id}`);

    let content = document.getElementById('content');

    if(document.getElementById('holder')){
        content.removeChild(document.getElementById('holder'));
    }
    let inputDiv = document.createElement('div');
    inputDiv.id = 'holder';

    if(field != 'date' && field != 'image'){
        let inputEl = document.createElement('input');
        inputEl.setAttribute('type','text');
        inputEl.maxLength = max;
        inputEl.id = field;
        inputEl.name = field;

        inputDiv.appendChild(inputEl);

        let submitButton = document.createElement('button');
        submitButton.id = 'update-event';
        submitButton.textContent = 'Update';
        submitButton.setAttribute('onclick', `updateEventField('${field}',${id})`);
        
        inputDiv.appendChild(submitButton);
        content.appendChild(inputDiv);
    } else if(field == 'date'){
        //get dates (create)
        // change field to date_id
        // dates venue is open
        let date = document.createElement('select');
        date.id = 'date';
        date.name = 'date';

        $.ajax({
            type: 'GET',
            url: `/api/dates/`,
            dataType: 'json',
            success: (result, status, xhr) => {
                console.log(result);
                result.forEach(e=>{
                    let option = document.createElement('option');
                    option.value = e.id;
                    option.textContent = e.hours + " " + e.days;
                    date.appendChild(option);
                });
            },
            error: (error,status, xhr) =>{
                console.log(status + " " + error);
            }
        });

        let submitButton = document.createElement('button');
        submitButton.id = 'update-event';
        submitButton.textContent = 'Update';
        submitButton.setAttribute('onclick', `updateEventField('${field}',${id})`);

        inputDiv.appendChild(date);
        inputDiv.appendChild(submitButton);
        content.appendChild(inputDiv);
    }else if(field == 'image'){

        console.log('here');
        // create a form for image uploading
        let form = document.createElement('form');
        form.setAttribute('method','POST');
        form.setAttribute('enctype','multipart/form-data');
        form.setAttribute('action','/auth/updateEventImage');

        let inputFile = document.createElement('input');
        inputFile.setAttribute('type','file');
        inputFile.name = 'image';
        inputFile.id = 'image'

        let inputID = document.createElement('input');
        inputID.setAttribute('type','hidden');
        inputID.value = id;
        inputID.name = 'id';
        inputID.id = 'id';

        let submitButton = document.createElement('button');
        submitButton.setAttribute('type','submit');
        submitButton.textContent = 'Upload';

        form.appendChild(inputFile);
        form.appendChild(inputID);
        form.appendChild(submitButton);

        inputDiv.appendChild(form);
        content.appendChild(inputDiv);
    }
}

updateEventField = (field,id) =>{
    console.log('Field: ' + field + " " + id);
    console.log(field);
    let inputValue = document.getElementById(field).value;
    console.log(field + " " + inputValue + " " + id);
    // send ajax update call req.body.id,req.body.field,req.body.value)
    if(field == 'date'){
        field = 'date_id';
    }
    var dataObj = {
        id: id,
        field: field,
        value: inputValue
    };
    $.ajax({
        type: 'PUT',
        url: `/api/events/${id}`,
        data: dataObj,
        success: (result, status, xhr) => {
            console.log('Successfully updated event!');
        },
        error: (error,status, xhr) =>{
            console.log('Failed to update event');
        }
    });
}

visitEvent = (id) => {
    window.location.href=`/events/${id}`;
}








// VENUES
manageVenues = () =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";
    
    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'buildPage()');
    content.appendChild(back);

    let header = document.createElement('h1');
    header.textContent = 'Partner Portal: Manage Venues';
    let desc = document.createElement('p');
    desc.textContent = 'Here you can view, create, edit, or delete your venues. You have the ability to see all venues that you are associated with so far.';

    let create = document.createElement('button');
    create.textContent = 'Create Venue';
    create.setAttribute('onclick','createVenue()');

    let edit = document.createElement('button');
    edit.textContent = 'Edit Venue';
    edit.setAttribute('onclick', 'editVenue()');

    let deleteVenue = document.createElement('button');
    deleteVenue.textContent = 'Delete Venue';
    deleteVenue.setAttribute('onclick', 'deleteVenue()');

    let viewHeader = document.createElement('h2');
    viewHeader.textContent = 'Your Venues';

    content.appendChild(header);
    content.appendChild(desc);
    content.appendChild(create);
    content.appendChild(edit);
    content.appendChild(deleteVenue);
    content.appendChild(viewHeader);

    let venueContainer = document.createElement('div');
    venueContainer.id = 'venue-container';
    $.ajax({
        type: 'GET',
        url: `/api/venues/partner/${id}`,
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
    content.appendChild(venueContainer);

}

createVenue = () =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'manageVenues()');
    content.appendChild(back);

    let header = document.createElement('h1');
    header.textContent = 'Partner Portal: Create New Venue';
    let desc = document.createElement('p');
    desc.textContent = 'This is the page to create a new venue. If you hit the back button, your information on this form will not be saved. Once this venue is created, you can both edit and delete the venue. Make sure you fill out all fields before hitting submit.';

    content.appendChild(header);
    content.appendChild(desc);

    // form with elements:
    // title, image, about, address, description, phone_number, homepage, date_id, motd, and {partner_id}
    let form = document.createElement('form');
    form.setAttribute('method','POST');
    form.setAttribute('enctype','multipart/form-data');
    form.setAttribute('action','/auth/createVenue');

    let ltitle = document.createElement('label');
    ltitle.setAttribute('for','titled');
    ltitle.textContent = 'Title of your venue';
    let title = document.createElement('input');
    title.id = 'titled';
    title.name = 'titled';
    title.required = true;
    title.maxLength = '100';
    title.setAttribute('type','text');

    //image
    let limage = document.createElement('label');
    limage.setAttribute('for','image');
    limage.textContent = 'Image that will be displayed with your venue.'
    let image = document.createElement('input');
    image.setAttribute('type','file');
    image.name = 'image';
    image.id = 'image;'

    let labout = document.createElement('label');
    labout.setAttribute('for','about');
    labout.textContent = 'Short description for your venue. This will be the text displayed when your venue is in the list of venues.';
    let about = document.createElement('input');
    about.id = 'about';
    about.name = 'about';
    about.required = true;
    about.maxLength = '300';
    about.setAttribute('type','text');

    let laddress = document.createElement('label');
    laddress.setAttribute('for','address');
    laddress.textContent = 'Address of your venue.';
    let address = document.createElement('input');
    address.id = 'address';
    address.name = 'address';
    address.required = true;
    address.maxLength = '50';
    address.setAttribute('type','text');

    let ldesc = document.createElement('label');
    ldesc.setAttribute('for','description');
    ldesc.textContent = 'Long description for your venue. This will be the text displayed when your venue is selected by the user.';
    let description = document.createElement('textarea');
    description.id = 'description';
    description.name = 'description';
    description.required = true;

    let lphone = document.createElement('label');
    lphone.setAttribute('for','phone');
    lphone.textContent = 'Phone number that users will use to call your venue for questions.';
    let phone = document.createElement('input');
    phone.id = 'phone';
    phone.name = 'phone';
    phone.required = true;
    phone.maxLength = '16';
    phone.setAttribute('type','text');

    let lhome = document.createElement('label');
    lhome.setAttribute('for','home');
    lhome.textContent = 'Link to your venues website, which users will use to apply their discount codes, gather information, etc.';
    let home = document.createElement('input');
    home.id = 'home';
    home.name = 'home';
    home.required = true;
    home.maxLength = '80';
    home.setAttribute('type','text');

    // dates venue is open
    let ldate = document.createElement('label');
    ldate.setAttribute('for','date');
    ldate.textContent = 'Days and hours your venue is open for business.';
    let date = document.createElement('select');
    date.id = 'date';
    date.name = 'date';

    $.ajax({
        type: 'GET',
        url: `/api/dates/`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            result.forEach(e=>{
                let option = document.createElement('option');
                option.value = e.id;
                option.textContent = e.hours + " " + e.days;
                date.appendChild(option);
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    // set the prices for: General Admission, Children, Sr citizen
    let pricesSection = document.createElement('h3');
    pricesSection.textContent = 'Prices and Discounts.'

    let lgenPrice = document.createElement('label');
    lgenPrice.setAttribute('for','general');
    lgenPrice.textContent = 'General Admission';
    let genPrice = document.createElement('input');
    genPrice.setAttribute('type','number')
    genPrice.id = 'general';
    genPrice.name = 'general';
    genPrice.required = true;

    let lsrPrice = document.createElement('label');
    lsrPrice.setAttribute('for','senior');
    lsrPrice.textContent = 'Senior Citizens (62+)';
    let srPrice = document.createElement('input');
    srPrice.setAttribute('type','number');
    srPrice.id = 'senior';
    srPrice.name = 'senior';
    srPrice.required = true;

    let lkidPrice = document.createElement('label');
    lkidPrice.setAttribute('for','children');
    lkidPrice.textContent = 'Children (12 and under)';
    let kidPrice = document.createElement('input');
    kidPrice.setAttribute('type', 'number');
    kidPrice.id = 'children';
    kidPrice.name = 'children';
    kidPrice.required = true;

    // List available discounts
    let discountsDiv = document.createElement('div');
    let discountsHeader = document.createElement('h3');
    discountsHeader.textContent = 'Enter Prices for the following categories.';
    discountsDiv.appendChild(discountsHeader);
    discountsDiv.appendChild(lgenPrice);
    discountsDiv.appendChild(genPrice);
    discountsDiv.appendChild(lsrPrice);
    discountsDiv.appendChild(srPrice);
    discountsDiv.appendChild(lkidPrice);
    discountsDiv.appendChild(kidPrice);
    $.ajax({
        type: 'GET',
        url: `/api/discounts/`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            result.forEach(e=>{
                let lele = document.createElement('label');
                lele.setAttribute('for',`${e.name}`);
                lele.textContent = `Enter discount for: ${e.name}`;
                let ele = document.createElement('input');
                ele.setAttribute('type', 'number');
                ele.id = `${e.name}`;
                ele.name = `${e.name}`;
                ele.required = true;
                discountsDiv.appendChild(lele);
                discountsDiv.appendChild(ele);
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    let lmotd = document.createElement('label');
    lmotd.setAttribute('for','motd');
    lmotd.textContent = 'Message of the day, a short personalized message about cool/interesting/weird tidbits not included in your descriptions.';
    let motd = document.createElement('input');
    motd.id = 'motd';
    motd.name = 'motd';
    motd.maxLength = '300';
    motd.setAttribute('type','text');

    let pid = document.createElement('input');
    pid.id = 'pid';
    pid.name = 'pid';
    pid.value = id;
    pid.setAttribute('type','hidden');

    let submit = document.createElement('button');
    submit.setAttribute('type','submit');
    submit.setAttribute('value','Submit');
    submit.textContent = 'Submit';

    form.appendChild(ltitle);
    form.appendChild(title);
    form.appendChild(limage);
    form.appendChild(image);
    form.appendChild(labout);
    form.appendChild(about);
    form.appendChild(laddress);
    form.appendChild(address);
    form.appendChild(ldesc);
    form.appendChild(description);
    form.appendChild(lphone);
    form.appendChild(phone);
    form.appendChild(lhome);
    form.appendChild(home);
    form.appendChild(ldate);
    form.appendChild(date);
    form.appendChild(discountsDiv);
    form.appendChild(lmotd);
    form.appendChild(motd);
    form.appendChild(pid);
    form.appendChild(submit);

    content.appendChild(form);

}

editVenue = () =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'manageVenues()');
    content.appendChild(back);

    let updateHeader = document.createElement('h1');
    updateHeader.textContent = 'Partner Portal: Update a venue';
    let updateDesc = document.createElement('p');
    updateDesc.textContent = 'This is the page to update a venue. Please select a venue you would like to update.';

    content.appendChild(updateHeader);
    content.appendChild(updateDesc);

    // build update with update buttons
    let venueContainer = document.createElement('div');
    venueContainer.id = 'venue-container';
    $.ajax({
        type: 'GET',
        url: `/api/venues/partner/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<result.length; i++){
                makeVenueBoxForUpdate(result[i], venueContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    content.appendChild(venueContainer);
}

updateVenue = (id) =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'editVenue()');
    content.appendChild(back);

    let updateHeader = document.createElement('h1');
    updateHeader.textContent = 'Partner Portal: Update your venue';
    let updateDesc = document.createElement('p');
    updateDesc.textContent = 'This is the page to update a venue. Please select a field you would like to update.';

    content.appendChild(updateHeader);
    content.appendChild(updateDesc);

    // title, image, about, address, description, phone_number, homepage, date_id, motd
    let list = document.createElement('select');
    list.id = 'sel-list';
    list.setAttribute('onChange', `displayUpdateField(${id})`);

    let choose = document.createElement('option');
    choose.textContent = 'Choose an option';

    let title = document.createElement('option');
    title.value = 'title';
    title.textContent = 'title';
    
    let image = document.createElement('option');
    image.value = 'image';
    image.textContent = 'image';

    let about = document.createElement('option');
    about.value = 'about';
    about.textContent = 'about';

    let address = document.createElement('option');
    address.value = 'address';
    address.textContent = 'address';

    let description = document.createElement('option');
    description.value = 'description';
    description.textContent = 'description';

    let phone = document.createElement('option');
    phone.value = 'phone_number';
    phone.textContent = 'phone_number';

    let homepage = document.createElement('option');
    homepage.value = 'homepage';
    homepage.textContent = 'homepage';

    let date = document.createElement('option');
    date.value = 'date';
    date.textContent = 'date';
    
    let motd = document.createElement('option');
    motd.value = 'motd';
    motd.textContent = 'motd';
    
    list.appendChild(choose);
    list.appendChild(title);
    list.appendChild(image);
    list.appendChild(about);
    list.appendChild(address);
    list.appendChild(description);
    list.appendChild(phone);
    list.appendChild(homepage);
    list.appendChild(date);
    list.appendChild(motd);

    content.appendChild(list);
    
    

}

displayUpdateField = (id) =>{

    let content = document.getElementById('content');

    let sel = document.getElementById('sel-list');
    let value = sel.options[sel.selectedIndex].value;
    console.log(value);
    switch(value){
        
        case "image":
            createTextInput(value, '0', id);
            break;
        case "title":
            createTextInput(value, '100', id);
            break;
        case "about":
            createTextInput(value, '300', id);
            break;
        case "address":
            createTextInput(value, '50', id);
            break;
        case "description":
            createTextInput(value, '800', id);
            break;
        case "phone_number":
            createTextInput(value, '1000', id);
            break;
        case "homepage":
            createTextInput(value, '80', id);
            break;
        case "date":
            createTextInput(value, '0', id);
            break;
        case "motd":
            createTextInput(value, '300', id);
            break;
        default:
            console.log('defaulted');
            break;
    }
}

createTextInput = (field, max, id) =>{
    console.log(`Field: ${field} Max: ${max} Id: ${id}`);

    let content = document.getElementById('content');

    if(document.getElementById('holder')){
        content.removeChild(document.getElementById('holder'));
    }
    let inputDiv = document.createElement('div');
    inputDiv.id = 'holder';

    if(field != 'date' && field != 'image'){
        let inputEl = document.createElement('input');
        inputEl.setAttribute('type','text');
        inputEl.maxLength = max;
        inputEl.id = field;
        inputEl.name = field;

        inputDiv.appendChild(inputEl);

        let submitButton = document.createElement('button');
        submitButton.id = 'update-venue';
        submitButton.textContent = 'Update';
        submitButton.setAttribute('onclick', `updateVenueField('${field}',${id})`);
        
        inputDiv.appendChild(submitButton);
        content.appendChild(inputDiv);
    } else if(field == 'date'){
        //get dates (create)
        // change field to date_id
        // dates venue is open
        let date = document.createElement('select');
        date.id = 'date';
        date.name = 'date';

        $.ajax({
            type: 'GET',
            url: `/api/dates/`,
            dataType: 'json',
            success: (result, status, xhr) => {
                console.log(result);
                result.forEach(e=>{
                    let option = document.createElement('option');
                    option.value = e.id;
                    option.textContent = e.hours + " " + e.days;
                    date.appendChild(option);
                });
            },
            error: (error,status, xhr) =>{
                console.log(status + " " + error);
            }
        });

        let submitButton = document.createElement('button');
        submitButton.id = 'update-venue';
        submitButton.textContent = 'Update';
        submitButton.setAttribute('onclick', `updateVenueField('${field}',${id})`);

        inputDiv.appendChild(date);
        inputDiv.appendChild(submitButton);
        content.appendChild(inputDiv);
    }else if(field == 'image'){

        console.log('here');
        // create a form for image uploading
        let form = document.createElement('form');
        form.setAttribute('method','POST');
        form.setAttribute('enctype','multipart/form-data');
        form.setAttribute('action','/auth/updateImage');

        let inputFile = document.createElement('input');
        inputFile.setAttribute('type','file');
        inputFile.name = 'image';
        inputFile.id = 'image'

        let inputID = document.createElement('input');
        inputID.setAttribute('type','hidden');
        inputID.value = id;
        inputID.name = 'id';
        inputID.id = 'id';

        let submitButton = document.createElement('button');
        submitButton.setAttribute('type','submit');
        submitButton.textContent = 'Upload';

        form.appendChild(inputFile);
        form.appendChild(inputID);
        form.appendChild(submitButton);

        inputDiv.appendChild(form);
        content.appendChild(inputDiv);
    }
}

updateVenueField = (field,id) =>{
    console.log('Field: ' + field + " " + id);
    console.log(field);
    let inputValue = document.getElementById(field).value;
    console.log(field + " " + inputValue + " " + id);
    // send ajax update call req.body.id,req.body.field,req.body.value)
    if(field == 'date'){
        field = 'date_id';
    }
    var dataObj = {
        id: id,
        field: field,
        value: inputValue
    };
    $.ajax({
        type: 'PUT',
        url: `/api/venues/${id}`,
        data: dataObj,
        success: (result, status, xhr) => {
            console.log('Successfully updated venue!');
        },
        error: (error,status, xhr) =>{
            console.log('Failed to update venue');
        }
    });

}


deleteVenue = () =>{
    // clear page
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'manageVenues()');
    content.appendChild(back);

    let deleteHeader = document.createElement('h1');
    deleteHeader.textContent = 'Partner Portal: Delete a venue';
    let deleteDesc = document.createElement('p');
    deleteDesc.textContent = 'This is the page to delete a specific venue. Click on a venue below to delete, you will then be prompted to confirm your deletion. Once you hit confirm, this action cannot be undone.';

    content.appendChild(deleteHeader);
    content.appendChild(deleteDesc);

    let venueContainer = document.createElement('div');
    venueContainer.id = 'venue-container';
    $.ajax({
        type: 'GET',
        url: `/api/venues/partner/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            for(let i=0; i<result.length; i++){
                makeVenueBoxForDelete(result[i], venueContainer);
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
    content.appendChild(venueContainer);
}

deleteVenueConfirm = (id) =>{
    var txt;
    if( confirm("Are you sure you want to delete this venue? This action cannot be undone!")){
        
        // Delete from venue_price
        $.ajax({
            type: 'DELETE',
            url: `/api/venue-price/${id}`,
            dataType: 'json',
            success: (result, status, xhr) => {
                console.log('Deleted from venue-price successfully');
            },
            error: (error,status,xhr) => {
                console.log('Could not delete from venue_price');
            },
            complete: (result,status,xhr) =>{
                // Delete from venue_discounts
                $.ajax({
                    type: 'DELETE',
                    url: `/api/venue-discounts/${id}`,
                    dataType: 'json',
                    success: (result, status, xhr) => {
                        console.log('Deleted from venue_discounts successfully');
                    },
                    error: (error,status,xhr) => {
                        console.log('Could not delete from venue_discounts');
                    },
                    complete: (result,status,xhr) =>{

                        // delete from discount-code
                        $.ajax({
                            type: 'DELETE',
                            url: `/api/discount-code/${id}`,
                            dataType: 'json',
                            success: (result, status, xhr) => {
                                console.log('Deleted from discount-code successfully');
                            },
                            error: (error,status,xhr) => {
                                console.log('Could not delete from discount-code');
                            },
                            complete: (result,status,xhr) =>{
                                // Delete from events ( Get ID of event )
                                listID = [];
                                $.ajax({
                                    type: 'GET',
                                    url: `/api/events/venues/${id}`,
                                    dataType: 'json',
                                    success: (result, status, xhr) => {
                                        result.forEach(e=>{
                                            listID.push(e.id);
                                        });
                                        console.log('Got all IDs successfully');
                                    },
                                    error: (error,status,xhr) =>{
                                        console.log('Could not get IDs');
                                    },
                                    complete: (result,status,xhr) =>{
                                        console.log(listID);
                                        // for each id in list, delete tags_events, event_price, then the venue
                                        listID.forEach(el=>{
                                            $.ajax({
                                                type: 'DELETE',
                                                url: `/api/tags-events/${el}`,
                                                dataType: 'json',
                                                success: (result, status, xhr) => {
                                                    console.log('Tags deleted successfully');
                                                },
                                                error: (error,status,xhr) => {
                                                    console.log('Tags were not deleted');
                                                },
                                                complete: (result,status,xhr) => {
                                                    // Delete event_price
                                                    $.ajax({
                                                        type: 'DELETE',
                                                        url: `/api/event-price/${el}`,
                                                        dataType: 'json',
                                                        success: (result, status, xhr) => {
                                                            console.log('Deleted Event Price Successfully');
                                                        },
                                                        error: (error, status, xhr) => {
                                                            console.log('Could not delete event price');
                                                        },
                                                        complete: (result,status,xhr) =>{
                                                            // delete event_discounts
                                                            // Delete event_price
                                                            $.ajax({
                                                                type: 'DELETE',
                                                                url: `/api/event-discounts/${el}`,
                                                                dataType: 'json',
                                                                success: (result, status, xhr) => {
                                                                    console.log('Deleted event-discounts Successfully');
                                                                },
                                                                error: (error, status, xhr) => {
                                                                    console.log('Could not delete event-discounts');
                                                                },
                                                                complete: (result,status,xhr) =>{
                                                                    // delete events
                                                                    // Delete the event
                                                                    $.ajax({
                                                                        type: 'DELETE',
                                                                        url: `/api/events/${el}`,
                                                                        dataType: 'json',
                                                                        success: (result, status, xhr) => {
                                                                            console.log('Deleted Events Successfully');
                                                                        },
                                                                        error: (error,status, xhr) =>{
                                                                            console.log('Could not delete events.');
                                                                        }, 
                                                                        complete: (result,status,xhr) =>{
                                                                            if(el == listID[listID.length-1]){
                                                                                // last element in the list means we can now delete the venue
                                                                                $.ajax({
                                                                                    type: 'DELETE',
                                                                                    url: `/api/venues/${id}`,
                                                                                    dataType: 'json',
                                                                                    success: (result, status, xhr) => {
                                                                                        alert('Successfully deleted!');
                                                                                    },
                                                                                    error: (error,status, xhr) =>{
                                                                                        console.log(status + " " + error);
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        });

                                        // no events ferda venu
                                        if(listID.length == 0){
                                            // last element in the list means we can now delete the venue
                                            $.ajax({
                                                type: 'DELETE',
                                                url: `/api/venues/${id}`,
                                                dataType: 'json',
                                                success: (result, status, xhr) => {
                                                    alert('Successfully deleted!');
                                                },
                                                error: (error,status, xhr) =>{
                                                    console.log(status + " " + error);
                                                }
                                            });
                                        }
                                    }
                                });     
                            }
                        });
                    }
                });
            }
        });
    }
}

// Appends a venue box to element { el }
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
// Appends a venue box to element { el }
makeVenueBoxForUpdate = (obj, el) =>{
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

    container.setAttribute('onclick',`updateVenue(${obj.id})`);

    el.appendChild(container);
}
// Appends a venue box to element { el }
makeVenueBoxForDelete = (obj, el) =>{
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

    container.setAttribute('onclick',`deleteVenueConfirm(${obj.id})`);

    el.appendChild(container);
}

visitVenue = (id) => {
    window.location.href=`/venues/${id}`;
}
