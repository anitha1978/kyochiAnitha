document.getElementById('submitBtn3').addEventListener('click', function (event) {
    event.preventDefault();

    const firstName = document.getElementById('firstNamecon').value;
    const email = document.getElementById('emailcon').value;
    const number = document.getElementById('numbercon').value;
    const subject = document.getElementById('subjectcon').value;
    const comments = document.getElementById('commentcon').value;

    const formData = {
        firstName,
        email,
        number,
        subject,
        comments
    };

    fetch('/.netlify/functions/contact-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(data => {
        document.getElementById('submitBtn3').style.display = 'none';
        const successMsg = document.createElement('p');
        successMsg.className = 'text-success text-center mt-3';
        successMsg.innerText = 'Message Sent Successfully';
        document.getElementById('submitBtn3').insertAdjacentElement('afterend', successMsg);
    })
    .catch(error => {
        document.getElementById('submitBtn3').style.display = 'none';
        const errorMsg = document.createElement('p');
        errorMsg.className = 'text-danger text-center mt-3';
        errorMsg.innerText = `Error sending email: ${error.message}`;
        // document.getElementById('submitBtn3').insertAdjacentElement('afterend', errorMsg);
        console.error(error);
    });
});
