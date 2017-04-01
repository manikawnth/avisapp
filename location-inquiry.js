const rp = require('request-promise');

const END_POINT = 'https://mqa.avis.com/mobileapi/v2/request';
const SERVICE = 'FindLocationsByKeyword';

function LocationInquiry(location){

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
        "vehicleTypesOffered":"PASSENGER"
    }
    
    request['keyword'] = location;

    let options = {
        method: 'POST',
        uri: END_POINT,
        body: request,
        json : true,
        headers : {
            'content-type' : 'application/json',
            'Service' : 'FindLocationsByKeyword'
        }
    };
    
    return rp(options)
    .then(function(resp){
        console.log("came from api");
        const promise = new Promise(function(resolve,reject){
            if(resp.locations){
                const locations = resp.locations;
                const loc_len = resp.locations.length > 3 ? 3 : resp.locations.length;
                const suggestions = [];
                for (let i=0; i<loc_len; i++){
                    if (locations[i].name){
                        suggestions.push(locations[i].name);
                    }
                    else{
                        suggestions.push(locations[i].code);
                    }
                }
                console.log(suggestions);
                resolve(suggestions);
            }
            else{
                reject("Something wrong");
            }
        });
        console.log("came from api sending promise");
        return promise;
    })
    .catch(function(err){
        throw err;
    })

}

//LocationInquiry('newark');
module.exports = LocationInquiry;