import Editprofile from "./Editprofile"
import { useSelector } from "react-redux";
import AIChatbot from "./AIChatbot";

const Profile = () => {
  const user=useSelector((store)=>store.user);
  return (
    <>
    <div className="flex justify-around pt-5 pb-52">
      <Editprofile user={user}/>
    </div>
     <AIChatbot />
     </>
  )
}


export default Profile