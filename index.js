const alexa = require('alexa-app');
const rp = require('request-promise');
const li = require('./services/location-inquiry');
const va = require('./services/vehicle-availability');

const availabilityIntentHandler = require('./handlers/availability-intent');
const responseIntentHandler = require('./handlers/response-intent');
const locationIntentHandler = require('./handlers/location-intent');

const skill = new alexa.app("AvisApp");

skill.launch(function (request, response) {
  const shout = "Welcome to Avis Info Services! What would you like to know?";
  const session = request.getSession();
  session.set('abendMsg', 'Something has gone wrong');
  response.say(shout).shouldEndSession(false);
});

skill.intent("AMAZON.NoIntent",
{
  "slots" : {},
  "utterances" : [
    "No",
    "No thanks"
  ]
},
function(request, response){
  response.say("Find out more at avis.com. Goodbye.");
})

skill.intent("AMAZON.StopIntent",
{
  "slots" : {},
  "utterances" : [
    "stop it",
    "quit",
    "enough",
    "bye",
    "good bye",
    "tata"

  ]
},
function(request, response){
  response.say("Find out more at avis.com. Goodbye.");
})

skill.intent("ResponseIntent",
  {
    "slots": { "respDate": "AMAZON.DATE", "location": "AMAZON.US_CITY", "state": "AMAZON.US_STATE", "zip": "AMAZON.NUMBER", "airport" : "AMAZON.Airport" },
    "utterances": [
      "{-|respDate}",
      "{-|airport}",
      "{-|location}",
      "{-|location} {-|state}",
      "{-|zip}"
    ]
  },
  responseIntentHandler);

skill.intent("LocationIntent",
  {
    "slots": { "location": "AMAZON.US_CITY", "state": "AMAZON.US_STATE", "zip": "AMAZON.NUMBER" , "airport" : "AMAZON.Airport"},
    "utterances": [
      "{nearest|closest} {avis|rental|avis rental|car rental} {locations|counters|stations} {|near|around|at|to} {-|zip}",
      "{nearest|closest} {avis|rental|avis rental|car rental} {locations|counters|stations} {|near|around|at|to} {-|location}",
      "{nearest|closest} {avis|rental|avis rental|car rental} {locations|counters|stations} {|near|around|at|to} {-|airport}"
    ]
  },
  locationIntentHandler);

skill.intent("AvailabilityIntent",
  {
    "slots": {},
    "utterances": [
      "looking for {a|some} {cars|vehicles}",
      "prices of the {cars|vehicles}",
      "find a {car|vehicle} {|for me}",
      "get me a {|rental} {car|vehicle}",
      "need a {|rental} {car|vehicle}",
      "list of {cars|vehicles}",
      "availability of {cars|vehicles}",
      "{cars|vehicles} availability",
      "prices",
      "{cars|vehicles}",
      "availability"
    ]
  },
  availabilityIntentHandler);

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

skill.error = function(err, request, response){
  console.log("Inside skill error function");
  const session = request.getSession();
  let msg = session.get('abendMsg');
  return response.say(msg).send();
}
*/

console.log(skill.schema());
console.log(skill.utterances());
exports.handler = skill.lambda();