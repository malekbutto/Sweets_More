import { LatLng } from "leaflet";
import { CartItem } from "../models/CartItem";

export interface IOrder{
  id: number;
  // items:CartItem;
  totalPrice:number;
  name:string;
  address:string;
  addressLatLng?:LatLng;
  createdAt:string;
  // status:string;
}
