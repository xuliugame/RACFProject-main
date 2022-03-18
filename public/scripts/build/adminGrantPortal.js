// send api req for files

buildPage = () =>{
    
    try{
        document.getElementById('back').innerHTML = "";
    }catch (e){
        console.log(e);
    }

    let content = document.getElementById('content');
    content.innerHTML = "";
    let header = document.createElement('h1');
    header.textContent = 'Grant Portal Submissions';

    let desc = document.createElement('p');
    desc.textContent = 'This is where you will find all the uploaded documents, submitted by people accessing our grant portal. Clicking view will take you to a more in depth look at the persons profile, and you will be able to view the documents there, and approve or deny them their discount.'

    let table = document.createElement('table');
    let th1 = document.createElement('th'); // date submitted
    let th2 = document.createElement('th'); // username
    let th3 = document.createElement('th'); // type ( local, state, federal )
    let th4 = document.createElement('th'); // status ( approved, denied, pending )

    th1.textContent = 'Date Submitted';
    th2.textContent = 'Email Address';
    th3.textContent = 'Type';
    th4.textContent = 'Status';

    let tr1 = document.createElement('tr');
    tr1.appendChild(th1);
    tr1.appendChild(th2);
    tr1.appendChild(th3);
    tr1.appendChild(th4);

    table.appendChild(tr1);
    content.appendChild(header);
    content.appendChild(desc);
    content.appendChild(table);

    $.ajax({
        type: 'GET',
        url: `/api/files/`,
        dataType: 'json',
        success: (result, status, xhr) => {
            console.log(result);
            result.forEach(e=>{
                let date = document.createElement('td');
                let convertDate = e.filename.split('-')[1].split('.')[0];
                date.textContent = moment().format('DD/MM/YYYY');

                let email = document.createElement('td');
                email.textContent = e.email;

                let type = document.createElement('td');
                type.textContent = e.type;

                let status = document.createElement('td');
                status.textContent = e.status;

                let button = document.createElement('button');
                button.textContent = 'View';
                button.id = e.email;
                button.setAttribute('onclick', 'viewDoc(this.id)');
                status.appendChild(button);

                let tr = document.createElement('tr');
                tr.appendChild(date);
                tr.appendChild(email);
                tr.appendChild(type);
                tr.appendChild(status);
                table.appendChild(tr);
                
            });
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });
}

viewDoc = (id) =>{
    // clear the content div

    console.log(id);
    let content = document.getElementById('content');
    content.innerHTML = "";

    let back = document.createElement('p');
    back.id = 'back';
    back.textContent = '< Back';
    back.setAttribute('onclick', 'buildPage()');

    content.appendChild(back);

    $.ajax({
        type: 'GET',
        url: `/api/users/${id}`,
        dataType: 'json',
        success: (result, status, xhr) => {

            console.log(result);

            let cDiv = document.createElement('div');
            cDiv.id = 'c-div';
            
            let usernameHeader = document.createElement('h3');
            usernameHeader.textContent = 'USERNAME';
            let username = document.createElement('h2');
            username.textContent = id;
            
            
            let informationHeader = document.createElement('h3');
            informationHeader.textContent = 'INFORMATION';

            let nameHeader = document.createElement('h4');
            nameHeader.textContent = "Name";
            let name = document.createElement('p');
            name.textContent = result.full_name;

            let addressHeader = document.createElement('h4');
            addressHeader.textContent = "Street Address";
            let address = document.createElement('p');
            address.textContent = result.address;

            let zipcodeHeader = document.createElement('h4');
            zipcodeHeader.textContent = 'Zip Code';
            let zipcode = document.createElement('p');
            zipcode.textContent = result.zipcode;

            let benefitsHeader = document.createElement('h3');
            benefitsHeader.textContent = 'BENEFITS';
            let benefits = document.createElement('h5');
            
            $.ajax({
                type: 'GET',
                url: `/api/discountsUsers/${id}`,
                dataType: 'json',
                success: (result, status, xhr) => {
                    console.log(result);
                    result.forEach(e=>{
                        $.ajax({
                            type: 'GET',
                            url: `/api/discounts/${e.discountID}`,
                            dataType: 'json',
                            success: (result, status, xhr) => {
                                benefits.textContent += result.name + " ";
                            },
                            error: (error,status, xhr) =>{
                                console.log(status + " " + error);
                            }
                        });
                    });

                },
                error: (error,status, xhr) =>{
                    console.log(status + " " + error);
                }
            });

            cDiv.appendChild(usernameHeader);
            cDiv.appendChild(username);
            cDiv.appendChild(informationHeader);
            cDiv.appendChild(nameHeader);
            cDiv.appendChild(addressHeader);
            cDiv.appendChild(zipcodeHeader);
            cDiv.appendChild(name);
            cDiv.appendChild(address);
            cDiv.appendChild(zipcode);
            cDiv.appendChild(benefitsHeader);
            cDiv.appendChild(benefits);
            content.appendChild(cDiv);

            let docViewer = document.createElement('iframe');
            docViewer.id = 'doc-view';
            docViewer.style.display = 'none';
            content.appendChild(docViewer);

            // FORM FOR SUBMITTING DISCOUNTS
            let approvalForm = document.createElement('form');
            
            approvalForm.setAttribute('method', 'POST');
            approvalForm.setAttribute('action', '/auth/updateDiscount');

            let discountLabel = document.createElement('label');
            discountLabel.setAttribute('for', 'discounts');
            discountLabel.id = 'discount-label';
            discountLabel.textContent = 'Which discount are they applying for?';
            let discounts = document.createElement('select');
            discounts.id = 'discounts';
            discounts.name = 'discounts';
            discountLabel.style.display = 'none';
            discounts.style.display = 'none';
            approvalForm.appendChild(discountLabel);
            approvalForm.appendChild(discounts);

            let decideLabel = document.createElement('label');
            decideLabel.setAttribute('for', 'decide');
            decideLabel.id = 'decide-label';
            decideLabel.textContent = 'Do they meet the criteria?';
            let decide = document.createElement('select');
            decide.id = 'decide';
            decide.name = 'decide';
            decideLabel.style.display = 'none';
            decide.style.display = 'none';

            let hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type','hidden');
            hiddenInput.value = id;
            hiddenInput.name = 'email';
            hiddenInput.id = 'email';
            approvalForm.appendChild(hiddenInput);
            
            let hiddenFileName = document.createElement('input');
            hiddenFileName.setAttribute('type','hidden');
            hiddenFileName.value = "";
            hiddenFileName.name = 'filename';
            hiddenFileName.id = 'filename'
            approvalForm.appendChild(hiddenFileName);
            
            let approve = document.createElement('option');
            approve.value = 'Approve';
            approve.textContent = 'Approve';
            let deny = document.createElement('option');
            deny.value = 'Deny';
            deny.textContent = 'Deny';
            let defer = document.createElement('option');
            defer.value = 'Defer';
            defer.textContent = 'Defer';
            decide.appendChild(approve);
            decide.appendChild(deny);
            decide.appendChild(defer);

            approvalForm.appendChild(decideLabel);
            approvalForm.appendChild(decide);

            let button = document.createElement('button');
            button.setAttribute('type','submit');
            button.textContent = 'Submit';
            button.style.display = 'none';
            button.id = 'submit-form-button';
            approvalForm.appendChild(button);
            // get options for discounts

            $.ajax({
                type: 'GET',
                url: `/api/discounts/`,
                dataType: 'json',
                success: (result, status, xhr) => {
                    console.log(result);
                    result.forEach(e=>{
                        let option = document.createElement('option');
                        option.value = e.name;
                        option.textContent = e.name;
                        discounts.appendChild(option);
                    });
                },
                error: (error,status, xhr) =>{
                    console.log(status + " " + error);
                }
            });

            content.appendChild(approvalForm);

            let table = document.createElement('table');
            let th1 = document.createElement('th'); // date submitted
            let th2 = document.createElement('th'); // username
            let th3 = document.createElement('th'); // type ( local, state, federal )
            let th4 = document.createElement('th'); // status ( approved, denied, pending )

            th1.textContent = 'Date Submitted';
            th2.textContent = 'Email Address';
            th3.textContent = 'Type';
            th4.textContent = 'Status';

            let tr1 = document.createElement('tr');
            tr1.appendChild(th1);
            tr1.appendChild(th2);
            tr1.appendChild(th3);
            tr1.appendChild(th4);

            table.appendChild(tr1);
            content.appendChild(table);
            //get all files associated with user (id)
            $.ajax({
                type: 'GET',
                url: `/api/files/${id}`,
                dataType: 'json',
                success: (result, status, xhr) => {
                    console.log(result);
                    result.forEach(e=>{
                        let date = document.createElement('td');
                        let convertDate = e.filename.split('-')[1].split('.')[0];
                        date.textContent = moment().format('DD/MM/YYYY');
        
                        let email = document.createElement('td');
                        email.textContent = e.email;
        
                        let type = document.createElement('td');
                        type.textContent = e.type;
        
                        let status = document.createElement('td');
                        status.textContent = e.status;
        
                        let button = document.createElement('button');
                        button.textContent = 'View';
                        button.id = e.filename;
                        button.setAttribute('onclick', 'viewDocument(this.id)');
                        status.appendChild(button);
        
                        let tr = document.createElement('tr');
                        tr.appendChild(date);
                        tr.appendChild(email);
                        tr.appendChild(type);
                        tr.appendChild(status);
                        table.appendChild(tr);
                        
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
}

viewDocument = (id) =>{
    let doc = document.getElementById('doc-view');
    doc.style.display = 'block';
    doc.src = `https://docs.google.com/gview?url=http://129.21.149.182:3000/files/${id}&embedded=true`;
    document.getElementById('discount-label').style.display = 'block';
    document.getElementById('discounts').style.display = 'block';
    document.getElementById('decide-label').style.display = 'block';
    document.getElementById('decide').style.display = 'block';
    document.getElementById('submit-form-button').style.display = 'block';
    document.getElementById('filename').value = id;
}
buildPage();
