const rp = require('request-promise');
const moment = require('moment');

function VehicleAvailability(location, fromDate, toDate){
    const END_POINT = `https://qaservices.carrental.com/mobileapi/qa/v2/reservation/vehicles`
    let request = {
        "reservationDetails": {
            "pickupLocationCode": "EWR",
            "returnLocationCode": "EWR",
            "pickupDateTime": "2017-04-07T18:00:00",
            "returnDateTime": "2017-04-08T18:00:00",
            "age": "25",
            "countryCodeOfResidence": "US",
            "vehicleTypesOffered": "PASSENGER"
            },
        "requestHeader": {
            "useMockResponse": false,
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
        }
    }
    let options = {
        method: 'POST',
        uri: END_POINT,
        json: true,
        headers: {
            'content-type': 'application/json',
            'service' : 'findVehiclesToBook'
        },
        body : request

    };

    //setup parameters
    request.reservationDetails.pickupLocationCode = location;
    request.reservationDetails.returnLocationCode = location;

    fromDate = moment(fromDate).format().slice(0,10);
    request.reservationDetails.pickupDateTime = fromDate + "T10:00:00";
    if(!toDate){
        toDate = moment(fromDate).add(1,'d').format().slice(0,10);
    }
    request.reservationDetails.returnDateTime = toDate + "T10:00:00";
    console.log(request);

    const promise = new Promise((resolve, reject)=>{
        rp(options)
        .then((resp)=>{
            console.log(resp);
            let available_vehicles = [];
            if(resp.responseInfo.success && resp.vehicleList.length > 0){
                for (each_vehicle_category of resp.vehicleList){
                    if(each_vehicle_category.vehicles.length > 0){
                        let vehicles = each_vehicle_category.vehicles;
                        for (vehicle of vehicles){
                            let doc = {};
                            doc.name = vehicle.basicDetails.name;
                            doc.amount = vehicle.payLaterRateInfo.amount;
                            available_vehicles.push(doc);
                        }
                    }
                }
                console.log("Available vehicles resolved");
                resolve(available_vehicles);
            }
            else{
                console.log("Available vehicles rejected");
                reject(resp.responseInfo.errorMessage);
            }
        },(err)=>{
            console.log("Available vehicles rejected under catch");
            reject("Some unknown error occured");
        })
    })

    return promise;    

}

module.exports = VehicleAvailability;