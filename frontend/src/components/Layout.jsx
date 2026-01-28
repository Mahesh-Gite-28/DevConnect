// import { Outlet } from "react-router-dom"
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useSelector } from "react-redux";

const Layout = () => {
  const dispatch = useDispatch();
  
  const userdata=useSelector((store)=>store.user);

  const fetchuser = async () => {
    try {
      const user = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(user.data));
    } 
    catch (err) {
      console.log(err);
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

