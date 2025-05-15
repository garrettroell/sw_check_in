const fs = require("fs");
const cheerio = require("cheerio");
const airportTimezones = require("../../airportTimezones/airportTimezones.json");

// airport code -> time zone (TZ Database Name)
function getTimezone(airportCode) {
  return airportTimezones.filter(function (airport) {
    return airportCode === airport.code;
  })[0].timezone;
}

// airport code -> time zone offset object (ex: {gmt: xx, dst: yy })
function getTimezoneOffset(airportCode) {
  return airportTimezones.filter(function (airport) {
    return airportCode === airport.code;
  })[0].offset;
}

// get the flight info from an html string
function parseFlight(flightHtml) {
  const $ = cheerio.load(flightHtml);

  function findText(selector, matchFn) {
    return $(selector)
      .filter((_, el) => matchFn($(el).text().trim()))
      .first();
  }

  const date = findText("div", (text) =>
    /^\w{3}, \w+ \d{1,2}, \d{4}$/.test(text)
  ).text();

  const number = findText("div", (text) => /^WN\d+/.test(text)).text();

  const depLabel = $("div")
    .filter((_, el) => $(el).text().trim() === "Departs")
    .first();
  const depSegment = depLabel.closest("div.segment__726LC");
  const fromCity = depSegment.find(".text__BKvsn").first().text().trim();
  const fromCodeRaw = depSegment.find(".cityAndStationCode__VHuyu").text();
  const fromCode = fromCodeRaw.split("-")[1]?.trim() || "";

  const depTimeEl = depSegment.find(".segmentTime__nZavU").first();
  const departureTime = depTimeEl.length
    ? `${depTimeEl.children().eq(0).text().trim()} ${depTimeEl
        .children()
        .eq(1)
        .text()
        .trim()}`
    : "";

  const arrLabel = $("div")
    .filter((_, el) => $(el).text().trim() === "Arrives")
    .first();
  const arrSegment = arrLabel.closest("div.segment__726LC");
  const toCity = arrSegment.find(".text__BKvsn").first().text().trim();
  const toCodeRaw = arrSegment.find(".cityAndStationCode__VHuyu").text();
  const toCode = toCodeRaw.split("-")[1]?.trim() || "";

  const departureTimezone = getTimezone(fromCode);
  const timezoneOffset = getTimezoneOffset(fromCode);

  return {
    date,
    number,
    departureTime,
    fromCity,
    fromCode,
    toCity,
    toCode,
    departureTimezone,
    timezoneOffset,
  };
}

// successful check in page html -> boarding position
function checkInHTMLToBoardingPosition(checkInHTML) {
  let boardingPosition = checkInHTML
    .split('<span class="swa-g-screen-reader-only">Boarding position')[1]
    .split("</span>")[0];

  return boardingPosition.trim();
}

module.exports = {
  parseFlight,
  checkInHTMLToBoardingPosition,
  getTimezone,
  getTimezoneOffset,
};
