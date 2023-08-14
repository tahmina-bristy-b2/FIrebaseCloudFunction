const functions = require("firebase-functions");
const admin =require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const express = require("express");
const cors = require("cors");
const { error } = require("firebase-functions/logger");

const app = express();
app.use(cors());
const db= admin.firestore();

// Define your routes and functions
//=====================================get Data
app.get("/", (req, res) => {
  res.status(200).send("Bristy");
});
//=====================================post data Api
app.post("/api/create",(req, res) => {
    (async()=>{
        try{
            await db.collection("userInfo").doc(`/${Date.now()}/`).create(
                {
                    id:Date.now(),
                    name: req.body.name,
                    mobile: req.body.mobile,
                    password: req.body.password,
                }

            );
            return res.status(200).send({
                status: "Success",
                res_str: "Data is saved"
            });

            
        }
        catch(error){
            console.log(error)
            return res.status(400).send({
                status: "Failed",
                res_str: error
            });

        }

    })();
  });

//=====================================End post Data
//=====================================fetch spacific data\
app.get("/api/get/:id",(req,res)=>{
    (async()=>{
        try{
            const reqId= req.params.id;
            const reqDoc =db.collection("userInfo").doc(reqId);
            let userInfo= await reqDoc.get();
            let response= userInfo.data();
            if(response==null){
                res.status(200)
                res.send({status:"failed"})
            }
            else{
                res.status(200)
                res.send({
                    status:"Success",
                    res:response,
                })
            }   
        }
        catch(error){
            console.log(error)
            return res.status(500).send({
                status: "Failed",
                res_str: error
            });
         }
    })();
});

//=====================Get All
app.get("/api/getAll",(req,res)=>{
    (async()=>{
        try{
            const userInfo= db.collection("userInfo");
            let response=[];
            await  userInfo.get().then((data)=>{
                let data1= data.docs;
                data1.map((doc)=>
               {
                const singleInfo= {
                    id: doc.data().id,
                    name: doc.data().name,
                    mobile: doc.data().mobile,
                    password: doc.data().password,
                }
                response.push(singleInfo);
               }
            );
            return response;
          

            });
            if(response!=null){
                res.status(200),
                res.send({
                    status:"Success",
                    data: response       
                })
            }    
        }
        catch(error){
            console.log(error)
            return res.status(500).send({
                status: "Failed",
                res_str: error
            });
        }
    })();
});




//=========================update
app.put("/api/update/:id",(req,res)=>{
    (async()=>{
        try{
            const userInfo= db.collection("userInfo").doc(req.params.id);
            await userInfo.update({
                name:req.body.name,
                mobile:req.body.mobile,
                password:req.body.password,
            });
            res.status(200);
            res.send({
                status:"Suncessfully Updated"
            });


        }
        catch(e){
            console.log(e);
            return res.status(500).send({
                status:"Internal Server Error"
            });
        }
  })();

});



//=====================================delete
app.delete("/api/singledelete/:id",(req,res)=>{
    (async()=>{
        try{
            const reqID= req.params.id;
            await db.collection("userInfo").doc(reqID).delete();
            res.status(200);
            res.send({
                status: "Success",

            })
    
        }
        catch(error){
            console.log(error)
            return res.status(500).send({
                status: "Internal Server Error",
               
            });

        }

    })();
});


// Export the Express app as a Firebase Cloud Function
exports.myFunction = functions.https.onRequest(app);

