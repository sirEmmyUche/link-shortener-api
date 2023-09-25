import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import mongoose from "mongoose";
import { nanoid } from 'nanoid'


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://admin-emmanuel:uche@cluster0.hexan43.mongodb.net/linkShorternerUserDB',
{useNewUrlParser:true})
.then(()=>console.log("connected to DB"))
.catch(err=>console.log(err));

const shortlySchema = new mongoose.Schema({
    longUrl:{
        type:String,
        required:[true, "Please provide a long Url"]
    },
    shortId:{
        type:String,
        unique: [true, "ShortId already exist"]
    },
    createdAT:{
        type:Date
    }
    
});

const Shortly = mongoose.model("Shortly", shortlySchema);


//check url
const validateUrl = (url)=>{
    try{
       let link = new URL(url);
        if(link){
            return true
        } 
    }catch(err){
        console.log(err)
        return false
    }
}


//shorten long url
app.post('/shorten', async (req, res, next) => {
  const { longUrl } = req.body;
  try{
    if (longUrl === '') {
      return res.status(400).json({ message: 'Input link is empty', status: 400 });
    }
    const checkUrl = validateUrl(longUrl);
    if (checkUrl === false) {
      return res.status(400).json({ message: 'Invalid URL', status: 400 });
    } else {
      const shortId = nanoid(5);
      const shortUrl = `https://shortit-etr8.onrender.com/${shortId}`;
      const saveURL = new Shortly({
        longUrl: longUrl,
        shortId: shortId,
        createdAt: new Date(),
      });
      await saveURL.save();
      let result = {
        id: saveURL._id,
        shortId: shortId,
        longUrl: longUrl,
        shortUrl: shortUrl,
        status: 200,
      };
      return res.status(200).json(result);
    }
  }catch(err){
    console.log(err)
    return res.status(500).json({message:"Internal Server Error"})
  }
  next();
});


app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  try {
    const record = await Shortly.findOne({ shortId });
    if (record) {
      // Check if the long URL is valid
      if (!validateUrl(record.longUrl)) {
        return res.status(400).json({ message: 'Invalid long URL' });
      }
      // Redirect to the long URL
      res.status(301).redirect(record.longUrl);
    } else {
      return res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.listen(PORT, ()=>{
    console.log(`it's working on port ${PORT}`)
}); 


