$.ajax({
    type: 'POST',
    url: `/auth/verify`,
    dataType: 'json',
    success: (result, status, xhr) => {
        if(result == 'NULL'){
            // you must login
            mustLogin();
        }else{
            //good to render the page
            console.log(result);
            if(result.role == 1){
                renderGrantPortal(result.name, result.email);
            }
        }
    },
    error: (error,status, xhr) =>{
        console.log(error);
    }
});

mustLogin = () =>{
    let content = document.getElementById('content');

    let header = document.createElement('h1');
    header.id = 'bad-head';
    header.textContent = 'You must log in before accessing this page.'

    let loginLink = document.createElement('a');
    loginLink.textContent = 'Log in';
    loginLink.href='/create';

    content.appendChild(header);
    content.appendChild(loginLink);
}

renderGrantPortal = (name, email) =>{
    console.log(name + " " + email);

    document.getElementById('name').textContent = name;

    let content = document.getElementById('content');
    let header = document.createElement('h1');
    header.textContent = 'Grant Portal';

    let grantInfo = document.createElement('p');

    let discountInfoLink = document.createElement('a');
    discountInfoLink.textContent = 'More information about the discount.';
    discountInfoLink.href='/discountInfo';

    let uploadDocuments = document.createElement('h2');
    uploadDocuments.textContent = 'UPLOAD DOCUMENTS';

    //send ajax for row of /api/grantPortal
    $.ajax({
        type: 'GET',
        url: `/api/grantPortal`,
        dataType: 'json',
        success: (result, status, xhr) => {
            grantInfo.textContent = result[0].information;
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    content.appendChild(header);
    content.appendChild(grantInfo);
    content.appendChild(discountInfoLink);
    content.appendChild(uploadDocuments);

    let localDiv = document.createElement('div');

    let ldiv1 = document.createElement('div');
    let ldiv11 = document.createElement('div');
    let ldiv2 = document.createElement('div');

    let ltitle = document.createElement('h2');
    let lstatus = document.createElement('img');
    let lstatusText = document.createElement('p');
    let linfo = document.createElement('p');
    let lexpand = document.createElement('img');

    ldiv1.classList.add('leftDiv');
    ldiv11.classList.add('leftDiv1');
    ldiv2.classList.add('rightDiv');

    localDiv.classList.add('upload');
    localDiv.id = 'local';
    lexpand.id = 'loc';
    lexpand.setAttribute('onclick', 'expand(this.id)');

    ltitle.textContent = 'Local Documents';
    lstatus.src = '/images/not.png';
    lstatusText.textContent = 'Not uploaded';
    
    linfo.textContent = 'Local documents would include everything in your municiplalities juristiction. For example, if you have local aid programs such as Chapter 90, upload them here.';
    lexpand.src = '/images/gArrow.png';

    ldiv1.appendChild(ltitle);
    ldiv11.appendChild(lstatus);
    ldiv11.appendChild(lstatusText);
    ldiv1.appendChild(ldiv11);
    ldiv2.appendChild(linfo);
    ldiv2.appendChild(lexpand);
    
    localDiv.appendChild(ldiv1);
    localDiv.appendChild(ldiv2);

    let stateDiv = document.createElement('div');

    let sdiv1 = document.createElement('div');
    let sdiv11 = document.createElement('div');
    let sdiv2 = document.createElement('div');

    let stitle = document.createElement('h2');
    let sstatus = document.createElement('img');
    let sstatusText = document.createElement('p');
    let sinfo = document.createElement('p');
    let sexpand = document.createElement('img');

    stateDiv.classList.add('upload');
    stateDiv.id = 'state';
    sexpand.id = 'sta';
    sexpand.setAttribute('onclick', 'expand(this.id)');

    sdiv1.classList.add('leftDiv');
    sdiv11.classList.add('leftDiv1');
    sdiv2.classList.add('rightDiv');

    stitle.textContent = 'State Documents';
    sstatus.src = '/images/not.png';
    sinfo.textContent = 'State documents are subsidies given to you by the state you live in. For example, SNAP benefits are a New York state program.';
    sexpand.src = '/images/gArrow.png';
    sstatusText.textContent = 'Not uploaded';

    sdiv1.appendChild(stitle);
    sdiv11.appendChild(sstatus);
    sdiv11.appendChild(sstatusText);
    sdiv1.appendChild(sdiv11);
    sdiv2.appendChild(sinfo);
    sdiv2.appendChild(sexpand);
    
    stateDiv.appendChild(sdiv1);
    stateDiv.appendChild(sdiv2);

    let federalDiv = document.createElement('div');

    let fdiv1 = document.createElement('div');
    let fdiv11 = document.createElement('div');
    let fdiv2 = document.createElement('div');

    let ftitle = document.createElement('h2');
    let fstatus = document.createElement('img');
    let fstatusText = document.createElement('p');
    let finfo = document.createElement('p');
    let fexpand = document.createElement('img');

    federalDiv.classList.add('upload');
    federalDiv.id = 'federal';
    fexpand.id = 'fed';
    fexpand.setAttribute('onclick', 'expand(this.id)');

    fdiv1.classList.add('leftDiv');
    fdiv11.classList.add('leftDiv1');
    fdiv2.classList.add('rightDiv');

    ftitle.textContent = 'Federal Documents';
    fstatus.src = '/images/not.png';
    finfo.textContent = 'Federal documents are given to you by the federal government. These subsidies include, medicade, medicare, disability, etc.';
    fexpand.src = '/images/gArrow.png';
    fstatusText.textContent = 'Not uploaded';

    $.ajax({
        type: 'GET',
        url: `/api/files/${email}`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            if(result.length == 1 && result[0].status == 'pending'){
                switch(result[0].type){
                    case 'local':
                        lstatusText.textContent = 'One Pending';
                        lstatus.src = '/images/pending.png';
                        break;
                    case 'state':
                        sstatusText.textContent = 'One Pending';
                        sstatus.src = '/images/pending.png';
                        break;
                    case 'federal':
                        fstatusText.textContent = 'One Pending';
                        fstatus.src = '/images/pending.png';
                        break;
                    default:
                        console.log('uhhh');
                        break;
                }
            }

            if(result.length == 1 && result[0].status == 'approved'){
                switch(result[0].type){
                    case 'local':
                        lstatusText.textContent = 'Approved';
                        lstatus.src = '/images/approved.png';
                        break;
                    case 'state':
                        sstatusText.textContent = 'Approved';
                        sstatus.src = '/images/approved.png';
                        break;
                    case 'federal':
                        fstatusText.textContent = 'Approved';
                        fstatus.src = '/images/approved.png';
                        break;
                    default:
                        console.log('uhhh');
                        break;
                }
            }

            if(result.length == 1 && result[0].status == 'denied'){
                switch(result[0].type){
                    case 'local':
                        lstatusText.textContent = 'Denied';
                        lstatus.src = '/images/denied.png';
                        break;
                    case 'state':
                        sstatusText.textContent = 'Denied';
                        sstatus.src = '/images/denied.png';
                        break;
                    case 'federal':
                        fstatusText.textContent = 'Denied';
                        fstatus.src = '/images/denied.png';
                        break;
                    default:
                        console.log('uhhh');
                        break;
                }
            }

            if(result.length == 1 && result[0].status == 'deferred'){
                switch(result[0].type){
                    case 'local':
                        lstatusText.textContent = 'Document on hold';
                        lstatus.src = '/images/defered.png';
                        break;
                    case 'state':
                        sstatusText.textContent = 'Document on hold';
                        sstatus.src = '/images/defered.png';
                        break;
                    case 'federal':
                        fstatusText.textContent = 'Document on hold';
                        fstatus.src = '/images/defered.png';
                        break;
                    default:
                        console.log('uhhh');
                        break;
                }
            }

            if(result.length > 1){
                result.forEach(e=>{
                    if(e.status == 'pending'){
                        switch(e.type){
                            case 'local':
                                lstatusText.textContent = 'Pending';
                                lstatus.src = '/images/pending.png';
                                break;
                            case 'state':
                                sstatusText.textContent = 'Pending';
                                sstatus.src = '/images/pending.png';
                                break;
                            case 'federal':
                                fstatusText.textContent = 'Pending';
                                fstatus.src = '/images/pending.png';
                                break;
                            default:
                                console.log('uhhh');
                                break;
                        }
                    }

                    if(e.status == 'approved'){
                        switch(e.type){
                            case 'local':
                                lstatusText.textContent = 'Approved';
                                lstatus.src = '/images/approved.png';
                                break;
                            case 'state':
                                sstatusText.textContent = 'Approved';
                                sstatus.src = '/images/approved.png';
                                break;
                            case 'federal':
                                fstatusText.textContent = 'Approved';
                                fstatus.src = '/images/approved.png';
                                break;
                            default:
                                console.log('uhhh');
                                break;
                        }
                    }

                    if(e.status == 'denied'){
                        switch(e.type){
                            case 'local':
                                lstatusText.textContent = 'Denied';
                                lstatus.src = '/images/denied.png';
                                break;
                            case 'state':
                                sstatusText.textContent = 'Denied';
                                sstatus.src = '/images/denied.png';
                                break;
                            case 'federal':
                                fstatusText.textContent = 'Denied';
                                fstatus.src = '/images/denied.png';
                                break;
                            default:
                                console.log('uhhh');
                                break;
                        }
                    }

                    if(e.status == 'deferred'){
                        switch(e.type){
                            case 'local':
                                lstatusText.textContent = 'Document on hold';
                                lstatus.src = '/images/defered.png';
                                break;
                            case 'state':
                                sstatusText.textContent = 'Document on hold';
                                sstatus.src = '/images/defered.png';
                                break;
                            case 'federal':
                                fstatusText.textContent = 'Document on hold';
                                fstatus.src = '/images/defered.png';
                                break;
                            default:
                                console.log('uhhh');
                                break;
                        }
                    }
                });
            }
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    fdiv1.appendChild(ftitle);
    fdiv11.appendChild(fstatus);
    fdiv11.appendChild(fstatusText);
    fdiv1.appendChild(fdiv11);
    fdiv2.appendChild(finfo);
    fdiv2.appendChild(fexpand);
    
    federalDiv.appendChild(fdiv1);
    federalDiv.appendChild(fdiv2);

    content.appendChild(localDiv);
    content.appendChild(stateDiv);
    content.appendChild(federalDiv);
}

expand = (id) =>{
    let container;
    switch(id){
        case 'fed':
            container = document.getElementById('federal');
            break;
        case 'sta':
            container = document.getElementById('state');
            break;
        case 'loc':
            container = document.getElementById('local');
            break;
    }

    

    // add to container
    // upload button, inside of a form
    if(container.style.height != '14vw'){
        container.style.height = '14vw';

        let form = document.createElement('form');
        form.setAttribute('method', 'POST');
        form.setAttribute('enctype','multipart/form-data');
        form.setAttribute('action','/upload');
        let file = document.createElement('input');
        file.setAttribute('type','file');
        file.setAttribute('name','file');
        let submit = document.createElement('input');
        submit.setAttribute('type','submit');
        submit.setAttribute('value','Submit');
        let email = document.createElement('input');
        email.setAttribute('type','hidden');
        email.setAttribute('name', 'email');
        $.ajax({
            type: 'POST',
            url: `/auth/verify`,
            dataType: 'json',
            success: (result, status, xhr) => {
                if(result == 'NULL'){
                    // you must login
                    mustLogin();
                }else{
                    //good to render the page
                    console.log(result);
                    email.setAttribute('value', result.email);
                }
            },
            error: (error,status, xhr) =>{
                console.log(error);
            }
        });
        email.id = 'email';
        let type = document.createElement('input');
        type.setAttribute('type','hidden');
        type.setAttribute('name','type');
        type.setAttribute('value', container.id);
        type.id = 'type';

        form.appendChild(file);
        form.appendChild(email);
        form.appendChild(type);
        form.appendChild(submit);

        form.id = 'form-' + id;

        container.appendChild(form);
        
        //set arrow to up arrow
        let upArrow = document.getElementById(id);
        upArrow.src = '/images/dArrow.png';
        upArrow.style.width = '2vw';
        upArrow.style.height = '1.5vw';
    }else{
        let theForm = document.getElementById('form-' + id);
        container.removeChild(theForm);
        container.style.height = '8vw';

        //set arrow to side arrow
        let upArrow = document.getElementById(id);
        upArrow.src = '/images/gArrow.png';
        upArrow.style.width = '1.5vw';
        upArrow.style.height = '2vw';
    }
    
}


