const axios = require('axios');
require('dotenv').config();

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Only POST method is allowed' }),
        };
    }

    try {
        const { firstName, email, number, service, personsCount, appointmentDate, comments } = JSON.parse(event.body);

        if (!firstName || !email || !service || !personsCount || !appointmentDate || !comments) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'Missing required fields' }),
            };
        }

        const sendinblueApiKey = process.env.SENDINBLUE_API_KEY;
        const recipientEmail = process.env.SENDINBLUE_EMAIL;

        if (!sendinblueApiKey || !recipientEmail) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'Missing Sendinblue config' }),
            };
        }

        const emailData = {
            sender: { email: recipientEmail },
            to: [{ email: recipientEmail, name: 'Kyochicbe' }],
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
                </html>
            `
        };

        const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', emailData, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': sendinblueApiKey,
            },
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Email sent successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Failed to send email',
                error: error.message,
            }),
        };
    }
};
