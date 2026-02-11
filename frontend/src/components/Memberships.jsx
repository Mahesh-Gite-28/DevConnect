import { CheckCircle, Crown, Sparkles } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const handleBuyClick = async (planType) => {
  try {
    const order = await axios.post(
      BASE_URL + "/payment/create-checkout-session",
      { planType },
      { withCredentials: true }
    );

    window.location.href = order.data.url;
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

const Membership = () => {
  const user = useSelector((store) => store.user);

  // 🟢 If user already premium → show active membership
  if (user?.membershipType !== "free") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white px-4">
        <div
          className={`w-full max-w-md p-8 rounded-2xl text-center shadow-lg
          ${
            user.membershipType === "Gold"
              ? "border-2 border-yellow-400 shadow-yellow-500/30"
              : "border-2 border-gray-300"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            {user.membershipType} Membership Active
          </h2>

          <p className="text-neutral-400 mb-4">
            Your membership expires on:
          </p>

          <p className="text-lg font-semibold">
            {new Date(user.membershipExpiry).toDateString()}
          </p>
        </div>
      </div>
    );
  }

  // 🟢 If user is Free → show plans
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">
            Upgrade Your <span className="text-emerald-500">DevConnect</span>
          </h1>
          <p className="text-neutral-400 mt-3">
            Get more visibility & premium benefits.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* 🥈 Silver Plan */}
          <div className="relative rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700 p-8 hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Silver Membership
            </h2>

            <p className="text-neutral-400 mb-6">
              Better visibility & recognition
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹499</span>
              <span className="text-neutral-400"> / 3 months</span>
            </div>

            <ul className="space-y-3 text-neutral-300">
              <li className="flex gap-2">
                <CheckCircle className="text-emerald-500 w-5 h-5" />
                Silver Badge on Profile
              </li>
              <li className="flex gap-2">
                <CheckCircle className="text-emerald-500 w-5 h-5" />
                Higher Feed Priority than Free Users
              </li>
              <li className="flex gap-2">
                <CheckCircle className="text-emerald-500 w-5 h-5" />
                Membership Expiry Tracking
              </li>
            </ul>

            <button
              onClick={() => handleBuyClick("Silver")}
              className="btn btn-outline border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black w-full mt-8"
            >
              Choose Silver
            </button>
          </div>

          {/* 🥇 Gold Plan */}
          <div className="relative rounded-2xl bg-gradient-to-b from-yellow-400 via-yellow-500 to-yellow-600 p-8 text-black shadow-2xl hover:scale-[1.04] transition-all duration-300">

            {/* Badge */}
            <div className="absolute -top-4 right-6 bg-black text-yellow-400 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Most Popular
            </div>

            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Crown className="w-6 h-6" />
              Gold Membership
            </h2>

            <p className="opacity-80 mb-6">
              Maximum visibility & premium look
            </p>

            <div className="mb-6">
              <span className="text-4xl font-bold">₹999</span>
              <span className="opacity-80"> / 6 months</span>
            </div>

            <ul className="space-y-3 font-medium">
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                Gold Premium Badge
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                Highest Feed Priority
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                Membership Expiry Countdown
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                Highlighted Premium Profile Card
              </li>
            </ul>

            <button
              onClick={() => handleBuyClick("Gold")}
              className="btn bg-black text-yellow-400 hover:bg-neutral-900 w-full mt-8"
            >
              Go Gold 🚀
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Membership;
