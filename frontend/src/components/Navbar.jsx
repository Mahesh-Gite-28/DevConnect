import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { removefeed } from "../utils/feedSlice";
import { removeconnections } from "../utils/connectionSlice";
import { removeRequests } from "../utils/requestSlice";
import toast from "react-hot-toast";
import { useState } from "react";

import {
  Home,
  User,
  Users,
  Inbox,
  LogOut,
  Crown,
  Search,
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
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
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    navigate(`/search?query=${searchText}`);
    setSearchText("");
  };

  return (
    <div className="navbar bg-black border-b border-slate-800 px-6 fixed top-0 z-[1000]">
      {/* Left Logo */}
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

      {/* Right Side */}
      {user && (
        <div className="flex items-center gap-4">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-1"
          >
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-40"
            />
          </form>

          <div className="dropdown dropdown-end">
            <div className="flex items-center gap-3">
              {/* Welcome Text + Badge */}
              <p className="text-sm font-medium whitespace-nowrap text-slate-400 hidden sm:flex items-center gap-2">
                Welcome,
                <span className="text-white font-semibold flex items-center gap-2">
                  {user.firstName}

                  {user.membershipType === "Gold" && (
                    <Crown
                      size={16}
                      className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_gold]"
                    />
                  )}

                  {user.membershipType === "Silver" && (
                    <Crown
                      size={16}
                      className="text-gray-300 fill-gray-300 drop-shadow-[0_0_6px_silver]"
                    />
                  )}
                </span>
              </p>

              {/* Avatar */}
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
              >
                <div
                  className={`w-10 rounded-full ring ring-offset-black ring-offset-2 ${
                    user.membershipType === "Gold"
                      ? "ring-yellow-400"
                      : user.membershipType === "Silver"
                        ? "ring-gray-300"
                        : "ring-emerald-400"
                  }`}
                >
                  <img alt="profile" src={user.photoUrl} />
                </div>
              </div>
            </div>

            {/* Dropdown */}
            <ul className="menu menu-sm dropdown-content mt-3 w-52 rounded-xl bg-slate-950 p-2 shadow-xl border border-slate-800">
              <li>
                <Link
                  to="/feed"
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Home size={16} className="mr-2" />
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/connections"
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Users size={16} className="mr-2" />
                  Connections
                </Link>
              </li>

              <li>
                <Link
                  to="/requests"
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Inbox size={16} className="mr-2" />
                  Requests
                </Link>
              </li>

              <li>
                <Link
                  to="/smart-matches"
                  className="hover:bg-emerald-500 hover:text-black"
                >
                  <Sparkles size={16} className="mr-2" />
                  Smart Matches
                </Link>
              </li>

              <li>
                <Link
                  to="/memberships"
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
                  <LogOut size={16} className="mr-2" />
                  Logout
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
