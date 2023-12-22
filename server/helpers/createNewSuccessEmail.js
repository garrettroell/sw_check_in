function createNewSuccessEmail({
  firstName,
  lastName,
  confirmationNumber,
  boardingPosition,
  flights,
}) {
  // console.log(flights);

  function flightsToHTML(flights) {
    const flightHTMLSections = flights.map((flight) => {
      return `
        <div class="flight-row">
          <p class="airport-name">${flight.fromCode}</p>
          <img alt="plane image" class="plane-icon"
            src="https://ci5.googleusercontent.com/proxy/3nxNd7YDZm0rb9Doju5bsDToGfF7084gmxHzvhIGkIhdUqQNiHPfik9Ye_EMmSfdsTsROWQqld59coE55K1KRr7kP8pgkvWfrylerZumXxNh5O8t=s0-d-e1-ft#http://res.iluv.southwest.com/res/southwe_mkt_prod1/ico-plane.png">
          <p class="airport-name">${flight.toCode}</p>
        </div>
      `;
    });

    return flightHTMLSections.join("\n");
  }

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">


<head>
  <!-- general meta info -->
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">

  <!-- define fonts -->
  <link href="https://fonts.googleapis.com/css?family=Lato:300&display=swap" rel="stylesheet">

  <!-- define styles -->
  <style type="text/css">
    * {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
      font-weight: 400;
    }

    .wrapper {
      background-color: rgba(211, 211, 211, 0.13);
      /* height: 2000px; */
      width: 600px;
      margin: auto;
      /* border: 1px solid; */
    }

    .top-bar {
      height: 100px;
      margin: 20px;
      background-color: rgb(48, 75, 179);

    }

    .logo-holder {
      height: 37px;
      width: 225px;

      margin: auto;
      /* margin-top: 20px; */
      padding-top: 30px;
    }

    .logo {
      height: 100%;
      width: 100%;
    }

    .confirmation-text {
      text-align: center;
      margin-top: 50px;
      padding: 0 50px;
    }

    .title {
      font-size: 26px;
    }

    .order-number {
      margin-top: 10px;
      font-size: 18px;
    }

    .boarding-position {
      margin-top: 30px;
      font-size: 50px;
      text-align: center;
    }

    .name-text {
      margin-top: 30px;
      font-size: 14px;
      text-align: center;
    }

    .horizontal-line {
      width: 100%;
      border: 1px solid;
      border-top: 0px;
    }


    .order-details {
      margin-top: 30px;
      padding: 0 50px;
    }

    .order-details-title {
      font-size: 26px;
      margin-bottom: 10px;
    }

    .image-list {
      margin-top: 30px;
      width: 100%;
    }

    .image-holder {
      height: 150px;
      width: 100%;
      margin-bottom: 30px;
    }

    .image {
      height: 150px;
      width: 150px;
      float: left;
      object-fit: contain;
    }

    .payment-info {
      margin-top: 30px;
    }

    .payment-row {
      margin-bottom: 5px;
    }

    .flight-row {
      margin: 10px auto;
      padding: auto;
      text-align: center;
    }

    .airport-name {
      display: inline-block;
      color: #111b40;
      font-size: 40px;
      font-family: Arial, Helvetica, sans-serif;
      text-align: left;
      margin: 0;
    }

    .plane-icon {
      display: inline-block;
      max-width: 27px;
      max-height: 26px;
      padding-left: 15px;
      padding-right: 15px;
    }


    .button-row {
      width: 100%;
      margin-top: 40px;
      text-align: center;
    }

    .full-itinerary-button {
      cursor: pointer;
      background-color: #ffbf27;
      border: 1px solid #ffbf27;
      border-radius: 2px;
      box-shadow: 0 1px #8f8f8f;
      color: #111b40;

      font: bold 14px/1 Arial;
      min-height: 32px;
      padding: 10px 20px
    }

    footer {
      height: 50px;
      margin: 30px auto;
      margin-bottom: 50px;
      padding-bottom: 50px;
      background-color: rgb(48, 75, 179);
      width: 100%;
    }
  </style>
</head>

<body>
  <div class="wrapper">

    <!-- top bar -->
    <div class="top-bar">
      <div class="logo-holder">
        <img src="https://sw.garrettroell.com/assets/shoutless_white.4cb23334.png" alt="shoutless logo" class="logo">
      </div>
    </div>

    <!-- confirmation text -->
    <div class="confirmation-text">
      <h1 class="title">Auto Check-In Confirmation</h1>
      <h2 class="order-number">${firstName} ${lastName} (${confirmationNumber})</h2>
    </div>

    <div class="boarding-position">${boardingPosition}</div>

    <!-- order details -->
    <div class="order-details">
      <h3 class="order-details-title">Your flights</h3>
      <div class="horizontal-line"></div>
      ${flightsToHTML(flights)}
    </div>

    <div class="button-row">
      <a target="_blank"
        href="https://www.southwest.com/air/manage-reservation/?confirmationNumber=${confirmationNumber}&passengerFirstName=${firstName}&passengerLastName=${lastName}">
        <button class="full-itinerary-button">Full Itinerary</button>
      </a>
    </div>


    <footer>
      <div class="logo-holder">
        <img src="https://sw.garrettroell.com/assets/shoutless_white.4cb23334.png" alt="shoutless logo" class="logo">
      </div>

    </footer>
  </div>

</body>

</html>
  `;
}

module.exports = createNewSuccessEmail;
