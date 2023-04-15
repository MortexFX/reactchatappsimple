import { useState } from "react";

export default function ChatBox({ onMessageChange, onFormSubmit}){

    const [message, setMessage] = useState("");
    
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
          handleSubmit(e);
        }
      };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onMessageChange(message);
      onFormSubmit()
      setMessage("")
    };

    const handleChange = (message) => {
        setMessage(message)
        onMessageChange(message)
    }

    return(
        <>
        <div className="flex flex-col mt-auto">
            <div className="flex justify-center py-2 font-mono text-lg font-normal select-none">
                <h1 className={message.length > 80 ? "text-red-500" : "text-black"}>{message.length} / 80</h1>
            </div>
            <div className="flex flex-row mt-auto shadow-lg shadow-top">
                <form className="flex flex-row bg-redx-500 w-[100vw]" onSubmit={handleSubmit}>
                  <input value={message} onChange={(e) => handleChange(e.target.value)} onKeyDown={handleKeyDown} onSubmit={handleSubmit} type="text" className="bg-gray-100 h-[5.5rem] px-5 w-full border-0 outline-none" />
                  <button type="submit" className="bg-blue-400 w-[8em] font-semibold font-mono text-xl" onClick={handleSubmit} >Send</button>
                </form>
            </div>
        </div>
        </>
    )
}