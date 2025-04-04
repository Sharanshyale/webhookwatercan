const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express().use(bodyParser.json());
 app.listen(process.env.PORT || 3000);

 const token=process.env.TOKEN;
 const mytoken=process.env.MYTOKEN;
 app.get('/webhook', (req, res) => {
     let challenge =req.query['hub.challenge'];
     let mode = req.query['hub.mode'];
     let token =req.query['hub.verify_token'];

     if(mode && token){
         if(mode === 'subscribe' && token === mytoken){
             res.status(200).send(challenge);
         }else{
             res.sendStatus(403);
         }
     }
 });

 app.post("/webhook", (req, res) => {
    // i want some
    let body_param = req.body; // (Assuming you assigned req.body to body_param)
  
    console.log(JSON.stringify(body_param, null, 2));
  
    if (body_param.object) {
      if (
        body_param.entry &&
        body_param.entry[0] &&
        body_param.entry[0].changes &&
        body_param.entry[0].changes[0].value.message
      ) {
        let ph_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body_param.entry[0].changes[0].value.messages[0].from;
        let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

        axios({
          method: "post",
          url: "https://graph.facebook.com/v22.0/" + ph_no_id + "/messages?access_token=" + token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: {
              body: msg_body
            }
          },
          headers: {
            "Content-Type": "application/json",
      }
    });
    res.sendStatus(200);
      }else{
        res.sendStatus(404);
      }
    }
  });

  