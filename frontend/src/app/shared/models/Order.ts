import { LatLng } from 'leaflet';
import { CartItem } from './CartItem';

export class Order {
  id!: string;
  items!: CartItem[];
  totalPrice!: number;
  name!: string;
  address!: string;
  addressLatLng?: LatLng;
  createdAt!: string;
  orderNumber!: string;
}
