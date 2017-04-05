const alexa = require('alexa-app');
const rp = require('request-promise');
const moment = require('moment');
const li = require('./location-inquiry');
const va = require('./vehicle-availability');

const skill = new alexa.app("AvisApp");

skill.launch(function (request, response) {
  const shout = "Welcome to Avis Info Services! What would you like to know?";
  const session = request.getSession();
  session.set('abendMsg', 'Something has gone wrong');
  response.say(shout).shouldEndSession(false);
});

skill.intent("LocationInquiryIntent", {
  "slots": { "location": "AMAZON.US_CITY", "zip": "AMAZON.NUMBER"},

  "utterances": [
    "{nearest|closest} {avis|rental|avis rental|car rental} {locations|counters|stations} {|near|around|at|to} {-|zip}",
    "{nearest|closest} {avis|rental|avis rental|car rental} {locations|counters|stations} {|near|around|at|to} {-|location}"
  ]
},
  function (request, response) {
    let inlocation = request.slot('location');
    let zip = request.slot('zip');
    console.log("inlocation " + inlocation);
    console.log("zip " + zip);
    let location = inlocation || zip;
    console.log("location " + location);
    const session = request.getSession();
    const breakTime = `<break time="1s" />`;
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
);

skill.intent("ResponseIntent", 
{
  "slots" : {"location" : "AMAZON.US_CITY", "respDate" : "AMAZON.DATE"},
  "utterances" : [
    "{-|location}",
    "{-|respDate}"
    ]
},
function(request,response){
  const session = request.getSession();
  const location = request.slot('location');
  const respDate = request.slot('respDate');
  const breakTime = `<break time="700ms" />`;

  if(location){
    return li(location, true)
    .then((locations)=>{
      session.set('location',locations[0]);
      response.say("The closest location is, ").say(locations[0].name).say(breakTime)
      .say("What's the pickup date you are looking for?").shouldEndSession(false);
    },(err)=>{
      response.say("I'm sorry. The requested location not found");
    })
  }
  else if(respDate){
    response.say("The date is " + respDate);
  }
  
})

skill.intent("AvailabilityIntent", 
{
  "slots" : {},
  "utterances" : [
    "looking for some vehicles",
    "prices of the cars",
    "availability of {cars|vehicles}"
  ]
},
function(request,response){
  console.log("Checking availability");
  const session = request.getSession();
  session.set('currentIntent', 'va');
  session.set('lastprompt', 'location');
  response.say("What's the pickup location?").shouldEndSession(false);;
})

/*
skill.intent("VehicleAvailabilityIntent", {
  "slots": { "location": "AMAZON.US_CITY", "fromDate": "AMAZON.DATE", "toDate": "AMAZON.DATE"},

  "utterances": [
    "looking for {|some} {vehicles|cars} at {-|location} {from|for the dates} {-|fromDate} {to|till} {-|toDate}",
    "availability of {vehicles|cars} at {-|location} {from|for the dates} {-|fromDate} {to|till} {-|toDate}",
    "find {|some} {vehicles|cars} at {-|location} {from|for the dates} {-|fromDate} {to|till} {-|toDate}"
  ]
},
  function (request, response) {
    let location = request.slot('location');
    let fromDate = request.slot('fromDate');
    let toDate = request.slot('toDate');
    console.log("location " + location);
    console.log("fromDate " + fromDate);
    console.log("toDate " + toDate);
    
    const session = request.getSession();
    const breakTime = `<break time="500ms" />`;

    return li(location, true)
    .then((locCodes)=>{
      let op_loc_code = locCodes[0].code;
      let op_loc_name = locCodes[0].name;

      //Invoke vehicle availability
      return va(op_loc_code, fromDate, toDate)
      .then((vehicles)=>{
        response.say("The prices of the cars at " + location + " are as follows:");
        for (let vehicle of vehicles){
          let speech = vehicle.name + ', ' + Math.round(vehicle.amount) + 'USD';
          response.say(speech).say(breakTime);
        }
      }, (err)=>{
        response.say(err).send();
      })
    })
    
  }
);
*/
skill.error = function(err, request, response){
  console.log("Inside skill error function");
  const session = request.getSession();
  let msg = session.get('abendMsg');
  return response.say(msg).send();
}

console.log(skill.schema());
console.log(skill.utterances());
exports.handler = skill.lambda();