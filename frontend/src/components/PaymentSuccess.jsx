import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-base-200 to-green-100 px-4">
      
      <div className="bg-base-100 rounded-3xl shadow-2xl max-w-md w-full text-center p-8 transition-all duration-300 hover:scale-[1.02]">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mt-6 text-green-700">
          Payment Successful 🎉
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-3">
          Thank you for upgrading your <span className="font-semibold text-primary">DevConnect</span> membership.
        </p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-5 text-sm text-blue-700">
          🚀 Your membership will be activated within a few seconds.  
          Please don’t refresh the page.
        </div>

        {/* Button */}
        <button
          className="btn btn-primary w-full mt-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          onClick={() => navigate("/profile")}
        >
          Go to Profile
        </button>

        {/* Footer Note */}
        <p className="text-xs text-gray-400 mt-5">
          If your membership does not activate within 2 minutes, please contact support.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
