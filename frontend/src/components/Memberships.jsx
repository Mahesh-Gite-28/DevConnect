import { CheckCircle, Crown, Sparkles } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import toast from "react-hot-toast";

const handleBuyClick = async (planType) => {
  try {
    throw new Error;
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  }
};

const Membership = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">
            Upgrade Your{" "}
            <span className="text-emerald-500">DevTinder</span>{" "}
            Experience
          </h1>
          <p className="text-neutral-400 mt-3">
            More visibility. More matches. More power.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Silver */}
          <div className="relative rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700 p-8 hover:scale-[1.02] transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Silver Membership
            </h2>
            <p className="text-neutral-400 mb-6">Perfect to get noticed</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹499</span>
              <span className="text-neutral-400"> / 3 months</span>
            </div>

            <ul className="space-y-3 text-neutral-300">
              <li className="flex gap-2">
                <CheckCircle className="text-emerald-500 w-5 h-5" />
                100 requests per day
              </li>
              <li className="flex gap-2">
                <CheckCircle className="text-emerald-500 w-5 h-5" />
                Verified profile badge
              </li>
              <li className="flex gap-2">
                <CheckCircle className="text-emerald-500 w-5 h-5" />
                Better profile visibility
              </li>
            </ul>

            <button
              onClick={() => handleBuyClick("Silver")}
              className="btn btn-outline border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black w-full mt-8"
            >
              Choose Silver
            </button>
          </div>

          {/* Gold */}
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

            <p className="opacity-80 mb-6">Maximum reach & priority</p>

            <div className="mb-6">
              <span className="text-4xl font-bold">₹999</span>
              <span className="opacity-80"> / 6 months</span>
            </div>

            <ul className="space-y-3 font-medium">
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                Unlimited requests
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                DevTinder Gold badge
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                Profile priority boost
              </li>
              <li className="flex gap-2">
                <CheckCircle className="w-5 h-5" />
                Faster matches
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
