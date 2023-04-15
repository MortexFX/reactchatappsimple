const express = require("express");
const http = require("http");
const jwt = require('jsonwebtoken');
const axios = require("axios")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");

const serverDomain = "localhost"
const server = http.createServer(app);
const jtwsecret = 'reactjs';
const PORT = 4000;
const heute = new Date();

app.use(
    cors({
      origin: [`http://${serverDomain}:3000`],
      credentials: true,
    })
  );

app.get("/api/connected", (req, res) => {
  //res.header("Access-Control-Allow-Origin", "*");
  res.send(connectedUsers)
  
})


function generateRandomString() {
    const length = 5;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

async function getNewUserName(){
    try{
        let res = await axios.get("https://names.drycodes.com/1?nameOptions=boy_names&separator=space")
        let fullname = res.data[0]
        //console.log(fullname)
        return fullname.split(" ")[0]
    }catch(err){
        //console.log(err)
        return generateRandomString()
    }
}


function getRandomColor(){
    const colorfulColors = [
        [255, 99, 71], // tomato
        [255, 215, 0], // gold
        [0, 255, 127], // spring green
        [0, 191, 255], // deep sky blue
        [138, 43, 226], // blue violet
        [255, 165, 0], // orange
        [128, 0, 128], // purple
        [255, 20, 147], // deep pink
        [0, 250, 154], // medium spring green
        [30, 144, 255], // dodger blue
      ];
    const randomIndex = Math.floor(Math.random() * colorfulColors.length);
    return colorfulColors[randomIndex];
}

app.get("/api/test", async (req, res) => {
    let x = await createToken()
    res.send(x)
})

async function createToken() {
    let username = await getNewUserName()
    const payload = {
      data: {
          name: username,
          avatar: `https://api.dicebear.com/5.x/adventurer/svg?seed=${username}`,
          color: getRandomColor()

      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // Token 1 Stunde gültig
    };
    const token = jwt.sign(payload, jtwsecret);
    return token;
}

function decodeToken(token) {
  try{
    const decoded = jwt.verify(token, jtwsecret);
    return {data: decoded.data, error: false};
  }catch(err){
    //console.log(err)
    return {error: true}
  }
}


app.get("/api/cookies", cookieParser("mysecret"), (req, res) => {
    //console.log(req.signedCookies)
    res.send(req.signedCookies)
    
})

app.get("/api/decode", async (req, res) => {
    let token = req.query.token
    if(token){
        let decoded = await decodeToken(token)

        if(decoded.error){
            res.json({valid: false})
            return
        }

        res.json({data: decoded.data, valid: true})
    }else{
        res.json({error: "No token"})
        return
    }
})


app.get("/api/newtoken", cookieParser("mysecret"), async(req, res) => {
    let newtoken = await createToken();
    //console.log(newtoken)

    try{
        //console.log("sending cookie")
        res.cookie("token", newtoken, {
            domain: serverDomain,
            httpOnly: true,
            signed: true,
            secure: true,
        })

        res.json({error: false})


    }catch(err){
        //console.log(err)
        res.json({error: true})
    }
}) 

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let connectedUsers = []

function addConnectedUser(data){
  console.log(data)
  for(let i = 0; i < connectedUsers.length; i++){
    let connected = connectedUsers[i]


    //socketid already exists
    if(connected.socketid == data.socketid){
      console.log("Socketid already existed")
      removeConnectedSocket(data.socketid)
    }

    if(connected.name == data.name){
      console.log("Name already existed")
      removeConnectedName(data.name)
    }
  }

  console.log(`Added ${data.name} with ${data.socketid}`)
  connectedUsers.push(data)

}

function removeConnectedName(name){
  for(let i = 0; i < connectedUsers.length; i++){
    let connected = connectedUsers[i]

    if(connected.name == name){
      connectedUsers.splice(i, 1);
    }
  }
}

function removeConnectedSocket(socketid){
  for(let i = 0; i < connectedUsers.length; i++){
    let connected = connectedUsers[i]

    if(connected.socketid == socketid){
      connectedUsers.splice(i, 1);
    }
  }
}

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`);

  socket.on("join", (data) => {
    console.log("New user joined")
    //console.log(data)
    addConnectedUser(data)
    //console.log(connectedUsers)
    let active = io.engine.clientsCount
    socket.broadcast.emit("connectedList", connectedUsers)
  })

  // listen for incoming messages from the client
  socket.on("message", (data) => {
    console.log(`${socket.id}| Received message from ${data.user.name} : ${data.message}`);
    // send a message to all connected clients except the sender
    let hours = heute.getHours().toString().padStart(2, '0');
    let minutes = heute.getMinutes().toString().padStart(2, '0');
    let time = `${hours}:${minutes}`;
    console.log(time)
    socket.broadcast.emit("message", {user: data.user, message: data.message, time: time});
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected ${socket.id}`);

    removeConnectedSocket(socket.id)

    console.log(`Removed ${socket.id}`)
    console.log(connectedUsers)

    socket.broadcast.emit("connectedList", connectedUsers)
  });

});

app.listen(PORT, () => console.log(`API running on Port ${PORT}`))

server.listen(5000, () => console.log(`Socket.io running on Port 5000`))