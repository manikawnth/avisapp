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

  const currentPromptMsg = session.get('currentPromptMsg');
  const currentPrompt = session.get('currentPrompt');
  
  if (!respDate) {
    return locIntent(request,response);
  }
  else if(respDate){
    const breakTime = `<break time="500ms" />`;
    const medBreakTime = `<break time="700ms" />`;
    let code = session.get('location').code;    
    if( currentPrompt == 'fromDate'){
      session.set('fromDate', respDate);
      let msg = "When do you plan to return?";
      session.set('currentPromptMsg', msg);
      session.set('currentPrompt', 'toDate');
      return response.say(msg).shouldEndSession(false);
    }
    else if(currentPrompt == 'toDate'){
      session.set('toDate', respDate);
      let fromDate = session.get('fromDate');
      return va(code, fromDate ,respDate)
      .then((vehicles) => {
        response.say("The following are the available vehicles ")
        .say("with their approximate rental charges")        
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
  else{
    //TO - DO
  }
}
module.exports = ResponseIntent;