import axios from "axios";
import { Helmet } from 'react-helmet';
import {useState, useEffect, useRef} from "react";
import LoadingScreen from "./components/LoadingScreen";
import UserComp from "./components/UserComp";
import ActiveUser from "./components/ActiveUser";
import io from "socket.io-client";
import ChatInput from "./components/ChatInput";
import ChatBox from "./components/ChatBox";
import SideBar from "./components/SideBar";
  

const apiPort = 4000
const serverDomain = "localhost"

const socket = io(`http://${serverDomain}:5000`)

function App() {

  const [user, setUser] = useState({})
  const [connectedUsers, setConnectedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [allMessages, setAllMessages] = useState([])
  
  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const heute = new Date();
  let hours = heute.getHours().toString().padStart(2, '0');
  let minutes = heute.getMinutes().toString().padStart(2, '0');
  let time = `${hours}:${minutes}`;
  async function createToken(){
    let res = await axios.get(`http://${serverDomain}:${apiPort}/api/newtoken`, {withCredentials: true})
    //console.log(res.data)
    return res.data
  }

  async function validateToken(token){
    let res = await axios.get(`http://${serverDomain}:${apiPort}/api/decode?token=${token}`)
    //console.log(res)
    return res
  }

  async function getToken(){
    let res = await axios.get(`http://${serverDomain}:${apiPort}/api/cookies`, {withCredentials: true,})
    //console.log(res.data.token)
    return res.data.token
  }
  
  async function getConnectedUsers(){
    let res = await axios.get(`http://${serverDomain}:${apiPort}/api/connected`, {withCredentials: true,})
    //console.log(res.data.token)
    setConnectedUsers(res.data)
  }

  async function checkToken(){
    let token = await getToken()
    //console.log(token)
    if(token){
      // token existiert
      
      let validate = await validateToken(token)

      //console.log(validate)
      if(validate.data.valid){
        // token ist valid
        console.log("token ist valid")
        //console.log(validate.data)

        setUser(validate.data.data)
        
        await sleep(500)
        setLoading(false)
        
        validate.data.data.socketid = socket.id

        socket.emit('join', validate.data.data);
      }else{
        // token ist ungültig
        console.log("Token ist ungültig")
      
      let newtoken = await createToken()
      if(!newtoken.error){
        await checkToken()
      }
      }
    }else{
      // token existiert nicht
      console.log("Token exisitert nicht")
      
      let newtoken = await createToken()
      if(!newtoken.error){
        await checkToken()
      }
    }
  } 

  async function getNewUser(){
    setLoading(true)
    let newtoken = await createToken()
      if(!newtoken.error){
        await checkToken()
      }
  }

  useEffect(() => {
    checkToken()
    getConnectedUsers()
  }, [])

  useEffect(() => {
    socket.on('message', (data) => {
      // filter messages by user
      console.log(`Message from ${data.user.name}: ${data.message}`);
      setAllMessages(prevMessages => [...prevMessages, { user: data.user, message: data.message, time: data.time }]);
      console.log(allMessages)
    });

    socket.on("connectedList", (data) => {
      setConnectedUsers(data)
    })
    
    // Remove event listener when component unmounts
    return () => {
      socket.off('message');
      socket.off('join');
    };
  }, [])

  const handleMessageChange = (newMessage) => {
    setMessage(newMessage);
  };

  const handleFormSubmit = () => {
    //console.log("form submitted with message " + message)
    //console.log(socket.id)
    if(!(message.length > 80) && message.length > 0){
      socket.emit("message", {message, user})
      setAllMessages(prevMessages => [...prevMessages, { user: user, message: message, time: time }]);
    }
  }

  return (
    <>
    <Helmet>
      <title>Chat App</title>
    </Helmet>
    {loading ? <LoadingScreen/> :
    <div>
      <div className="bg-redx-500 mx-auto h-[100vh] flex flex-col">
        <SideBar userList={connectedUsers} user={user}/>
        
        <div className="bg-redx-500 h-[100vh] w-[84%] ml-auto flex flex-col flex-grow">
          <ChatBox messages={allMessages}/>
          <ChatInput
           onMessageChange={handleMessageChange}
           onFormSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>}
    </>
  );
}

export default App;
