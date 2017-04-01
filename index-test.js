const alexa = require('alexa-app');
const rp = require('request-promise');
const li = require('./location-inquiry');

const skill = new alexa.app("AvisApp");

skill.launch(function (request, response) {
  const shout = "Welcome to Avis Info Services! What would you like to know?";
  response.say(shout).shouldEndSession(false);
});

skill.intent("LocationInquiryIntent", {
  "slots": { "location": "AMAZON.US_CITY" },

  "utterances": [
    "what are some rental counters near {-|location} ",
    "car rental locations near {-|location}",
    "any rental locations at {-|location}",
    "address of nearest locations {-|location}",
    "address of nearest stations {-|location}",
    "need nearest locations {-|location}",
    "looking for closest locations of {-|location}"
  ]
},
  function (request, response) {
    var location = request.slot('location');

    const breakTime = `<break time="1s" />`;
    return li(location)
      .then(function (suggestions) {
        console.log("came to mains");
        let text = '';
        for (let each_location of suggestions) {
          text = text + each_location + breakTime;
        }
        response.say(text).send();
      })
      .catch(function(err){
        console.log(err);
        response.say("Some unknown error occured").send();
      })
  }
);
//console.log(skill.schema());
//console.log(skill.utterances());
exports.handler = skill.lambda();