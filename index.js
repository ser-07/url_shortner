require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

//Adding body parser config:
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//storage
let resMap = new Map();

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res)=>{
  // console.log("Here", req.body.url);
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
