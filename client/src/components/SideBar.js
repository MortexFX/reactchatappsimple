
import ActiveUser from "./ActiveUser"

export default function SideBar({userList, user}){

    function getUserCount(){
      let found = false;
      userList.map((current, index) => {
        if(current.name == user.name){
          found = true
        }
      })

      return found ? userList.length : userList.length + 1;
    }

    return (
        <>
        <div className="sidebar fixed bg-greenx-500 h-[100vh] w-[16%] flex flex-col shadow-2xl shadow-left">
          <div className="text-center py-8 font-mono select-none">
          <h1 className="text-[32px] font-semibold">Nutzer ({getUserCount()})</h1>
          </div>
          <div className="users bg-yellowx-500 flex flex-col justify-center align-middle">
          <ActiveUser user={user} extra=""/>
            {userList.map((current, index) => (
             current.name == user.name ? "" : <ActiveUser user={current} extra={""}/> 
            ))}
          </div>
        </div>
        </>
    )
}