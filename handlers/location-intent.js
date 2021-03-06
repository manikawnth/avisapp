const li = require('../services/location-inquiry');

function LocationIntent(request, response) {
  console.log("Handler: LocationInquiryIntent");
  let inlocation = request.slot('location');
  const state = request.slot('state');
  let zip = request.slot('zip');
  let airport = request.slot('airport');

  inlocation = state ? (inlocation + ' ' + state) : inlocation;
  let location = inlocation || zip || airport;
  console.log("location " + location);
  const session = request.getSession();
  const breakTime = `<break time="1s" />`;
  const smallBreakTime = `<break time="500ms" />`;

  const currentPromptMsg = session.get('currentPromptMsg');
  const currentPrompt = session.get('currentPrompt');
  const currentIntent = session.get('currentIntent');

  if ((currentIntent == 'va') && (currentPrompt == 'location')) {
    return li(location, true)
      .then((locations) => {
        const msg = "What's the pickup date you are looking for?";
        session.set('location',locations[0]);
        session.set('currentPrompt','fromDate');
        session.set('currentPromptMsg',msg);
        response.say("The closest location is, ").say(locations[0].name).say(breakTime)
          .say(msg).shouldEndSession(false);
      }, (err) => {        
        response.say("I'm sorry. The requested location is not found")
        .say(smallBreakTime)
        .say(currentPromptMsg).shouldEndSession(false);

      })
  }
  else{
    return li(location)
    .then((suggestions) => {
      console.log("came to mains");
      let text = '';
      for (let each_location of suggestions) {
        text = text + each_location + breakTime;
      }
      response.say(text).send();
    })
  }
  
}

module.exports = LocationIntent;