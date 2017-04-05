const rp = require('request-promise');

/* Old end-point code
const END_POINT = 'https://mqa.avis.com/mobileapi/v2/request';
const SERVICE = 'FindLocationsByKeyword';
*/

function LocationInquiry(location, codesOnly) {
    console.log(location);
    /* Old end-point code
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
    */

    //New end point code starts
    const inlocation = location.split(' ').join('%20')
    const END_POINT = `https://qaservices.carrental.com/mobileapi/qa/v2/locations?keyword=${inlocation}`
    let options = {
        method: 'GET',
        uri: END_POINT,
        json: true,
        headers: {
            'content-type': 'application/json',
            'brand' : 'Avis',
            'clientCountryCode' : 'US',
            'clientType' : 'MOBILEAPP'
        }
    };
    //New end point code ends
    const promise = new Promise((resolve, reject) => {
        console.log("Creating promise");
        rp(options)
        .then((resp) => {
            if (resp.locations && resp.responseInfo.success) {
                let locations = resp.locations;
                //Very ugly temporary fix. API needs to be changed
                if((!locations[0].code) || (!locations[0].name)){
                    locations.shift();
                }
                const loc_len = resp.locations.length > 3 ? 3 : resp.locations.length;
                const suggestions = [];
                for (let i = 0; i < loc_len; i++) {
                    if(codesOnly){
                        if(locations[i].name && locations[i].code){
                            let doc = {}
                            doc.name = locations[i].name;
                            doc.code = locations[i].code;
                            suggestions.push(doc);
                        }
                    }
                    else{
                        if (locations[i].name) {
                            suggestions.push(locations[i].name);
                        }
                        else {
                            suggestions.push(locations[i].code);
                        }
                    }
                }
                console.log(suggestions);
                resolve(suggestions);
            }
            else {
                console.log("No locations");
                console.log(resp);
                reject("Locations not present");
            }
        }, (err) => {
            console.log("Error in location inquiry");
            reject("Some uknown error occured");
        });
    })
    console.log("Returning promise");
    return promise;

}

//LocationInquiry('newark');
module.exports = LocationInquiry;