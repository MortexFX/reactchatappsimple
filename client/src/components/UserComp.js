export default function UserComp({props}){
    return(
        <>
        <h1 className="text-3xl text-black-500 underline">{props.username}</h1>
        <img className="h-[150px]" src={props.avatar} alt="" />
        </>
    )
}