import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import mongoose from "mongoose";


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

const char_set = 'abcdefghijlkmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function max_random_number(max) {
  return Math.floor(Math.random() * max);
}
function get_random_string(length) {
  let random_string = '';
  for(let i = 0; i < length; i++) {
    random_string += char_set[max_random_number(char_set.length - 1)];
  }
  
  return random_string;
}

let value = 5;
const uniqueID = get_random_string(value)

//shorten long url

app.post('/shorten', async(req, res)=>{
    const {longUrl} = req.body;
    if(longUrl === ''){
        return res.status(400).json({message:'Input link is empty'})
    } 
    const checkUrl = validateUrl(longUrl);
    if(checkUrl === false){
        return res.status(400).json({message:"Invalid URL"});
    }else{
        let doesUrlExistInDB = await Shortly.findOne({longUrl:longUrl});
        if(doesUrlExistInDB === null){
            let saveURL = new Shortly({
            longUrl:longUrl,
            shortId: `short.ly/${uniqueID}`,
            createdAt: new Date()
        })
        saveURL.save();
        let result = {
            id:saveURL._id,
            id:saveURL.shortId,
            id:saveURL.longUrl,
        }
        console.log(result) 
        return res.status(200).json(result)
        }
    }
});



app.listen(PORT, ()=>{
    console.log(`it's working on port ${PORT}`)
}); 


