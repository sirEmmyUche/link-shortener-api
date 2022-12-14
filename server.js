import express from 'express';
import bodyParser from 'body-parser';
import shortUrl from "node-url-shortener";
import bcrypt from "bcrypt";
import cors from "cors";
import mongoose from "mongoose";
// import passport from "passport-google-oauth20";

const app = express();
app.use(cors());

app.use(bodyParser.json());

const saltRounds = 10;

mongoose.connect('mongodb://localhost:27017/linkShorternerUserDB',{useNewUrlParser:true});

const signUpUserSchema = new mongoose.Schema({ 
    firstName: { type:String,
    required:true
},
    lastName:{
        type: String,
        required: true,
    },
    
    email:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true
    },

    registered: {
        type: Date
    }
});

const SignUpUser = mongoose.model("SignUpUser", signUpUserSchema);


//shorten long url

app.post('/shorten', async(req, res)=>{
    const {longUrl} = req.body;
    if(longUrl === '' || !longUrl){
        return res.status(400).json('Input link is empty')
    } else{
        await shortUrl.short(longUrl, (err, url)=>{
            if(err){
                res.status(404).json(err)
            } else{
                res.status(200).json({
                    longLink: longUrl,
                    shortLink: url,
                    date: new Date(),
                })
            }
        })
    }
});


//login a user

app.post('/login', (req, res)=>{
    const {email, password} = req.body;
         SignUpUser.findOne({email:email}, (err, foundUser)=>{
        if(err){
            console.log(err)
        }
        if(!foundUser){
            res.status(404).json("User not found")
        }
        if(foundUser){
          bcrypt.compare(password, foundUser.password,  function(err, result){
            if(err){
                console.log(err)
            }if(result === false){
                res.status(404).json("Incorrect username and password")
            }if(result === true){
                res.status(200).json(foundUser.firstName)
            }
        });
        }
    })
});

// registering a user

app.post('/signup', async(req, res)=>{
     const { firstName, lastName, password, email} = req.body;
     SignUpUser.findOne({email:email}, (err, FoundResult)=>{
        if(err){
            console.log(err)
        }else if(FoundResult){
            res.status(404).json("User already exist")
        }if(!FoundResult){
            bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){
            console.log(err)
        }else{
            const signUpUser = new SignUpUser({
                firstName: firstName,
                lastName: lastName,
                email: email,
                registered: new Date(),
                password: hash 
               });
               signUpUser.save(()=>{
                if(err){
                    console.log(err)
                } else{
                    res.status(200).json("SignUp successful")
                }
            })   
        }  
     });
        }
     })
        
});


 let port =  process.env.PORT;
 if (port === null || port === ""){
     port = 3000;
 }else if (port === undefined){
    port = 3000;
 }  
app.listen(port, ()=>{
    console.log(`it's working on port ${port}`)
}); 

export default app;
