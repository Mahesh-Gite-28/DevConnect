import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [emailID, setemailID] = useState("");
  const [password, setpassword] = useState("");

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");

  const [isLogin, setisLogin] = useState(true);
  const [error, Seterror] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async () => {
  try {
    Seterror("");

    if (isLogin) {

      const res = await axios.post(
        BASE_URL + "/login",
        { emailID, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/feed");
      }, 200);

    } else {

      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailID, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));

      toast.success("Account created successfully");

      setTimeout(() => {
        navigate("/profile");
      }, 200);
    }
  } catch (error) {
    const backendError =
      error?.response?.data?.errors ||
      error?.response?.data?.message ||
      error?.response?.data ||
      "Invalid email or password";

    toast.error(backendError);
    Seterror(backendError);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="card bg-slate-950 border border-slate-800 shadow-xl">
          <div className="card-body gap-4">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-slate-400 mt-1 text-sm">
                {isLogin
                  ? "Login to continue your journey"
                  : "Join DevConnect and start connecting"}
              </p>
            </div>

            <div className="space-y-3">
              {/* 🔹 SIGNUP EXTRA FIELDS */}
              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                    className="input input-bordered w-full bg-slate-900 border-slate-800 text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setlastName(e.target.value)}
                    className="input input-bordered w-full bg-slate-900 border-slate-800 text-white placeholder-slate-500"
                  />
                </>
              )}

              {/* 🔹 EMAIL */}
              <input
                type="email"
                placeholder="Email"
                value={emailID}
                onChange={(e) => setemailID(e.target.value)}
                className="input input-bordered w-full bg-slate-900 border-slate-800 text-white placeholder-slate-500"
              />

              {/* 🔹 PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="input input-bordered w-full bg-slate-900 border-slate-800 text-white placeholder-slate-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                className="btn w-full mt-2 bg-emerald-500 hover:bg-emerald-600 border-none text-black"
                onClick={onSubmitHandler}
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </div>

            {/* Toggle */}
            <div className="text-center text-sm text-slate-400 mt-2">
              {isLogin ? (
                <>
                  New user?
                  <button
                    onClick={() => {
                      setisLogin(false);
                      Seterror("");
                    }}
                    className="ml-1 font-semibold text-emerald-400 hover:underline"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?
                  <button
                    onClick={() => {
                      setisLogin(true);
                      Seterror("");
                    }}
                    className="ml-1 font-semibold text-emerald-400 hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
