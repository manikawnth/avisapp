const rp = require('request-promise');


const SERVICE = 'FindLocationsByKeyword';

function LocationInquiry(inlocation){
    const location = inlocation.split(' ').join('%20')
    const END_POINT = `https://www.avis.com/webapi/v1/locations/suggestions/${location}/en_US`;


    let options = {
        method: 'GET',
        uri: END_POINT,
        headers : {
            "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        }
    };
    
    return rp(options)
    .then(function(resp){
        console.log("came from api");
        
        const promise = new Promise(function(resolve,reject){
            resp = JSON.parse(resp);
            if(resp.suggestions){
                console.log("inside resolve");
                const locations = resp.suggestions;
                const loc_len = resp.suggestions.length > 3 ? 3 : resp.suggestions.length;
                const suggestions = [];
                for (let i=0; i<loc_len; i++){
                    if (locations[i].suggDescription){
                        suggestions.push(locations[i].suggDescription);
                    }
                }
                console.log(suggestions);
                resolve(suggestions);
            }
            else{
                console.log("inside reject");
                reject("Something wrong");
            }
        });
        return promise;
    })
    .catch(function(err){
        throw err;
    })
    

}

//LocationInquiry('newark nj');
module.exports = LocationInquiry;