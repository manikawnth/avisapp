const li = require('../services/location-inquiry');
const va = require('../services/vehicle-availability');
const locIntent = require('./location-intent');

function ResponseIntent(request, response) {
  console.log("Handler: ResponseIntent");
  const session = request.getSession();
  const inlocation = request.slot('location');
  const state = request.slot('state');
  const zip = request.slot('zip');
  const airport = request.slot('airport');
  const respDate = request.slot('respDate');
  const breakTime = `<break time="700ms" />`;
  console.log(request.data.request.intent);
  
  if (!respDate) {
    /*
    let location;
    if(zip){
      location = zip;
    }
    else{
      location = state ? (inlocation + ' ' + state) : inlocation;
    }
    return li(location, true)
      .then((locations) => {
        session.set('location', locations[0]);
        response.say("The closest location is, ").say(locations[0].name).say(breakTime)
          .say("What's the pickup date you are looking for?").shouldEndSession(false);
      }, (err) => {
        response.say("I'm sorry. The requested location not found");
      })
      */
    return locIntent(request,response);
  }
  else{
    session.set('lastPrompt', 'pickup date');
    const breakTime = `<break time="500ms" />`;
    const medBreakTime = `<break time="700ms" />`;
    let code = session.get('location').code;
    return va(code, respDate)
      .then((vehicles) => {
        response.say("The following are the available vehicles ")
        .say("with their approximate charges per day")        
        .say(medBreakTime);
        for (let vehicle of vehicles) {
          let speech = vehicle.name + ', ' + Math.round(vehicle.amount) + 'USD';
          response.say(speech).say(breakTime);
        }
      }, (errMsg) => {
        response.say(errMsg).send();
      })
  }
}
module.exports = ResponseIntent;