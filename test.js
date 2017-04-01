const li = require('./location-inquiry');

li('Newark nj')
.then(function(resp){
  console.log(resp);
},function(resp){
  console.log("Main error: " + resp);
})
.catch(function(resp){
  console.log("Main error");
})