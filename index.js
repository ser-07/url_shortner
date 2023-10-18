require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var path = require("path");

//Adding body parser config:
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
console.log("Process CWD", process.cwd());
// app.use("/public", express.static(`${process.cwd()}/public`)); //#1
//Removing process.cwd before uploading to vercel. Comment line #2 and uncomment #1 if running in local
app.use("/public", express.static(path.join(process.cwd(),"public"))); //#2

//storage
let resMap = new Map();

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

app.get("/", function (req, res) {
  // res.sendFile(process.cwd() + "/views/index.html");
  res.sendFile(path.join(process.cwd(), "/views/index.html"));
});

// adding test routes to check vercel compatibility:

// app.get("/vercel1", function (req, res) {
//   res.sendFile("/views/index.html");
// });

// app.get("/vercel2", function (req, res) {
//   res.sendFile(path.join(process.cwd(), "/views/index.html"));
// });




// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res)=>{
  // console.log("Here", req.body.url);
  if (!isValidUrl(req.body.url)) return res.json({ error: "invalid url" });
  
  if(resMap.size === 0){
    resMap.set(req.body.url, resMap.size+1);
  }
  else if(resMap.get(req.body.url) === undefined)
  {resMap.set(req.body.url, resMap.size+1)}
  res.json({"original_url":req.body.url,"short_url":resMap.get(req.body.url)});

});

app.get('/api/shorturl/:id', (req, res)=> {
  console.log(req.params.id);
  let url = '';
  for(let item of resMap){
    console.log(item);
    if(item[1]==req.params.id) url = item[0];
  }
  if(url!=='')
  res.redirect(url);
else res.json({ error: 'invalid url' });
  // res.redirect('https://app.example.io');
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
