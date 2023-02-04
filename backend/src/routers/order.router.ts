import { Router } from "express";
import asyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderStatus } from "../constants/order_status";
import { OrderModel } from "../models/order.model";
import auth from '../middlewares/auth.mid'
import { sample_orders } from "../data";

const router = Router();
// router.use(auth);

router.get("/orders/seed", asyncHandler(async (req, res) => {
  const ordersCount = await OrderModel.countDocuments();
  if (ordersCount > 0){
    res.send("Seed is already done!");
    return;
  }
  await OrderModel.create(sample_orders);
  res.send("Seed Is Done")
  })
);

router.get("/orders", asyncHandler(
  async (req, res) => {
    const orders = await OrderModel.find();
    res.send(orders);
}
))

router.post("/create", asyncHandler(async (req: any, res: any) => {
    const requestOrder = req.body;

    if (requestOrder.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart Is Empty");
      return;
    }

    await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW
    });
    
    const newOrder = new OrderModel({...requestOrder, user: req.user.id});
    await newOrder.save();
    res.send(newOrder);

})
)

export default router;