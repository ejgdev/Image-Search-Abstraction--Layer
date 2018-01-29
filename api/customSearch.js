const GoogleImages = require('google-images');
const apiKey = process.env.API_KEY;
const cseId = process.env.CSE_ID;
const client = new GoogleImages(cseId, apiKey);
const mongodb = require("mongodb").MongoClient;   
const dbLink =  process.env.MONGODB_URL;

module.exports = (req, res) => {
  handleGet(req, res);
};

//function that Handles a search query
function handleGet(req, res) {
  const page = req.query.offset ? req.query.offset : 1 //Default: 1... E.g. page 1 has the first 10 results, page 2 has the next set of 10, etc.
  const imgSearch = req.params.query;
  const date =new Date().toLocaleString();
  const historial = {
      "term": imgSearch,
      "when": date
    };
   if (imgSearch !== 'favicon.ico') {
     saveHistorial(historial);
   }
    
  client.search(imgSearch, {page: page})
    .then(images => {
      if(images.length>0){
        res.json(images.map(formatList));  //send each image with format {url, snippet, thumbnail, context}
      }
      else {
        res.json('An error has ocurred. Please try again.'); // This happens when if images =< 0
      }
    });
};

//function that Saves the queries with dates
function saveHistorial(historial){
  mongodb.connect(dbLink,function(err,db){
    if(err){
      console.log("error: Can't connect to the Database"); // shows conection error  
    } 
    else {               
       const urlsdb = db.collection('historial');         // get the table
       urlsdb.insert([historial],function(){ //Here insert the data
         db.close();       // close the database
       });//close insert
    }
  });//close mongodb
};

//Function that make a format with each result
function formatList(image) {
    return {
      "url": image.url,
      "snippet": image.description,
      "thumbnail": image.thumbnail.url,
      "context": image.parentPage
    };
  };