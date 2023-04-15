import { useRef, useEffect } from "react"
import ChatMessage from "./ChatMessage"

export default function ChatBox({messages}){
    const chatboxRef = useRef(null)

    useEffect(() => {
        // Automatisch nach ganz unten Scrollen nach jeder Nachricht
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }, [messages]);
    return(
        <>
        <div 
        ref={chatboxRef}
        className="bg-bluex-500 h-[100vh] flex flex-col text-center py-5 overflow-y-auto align-middle">
            {messages.map((message, index) => (
            <ChatMessage key={index} data={message}/>
            ))}
        </div>
        </>
    )
}