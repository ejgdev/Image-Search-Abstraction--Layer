const mongodb = require("mongodb").MongoClient;   
const dbLink =  process.env.MONGODB_URL;

module.exports = (req, res) => {
  handleHistories(req, res);
};

function handleHistories(req, res) {
  mongodb.connect(dbLink,function(err,db){
    if(err){
      console.log("error: Can't connect to the Database"); // shows conection error  
    } 
    else {               
      const urlsdb = db.collection('historial');         // get the table
      urlsdb.find({},{_id:0}).sort({_id:-1}).limit(10).toArray(function(err,historial){
        if(err){
          db.close()
          res.end("error: Can't find data in the Database");
        } 
        else {
          db.close();
          res.json(historial.map(function(arg) {
            return {
              term: arg.term,
              when: arg.when
            };
          }));
        }
      }); 
    }
  });//close mongodb
};
