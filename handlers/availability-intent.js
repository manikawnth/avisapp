function AvailabilityIntent(request, response) {
  console.log("Checking availability");
  const session = request.getSession();
  session.set('currentIntent', 'va');
  session.set('lastPrompt', 'location');
  response.say("What's the pickup location?").shouldEndSession(false);;
}

module.exports = AvailabilityIntent;