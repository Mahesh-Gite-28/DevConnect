// import { Outlet } from "react-router-dom"
import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  
  const userdata=useSelector((store)=>store.user);

  const fetchuser = async () => {
    try {
      const user = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(user.data));
    } 
    catch (err) {

      if(err.status==401)
      {
        navigate("/login");
      }

      // console.log(err);//show popup or something //means token is invalid or not present
      
    }
  };

  useEffect(() => {

    if(!userdata)//if data of loggedInUser not present in the reduxstore then call only
    {
      fetchuser();//api calling everytime if not used condition
    } 
    
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;

//when we refresh website -->redux store loose data
//but we still have cookie in the browser
//dont have to login again by using cookie 
