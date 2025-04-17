// Sound notification setup
const notificationSound = new Audio('notification.mp3');

async function sendNotifications(userPhone, userEmail, message) {
    // Play sound notification
    try {
        await notificationSound.play();
    } catch (error) {
        console.error('Error playing sound:', error);
    }

    // Check internet connection
    if (navigator.onLine) {
        // Send Firebase notification and email
        try {
            await sendFirebaseNotification(message);
            await sendEmail(userEmail, message);
        } catch (error) {
            console.error('Error sending online notifications:', error);
            // Fallback to SMS if online methods fail
            sendSMS(userPhone, message);
        }
    } else {
        // No internet connection, send SMS
        sendSMS(userPhone, message);
    }
}

function sendSMS(phoneNumber, message) {
    // Using Twilio API for SMS (you'll need to set up a Twilio account)
    const twilioEndpoint = 'YOUR_TWILIO_ENDPOINT';
    fetch(twilioEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: phoneNumber,
            message: message
        })
    }).catch(error => console.error('SMS sending failed:', error));
}

function sendEmail(email, message) {
    // Using EmailJS or similar service for email
    return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: email,
        message: message
    });
}