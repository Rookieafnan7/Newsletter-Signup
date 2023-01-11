require("dotenv").config();
const express = require("express");
const https = require("https");

const bodyParser = require("body-parser");
// const request = require("request");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/",function(req,res){
    // console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    var data = {
        members:[{
            email_address : email,
            status : "subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }
        }]
    }

    var jsonData = JSON.stringify(data);
    var url = " https://us18.api.mailchimp.com/3.0/lists/0d5d2bc53f";
    
    var options = {
        method: "POST",
        auth: `Afnan:${process.env.API_KEY}`
    }
    var request = https.request(url,options,(response) => {
        response.on("data",function(data){
            // console.log(response.statusCode);
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname + "/failure.html");
            }
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
    // res.send("Values Recieved");
    //  run();
})

app.post("/failure",(req,res) => {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
})


