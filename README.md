# Shoutless
Shoutless is a website that automatically checks you into your Southwest flights 24 hours before your flight. Simply enter your first name, last name, and confirmation number, and Shoutless will handle the rest. If you provide your email address, you'll receive a confirmation email with your boarding position when you're checked in.

## How It Works
Shoutless uses a Node.js server, cronjobs, and Puppeteer to automate the check-in process. On the front-end, it's a Vite React app that uses Chakra UI for styling and Formik for form handling.

When you submit your flight details, the data is sent to the server. The server then uses Puppeteer, a headless browser, to navigate to the Southwest website. It fills in the user's flight information on the 'manage reservation' form and retrieves details such as the flight time and departure city's timezone. The server then schedules a cronjob that runs 24 hours and 1 minute before the check-in time, taking into account the departure airport's timezone.

24 hours and 1 minute before your flight's check-in time, the server runs a function that opens a Puppeteer browser and fills in the check-in form with your details. When the check-in window opens, the form is submitted, and the boarding position from the success page is used to send you an email with your confirmation.

## Reporting Bugs and Suggesting Improvements
If you encounter any bugs or have suggestions for improvements, please use GitHub Issues to report them.

## Disclaimer
While the site has been stable for about 3 months, this site relies on parsing the HTML sent from Southwest's website. If they change their website, this site may break.