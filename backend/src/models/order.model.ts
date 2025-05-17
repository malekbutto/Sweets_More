import mongoose, { model, Schema, Types } from "mongoose";
import { OrderStatus } from "../constants/order_status";
import { Food, FoodSchema } from "./food.module";

// Add this early in your application startup
mongoose.set("strictQuery", false);

export interface LatLng {
  lat: string;
  lng: string;
}

export const LatLngSchema = new Schema<LatLng>({
  lat: { type: String, required: true },
  lng: { type: String, required: true },
});

export interface OrderItem {
  food: Food;
  price: number;
  quantity: number;
}

export const OrderItemSchema = new Schema<OrderItem>({
  food: { type: FoodSchema, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  name: string;
  address: string;
  addressLatLng: LatLng;
  user: Types.ObjectId;
  orderNumber: string;
  createdAt: Date;
}

const orderSchema = new Schema<Order>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: LatLngSchema, required: true },
    totalPrice: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    user: { type: Schema.Types.ObjectId, required: false },
    orderNumber: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

orderSchema.pre("validate", async function (next) {
  if (!this.isNew || this.orderNumber) return next();

  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));
    const datePart = now.toISOString().split("T")[0].replace(/-/g, ""); // e.g., 20250430

    // Count orders for today to generate sequence
    const count = await OrderModel.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    this.orderNumber = `ORD-${datePart}-${(count + 1)
      .toString()
      .padStart(3, "0")}`; // e.g., ORD-20250430-001

    next();
  } catch (error) {
    console.error("Error generating order number:", error);
    // Fallback to timestamp if counting fails
    this.orderNumber = `ORD-${Date.now()}`;
    next();
  }
});

export const OrderModel = model("Order", orderSchema);
