import React from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-700">
          Thank You for Your Order!
        </h2>
        <p className="text-gray-600 mb-6">
          Your order has been successfully placed.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
