import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { removefeed } from "../utils/feedSlice";
import { removeconnections } from "../utils/connectionSlice";
import { removeRequests } from "../utils/requestSlice";
import toast from "react-hot-toast";

import { Home, User, Users, Inbox, LogOut,Crown } from "lucide-react";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removefeed());
      dispatch(removeconnections());
      dispatch(removeRequests());
      toast.success("Logged out successfully");
      return navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="navbar bg-black border-b border-slate-800 px-6 fixed top-0 z-[1000]">
      <div className="flex-1">
        <Link
          className="flex items-center gap-3 w-fit"
          to={user ? "/feed" : "/login"}
        >
          <div className="avatar">
            <div className="ring-emerald-400 ring-offset-black w-8 rounded-full ring-2 ring-offset-2">
              <img src="/DevLogo.png" alt="DevTinder" />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            Dev<span className="text-emerald-400">Tinder</span>
          </h2>
        </Link>
      </div>

      {/* Right - Profile (ONLY if user exists) */}
      {user && (
        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium whitespace-nowrap text-slate-400 hidden sm:block">
                Welcome,{" "}
                <span className="text-white font-semibold">
                  {user.firstName}
                </span>
              </p>

              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
              >
                <div className="w-10 rounded-full ring ring-emerald-400 ring-offset-black ring-offset-2">
                  <img alt="profile" src={user.photoUrl} />
                </div>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-52 rounded-xl bg-slate-950 p-2 shadow-xl border border-slate-800"
            >
              <li>
                <Link
                  to={"/feed"}
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Home size={16} className="mr-2" />
                  Home
                </Link>
              </li>

              {/* Profile */}
              <li>
                <Link
                  className="justify-between hover:bg-emerald-500 hover:text-black"
                  to={"/profile"}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Profile
                  </div>

                  <span className="badge badge-outline border-emerald-400 text-emerald-400 badge-sm">
                    New
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to={"/connections"}
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Users size={16} className="mr-2" />
                  Connections
                </Link>
              </li>

              <li>
                <Link
                  to={"/requests"}
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Inbox size={16} className="mr-2" />
                  Requests
                </Link>
              </li>

              <li>
                <Link
                  to={"/memberships"}
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Crown size={16} className="mr-2" />
                  Memberships
                </Link>
              </li>

              <li>
                <button
                  className="text-rose-400 font-medium hover:bg-rose-500 hover:text-white"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} />
                    Logout
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
