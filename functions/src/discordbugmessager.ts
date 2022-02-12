import * as functions from "firebase-functions"
import {initializeApp} from "firebase-admin";
import {discord_bot_token} from "../../src/firebase/credentials.js";
const token = discord_bot_token;
const Discord = require('discord.js');
const client = new Discord.Client();
let send_message="";
let username="";
let userid="";

client.on('ready', () => {
    client.channels.find(x => x.name === 'bug_report').send(`user_id:${userid}\n user_name:${username}\n text:`+"```"+ send_message +"```");
   // Client.user.setGame(`The Cult | ${Client.guilds.size} servers`)
    //Console.log('test')
});


/*
exports.app = functions.https.onRequest((request, response) => {
    response.send("Test"); 
    
});*/

export default (async (doc:functions.firestore.DocumentSnapshot,res:any)=>  {
    initializeApp(functions.config().firebase);
   // let id = doc.id;
   client.login(token);
    send_message= doc?.data()?.text;
    username=doc?.data()?.user_name;
    userid=doc?.data()?.userid;
    return;
  })