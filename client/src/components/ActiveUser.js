export default function ActiveUser({user, extra}){
    return(
        <>
        <div className={`bg-rgb-255-210-20 mx-6 rounded-md h-[60px] flex flex-row  shadow-xl select-none px-2 mb-5`}>
            <img className="h-[60px] align-baseline" src={user.avatar} alt={user.name}  />
            <h1 style={{color: `rgb(${user.color[0]}, ${user.color[1]}, ${user.color[2]})`}} className="text-xl text-white font-mono bg-redx-500 h-[24px] my-auto ml-2">{user.name} {extra}</h1>
        </div>
        </>
    )
}