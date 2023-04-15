export default function ChatMessage({data}){

    return(
        <div className="shadow-lg rounded-lg flex flex-row p-4 py-6 h-auto] min-w-[320px] w-[40%] max-w-[500px] mx-auto my-1">
            <img src={data.user.avatar} className="h-[65px]" alt="" />
            <div className="flex flex-col ml-5 bg-greenx-500 w-full">
                <div style={{ color: `rgb(${data.user.color[0]}, ${data.user.color[1]}, ${data.user.color[2]})` }}
                 className="bg-bluex-500 flex justify-between ">
                    <h1 className="">
                        {data.user.name}
                    </h1>
                    <h1 className="">
                        {data.time}
                    </h1>
                </div>
                <h1 className="text-start mt-2">{data.message}</h1>
            </div>
        </div>
    )
}