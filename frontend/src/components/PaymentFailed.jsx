import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-base-200 to-red-100 px-4">
      
      <div className="bg-base-100 rounded-3xl shadow-2xl max-w-md w-full text-center p-8 transition-all duration-300 hover:scale-[1.02]">
        
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full animate-pulse">
            <XCircle className="w-14 h-14 text-red-600" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mt-6 text-red-600">
          Payment Not Completed
        </h2>

        {/* Description */}
        <p className="text-gray-500 mt-3">
          Your payment was not completed.  
          <span className="font-semibold text-gray-700"> No money was deducted.</span>
        </p>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-5 text-sm text-yellow-700">
          ⚠️ This can happen due to network issues, bank decline,  
          or if you cancelled the payment.
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            className="btn btn-primary flex-1 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => navigate("/memberships")}
          >
            Try Again
          </button>

          <button
            className="btn btn-outline flex-1 rounded-xl"
            onClick={() => navigate("/profile")}
          >
            Go Home
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact  
          <span className="text-primary font-medium"> support@DevConnect.com</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
