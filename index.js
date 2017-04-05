const alexa = require('alexa-app');
const rp = require('request-promise');
const li = require('./location-inquiry');

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
    const breakTime = `<break time="1s" />`;

    response.say(location).say(breakTime).say(fromDate).say(breakTime).say(toDate);
    /*
    return li(location)
      .then((suggestions) => {
        console.log("came to mains");
        let text = '';
        for (let each_location of suggestions) {
          text = text + each_location + breakTime;
        }
        response.say(text).send();
      })
      */
  }
);

skill.error = function(err, request, response){
  console.log("Inside skill error function");
  const session = request.getSession();
  let msg = session.get('abendMsg');
  return response.say(msg).send();
}

console.log(skill.schema());
console.log(skill.utterances());
exports.handler = skill.lambda();