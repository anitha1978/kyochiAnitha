document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submitBtn2').addEventListener('click', function (event) {
        event.preventDefault();

        const firstName = document.getElementById('firstNameBook').value;
        const email = document.getElementById('emailBook').value;
        const number = document.getElementById('numberBook').value;
        const service = document.getElementById('serviceBook').value;
        const personsCount = document.getElementById('personsCountBook').value;
        const appointmentDate = document.getElementById('appointmentDateBook').value;
        const comments = document.getElementById('commentsBook').value;

        const formData = {
            firstName,
            email,
            number,
            service,
            personsCount,
            appointmentDate,
            comments
        };

        fetch('/.netlify/functions/service-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(async (response) => {
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                const errorText = await response.text(); // Get raw error message
                throw new Error(errorText);
            }

            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                throw new Error("Unexpected response format");
            }
        })
       
        .then(data => {
            // Show success message
            document.getElementById('submitBtn2').style.display = 'none';
            const successMsg = document.createElement('p');
            successMsg.className = 'text-success text-center mt-3';
            successMsg.innerText = 'Booked Successfully';
            document.getElementById('submitBtn2').insertAdjacentElement('afterend', successMsg);
        })
        .catch(error => {
            // Show error message
            document.getElementById('submitBtn2').style.display = 'none';
            const errorMsg = document.createElement('p');
            errorMsg.className = 'text-danger text-center mt-3';
            errorMsg.innerText = 'Error sending email: ' + error.message;
            document.getElementById('submitBtn2').insertAdjacentElement('afterend', errorMsg);
            console.error(error);
        });
    });
});
