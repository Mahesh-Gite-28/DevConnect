import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";


const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const handleLogout=async ()=>{
    try{
      await axios.post(BASE_URL+"/logout",{},{withCredentials:true});
      dispatch(removeUser());
      return navigate("/login");

    }catch(err)
    {
      console.log(err);//handlelogout --->pop out something 
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-md px-6">

      {/* Left - Logo */}
      <div className="flex-1">
        <Link className="text-2xl font-bold tracking-wide" to={"/feed"}>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DevTinder
          </span>
        </Link>
      </div>

      {/* Right - Profile */}
      <div className="flex items-center gap-4">
        <div className="dropdown dropdown-end">

          <div className="flex items-center gap-3">

            {user && (
              <p className="text-sm font-medium whitespace-nowrap">
                👋 Welcome, {user.firstName}
              </p>
            )}

            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
            >
              {user && (
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt="profile"
                    src={user.photoUrl}
                  />
                </div>
              )}
            </div>

          </div>

          {/* Dropdown Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 w-52 rounded-xl bg-base-100 p-2 shadow-lg"
          >
            <li>
              <Link className="justify-between" to={"/profile"}>
                Profile
                <span className="badge badge-primary badge-sm">New</span>
              </Link>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li >
              <button className="text-error font-medium" onClick={handleLogout}>Logout</button>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
