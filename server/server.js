const app = require('./app');
const sendEmail = require('./utils/sendEmail');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

sendEmail({
  email: 'shubspatil17@gmail.com',  // Your real email
  subject: 'SMTP Test Email',
  message: 'This is a test email from your backend.'
}).then(() => console.log('Test email sent!'))
  .catch(console.error);