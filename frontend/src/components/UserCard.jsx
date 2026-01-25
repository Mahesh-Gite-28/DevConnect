import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeonefeed } from "../utils/feedSlice";

const UserCard = ({ data }) => {

  console.log(data);
  
  const { firstName, lastName, photoUrl, about, skills, gender, age ,_id} = data;
  const dispatch=useDispatch();

  const handleRequest=async (status,_id)=>{
    try{

      await axios.post(BASE_URL+"/request/send/"+status+"/"+_id,{},{withCredentials:true});
      dispatch(removeonefeed(_id));

    }catch(err)
    {
      console.log(err);
    }
  }

  return (
    <div className="flex justify-center my-40">
      <div className="card bg-base-300 w-96 shadow-sm ">
        <figure>
          <img src={photoUrl} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {(age||gender)&&<div>
            <h3>Basic Info</h3>
            <p>{age}</p>
            <p>{gender}</p>
          </div>}
          <div>
            <h3>About</h3>
            <p>{about}</p>
          </div>
         
             {skills.length > 0 && (
            <div>
              <h3>Skills</h3>
              {skills.map((skill, index) => (
                <p key={index}>{skill}</p>
              ))}
            </div>
          )}



          <div className="card-actions justify-center my-4">
            <button className="btn btn-primary" onClick={()=>handleRequest("ignored",_id)}>Ignore</button>
            <button className="btn btn-secondary" onClick={()=>handleRequest("interested",_id)}>Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
