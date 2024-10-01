import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayButtonDisabled, setIsPayButtonDisabled] = useState(true);
  const navigate = useNavigate();
  const imageUrl =
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D";

  const staticProducts = [
    { productName: "Product 1", price: 30, imageUrl },
    { productName: "Product 2", price: 10, imageUrl },
    { productName: "Product 3", price: 15, imageUrl },
  ];

  const totalAmount = staticProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: "" });
    setIsPayButtonDisabled(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.address) errors.address = "Address is required.";
    if (!formData.cardNumber) errors.cardNumber = "Card Number is required.";
    if (!/^\d{16}$/.test(formData.cardNumber))
      errors.cardNumber = "Card Number must be 16 digits.";
    if (!formData.expiryDate) errors.expiryDate = "Expiry Date is required.";
    if (!/^(\d{2})\/(\d{2})$/.test(formData.expiryDate))
      errors.expiryDate = "Expiry Date must be in MM/YY format.";
    if (!formData.cvv) errors.cvv = "CVV is required.";
    if (!/^\d{3}$/.test(formData.cvv)) errors.cvv = "CVV must be 3 digits.";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.post(
        "http://localhost:5000/api/orders",
        { items: staticProducts, totalAmount },
        config
      );
      navigate("/thankyou");
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Order failed");
      setError(error.response ? error.response.data.message : "Order failed");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {staticProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 text-center border border-gray-300"
          >
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-40 h-40 mb-4 object-cover mx-auto"
            />
            <h3 className="text-lg font-semibold">{product.productName}</h3>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <h4 className="text-2xl font-bold mb-4">Total: ${totalAmount}</h4>
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          onClick={openModal}
        >
          Proceed to Checkout
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              X
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">
              Enter Payment Details
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${
                      validationErrors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${
                      validationErrors.address
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="123 Main St"
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${
                      validationErrors.cardNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="1234 5678 9123 4567"
                  />
                  {validationErrors.cardNumber && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.cardNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${
                      validationErrors.expiryDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="MM/YY"
                  />
                  {validationErrors.expiryDate && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.expiryDate}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    validationErrors.cvv ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="123"
                />
                {validationErrors.cvv && (
                  <p className="text-red-500 text-sm">{validationErrors.cvv}</p>
                )}
              </div>

              {message && (
                <p className="text-red-500 text-sm text-center">{message}</p>
              )}
              <button
                type="submit"
                className={`w-full py-2 bg-green-500 text-white rounded-md ${
                  isPayButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isPayButtonDisabled}
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
