function formatTimeToFlight(daysUntilFlight) {
  const totalHours = (daysUntilFlight * 24).toFixed(3);
  const fullDays = Math.floor(daysUntilFlight); // Full days
  const remainingHours = ((daysUntilFlight - fullDays) * 24).toFixed(3); // Remaining hours after full days

  if (daysUntilFlight < 1) {
    return `Flight is ${totalHours} hours away`; // If flight is less than a day away
  } else {
    return `Flight is ${fullDays} day${
      fullDays > 1 ? "s" : ""
    } and ${remainingHours} hours away`; // If flight is more than a day away
  }
}

exports.formatTimeToFlight = formatTimeToFlight;
