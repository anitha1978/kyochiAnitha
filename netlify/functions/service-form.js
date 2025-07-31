const axios = require('axios');
require('dotenv').config();

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, // Method Not Allowed
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Only POST method is allowed' }),
        };
    }
    
    try {
        const { firstName, email, number, service, personsCount, appointmentDate, comments } = JSON.parse(event.body);

        // Validate if required fields are present
        if (!firstName || !email || !number || !service || !personsCount || !appointmentDate || !comments) {
            return {
                statusCode: 400, // Bad Request
                body: JSON.stringify({ message: 'Missing required fields' }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        }

        const sendinblueApiKey = process.env.SENDINBLUE_API_KEY;
        const sendinblueEmail = process.env.SENDINBLUE_Email;

        if (!sendinblueApiKey || !sendinblueEmail) {
            return {
                statusCode: 500, // Internal Server Error
               body: JSON.stringify({
    message: `
        <p>We are currently experiencing some technical issues. Please use the link below to reach us:</p>
        <p><a href="/contact" style="color: #007BFF; text-decoration: none; font-weight: bold;">Contact Us</a></p>
        <p>We apologize for any inconvenience caused and appreciate your understanding.</p>
    `,
}),

                headers: {
                    'Content-Type': 'application/json',
                },
            };
        }

        const emailData = {
            sender: { email: sendinblueEmail },
            to: [{ email: sendinblueEmail }],
            subject: "Appointment Confirmation",
            htmlContent: `
                <html>
                    <body>
                        <h1>Appointment Details</h1>
                        <p><strong>Name:</strong> ${firstName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone Number:</strong> ${number}</p>
                        <p><strong>Service:</strong> ${service}</p>
                        <p><strong>Persons Count:</strong> ${personsCount}</p>
                        <p><strong>Date:</strong> ${appointmentDate}</p>
                        <p><strong>Comments:</strong> ${comments}</p>
                    </body>
                </html>`
        };

        const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', emailData, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': sendinblueApiKey,
            },
        });

        // console.log('Sendinblue Response:', response.data);  // Log full response for debugging

        // Ensure proper JSON response format
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error sending email:', error);

        return {
            statusCode: 500, // Internal Server Error
            body: JSON.stringify({ message: 'Failed to send email', error: error.message }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};
