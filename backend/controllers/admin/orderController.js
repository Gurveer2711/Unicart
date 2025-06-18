import asyncHandler from "express-async-handler";
import Order from "../../models/orderModel.js";

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("orderItems.product", "title image")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      count: orders.length,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// @desc    Get order by ID (Admin)
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate(
        "orderItems.product",
        "title image originalPrice discountedPrice"
      );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json({
      success: true,
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// @desc    Update order status (Admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "canceled",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(
        "Invalid status. Must be one of: pending, processing, shipped, delivered, canceled"
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Update status
    order.status = status;

    // If status is delivered, set deliveredAt timestamp
    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = Date.now();
    }

    // If status is canceled, set canceledAt timestamp
    if (status === "canceled" && !order.canceledAt) {
      order.canceledAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// @desc    Get orders by status (Admin)
// @route   GET /api/admin/orders/status/:status
// @access  Private/Admin
export const getOrdersByStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.params;

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "canceled",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error(
        "Invalid status. Must be one of: pending, processing, shipped, delivered, canceled"
      );
    }

    const orders = await Order.find({ status })
      .populate("user", "name email")
      .populate("orderItems.product", "title image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      status: status,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders by status",
      error: error.message,
    });
  }
});

// @desc    Get orders statistics (Admin)
// @route   GET /api/admin/orders/stats
// @access  Private/Admin
export const getOrderStats = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const canceledOrders = await Order.countDocuments({ status: "canceled" });

    // Calculate total revenue from delivered orders
    const deliveredOrdersData = await Order.find({ status: "delivered" });
    const totalRevenue = deliveredOrdersData.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Get recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        canceledOrders,
        totalRevenue: totalRevenue.toFixed(2),
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
      error: error.message,
    });
  }
});

// @desc    Delete order (Admin)
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
});
