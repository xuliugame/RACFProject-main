buildDiscountPage = () =>{
    //discount header
    let header = document.createElement('h1');
    header.id = 'header';
    header.textContent = 'Discount Information';

    let desc = document.createElement('p');
    desc.id = 'desc'
    //discount descr pulled from DB
    $.ajax({
        type: 'GET',
        url: `/api/discountInfo/1`,
        dataType: 'json',
        success: (result, status, xhr) => {
            desc.textContent = result.descr;
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    // build questions
    let qaDiv = document.createElement('div');
    qaDiv.id = 'qa-div';
    let count = 0;
    $.ajax({
        type: 'GET',
        url: `/api/discountInfo`,
        dataType: 'json',
        success: (result, status, xhr) => {
            result.forEach(element => {
                let question = document.createElement('h2');
                let answer   = document.createElement('p');
                question.id = `h2-${count}`;
                answer.id   = `p-${count}`;
                answer.style.display = 'none';
                question.textContent = element.question;
                answer.textContent   = element.answer;
                if(question.textContent.length > 1){
                    question.setAttribute('onclick','show(this.id)');
                    qaDiv.appendChild(question);
                    qaDiv.appendChild(answer);
                    count++;
                }
            });
            
        },
        error: (error,status, xhr) =>{
            console.log(status + " " + error);
        }
    });

    let content = document.getElementById('content');
    content.appendChild(header);
    content.appendChild(desc);
    content.appendChild(qaDiv);
}

buildDiscountPage();



// Plain JS functions
show = (id) => {
    let arr = id.split('-');
    console.log(arr[1]);
    let el = document.getElementById(`p-${arr[1]}`);
    console.log(el.style.display);
    if(el.style.display == 'none'){
        el.style.display = 'block';
        document.getElementById(id).classList.add('downArrow');
    }else if(el.style.display == 'block'){
        el.style.display = 'none';
        document.getElementById(id).classList.remove('downArrow');
    }
}