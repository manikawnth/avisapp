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
  "slots": { "location": "AMAZON.US_CITY"},

  "utterances": [
    "{nearest|closest} {avis|rental|avis rental|car rental} {locations|counters|stations} {|near|around|at|to} {-|location}"
  ]
},
  function (request, response) {
    var location = request.slot('location');
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

skill.error = function(err, request, response){
  console.log("Inside skill error function");
  const session = request.getSession();
  let msg = session.get('abendMsg');
  return response.say(msg).send();
}

//console.log(skill.schema());
console.log(skill.utterances());
exports.handler = skill.lambda();