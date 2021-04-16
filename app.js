const express=require("express");
const app=express();
const request=require("request");
const bodyParser=require("body-parser");
const https=require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
    var fname=req.body.firstName;
    var lname=req.body.lastName;
    var eml=req.body.email;
    console.log(fname);
    console.log(lname);
    console.log(eml);

    var data={
        members:[
            {
                email_address: eml,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };
    var jsonData=JSON.stringify(data);
     const url="https://us1.api.mailchimp.com/3.0/lists/352cdaadba";
     const options={
         method:"POST",
         auth:"intruder:60627e0d1721159fd4ee04c5ebf9395b-us1"
     }

    const request=https.request(url, options, function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        console.log(response.status);
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
        
    });
    request.write(jsonData);
    request.end();

});
app.post("/failure",function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT||3000,function(){
    console.log("The server is running on port 3000");
})
//API KEY Mailchimp 60627e0d1721159fd4ee04c5ebf9395b-us1
//LIST ID:352cdaadba