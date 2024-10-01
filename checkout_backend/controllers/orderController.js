const Order = require("../models/Order");
const User = require("../models/User");

const createOrder = async (req, res) => {
  const { items, totalAmount } = req.body;
  const user = await User.findById(req.user._id);

  if (user.credit < totalAmount) {
    return res.status(400).json({ message: "Insufficient credit" });
  }

  try {
    user.credit -= totalAmount;
    await user.save();

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder };
