const alexa = require('alexa-app');
const rp = require('request-promise');
//const li = require('./location-inquiry');

const skill = new alexa.app("AvisApp");
const END_POINT = 'https://mqa.avis.com/mobileapi/v2/request';
const SERVICE = 'FindLocationsByKeyword';

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
    function (req, response) {
        console.log("intent invoked");
        var location = req.slot('location');
        //location = location.split(' ').join('%20');

        const breakTime = `<break time="1s" />`;
        
        let request = {
            "requestHeader": {
                "clientLanguageCode": "EN",
                "clientCountryCode": "US",
                "apiVersion": "1",
                "brand": "AVIS",
                "clientType": "CHATBOT",
                "deviceDetails": {
                    "platform": "SCH-I545",
                    "manufacturer": "samsung",
                    "operatingSystem": "android",
                    "osVersion": "5.0.1",
                    "appVersion": "7.3.3"
                }
            },
            "keyword": "hi",
            "vehicleTypesOffered": "PASSENGER"
        }

        request['keyword'] = location;
        let options = {
            method: 'POST',
            uri: END_POINT,
            body: request,
            json: true,
            headers: {
                'content-type': 'application/json',
                'Service': 'FindLocationsByKeyword'
            }
        };

        return rp(options)
            .then(function (resp) {
                console.log("response received");
                if (resp.locations) {
                    const locations = resp.locations;
                    const loc_len = resp.locations.length > 3 ? 3 : resp.locations.length;
                    const suggestions = [];
                    for (let i = 0; i < loc_len; i++) {
                        if (locations[i].name) {
                            suggestions.push(locations[i].name);
                        }
                        else {
                            suggestions.push(locations[i].code);
                        }
                    }

                    let text = '';
                    for (let each_location of suggestions) {
                        text = text + each_location + breakTime;
                    }
                    response.say(text).send();
                }
                else {
                    response.say("No matching locations found").send();
                }
            })
            .catch(function (err) {
                console.log("Some error");
                console.log(err);
                response.say("Some unknown error occured").send();
            })

    }
);
//console.log(skill.schema());
//console.log(skill.utterances());
exports.handler = skill.lambda();