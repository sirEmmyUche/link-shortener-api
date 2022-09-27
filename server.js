import express from 'express';
import bodyParser from 'body-parser';
import shortUrl from "node-url-shortener";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from 'knex';
import pg from 'pg';

const app = express();
app.use(cors());

app.use(bodyParser.json());

//connecting to postgres databse using knex package

const db = knex({
    client: 'pg',
    version: '7.2',
    connection: {
      host : '127.0.0.1',
      port : '5432',
      user : 'postgres',
      password : 'uche',
      database : 'shorten'
    }
  });



//shorten long url

app.post('/shorten', async(req, res)=>{
    const {longUrl} = req.body;
    if(longUrl === '' || !longUrl){
        return res.status(400).json('Input link is empty')
    } else{
        await shortUrl.short(longUrl, (err, url)=>{
            if(err){
                throw 'Error creating short url'
            } else{
                res.status(200).json({
                    longLink: longUrl,
                    shortLink: url,
                    date: new Date(),
                })
            }
        })
    }
//code block outside the short method
});


//login a user

app.post('/login', (req, res)=>{
    if(req.body.email === userDataBase.users[0].email &&
       req.body.password === userDataBase.users[0].password){
        res.status(200).json('Login Successful');
    }else{
        res.status(404).json('Login Failed')
    }
});

// registering a user

app.post('/signup', async(req, res)=>{
        const { firstName, lastName, password, email} = req.body;
        db('users')
        .returning('*')
        .insert({
            firstName: firstName,
            lastName: lastName,
            email: email,
            registered : new Date()
        }).then(user=>{ res.json(user[0])})
        .catch(err => console.log(err))  
});


app.get('/profile/:id', (req, res)=>{
    const {id} = req.params;
    let userFound = false;
    userDataBase.users.forEach(user=>{
        if (user.id === id){
            userFound = true;
            return res.status(200).json(user)
        }
         if(!userFound){ 
            return res.status(404).json('user not found')
        };
    })
});
    
app.listen(process.env.PORT || 3000, ()=>{
    console.log(`it's working on ${process.env.PORT}`)
}); 


// 1. work on storing users password info with hashes
//2. work on login users by returning the profile of the users.

            // Store hash in your password DB.
// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
     //console.log(hash)
// });

        // Load hash from your password DB.
//bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
//});
//bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
//});