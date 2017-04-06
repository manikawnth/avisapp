function AvailabilityIntent(request, response) {
  console.log("Checking availability");
  const session = request.getSession();
  const promptMsg = "What's the pickup location?";
  session.set('currentIntent', 'va');
  session.set('currentPrompt', 'location');
  session.set('currentPromptMsg', promptMsg)
  response.say(promptMsg).shouldEndSession(false);;
}

module.exports = AvailabilityIntent;