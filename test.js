const li = require('./location-inquiry');
const va = require('./vehicle-availability');
/*
li('Newark nj')
.then(function(resp){
  console.log(resp);
},function(resp){
  console.log("Main error: " + resp);
})
.catch(function(resp){
  console.log("Main error");
})
*/
va('EWR', "2017-04-07T18:00:00", "2017-04-08T18:00:00")
.then(function(resp){
  console.log(resp);
},function(resp){
  console.log("Main error: " + resp);
})
.catch(function(resp){
  console.log("Main error");
})