import { Schema, model } from "mongoose";

export interface Food {
  id: string;
  name: string;
  price: number;
  tags: string;
  description: string;
  favorite: boolean;
  stars: number;
  piece: string;
  imageUrl: string;
}

export const FoodSchema = new Schema<Food>(
    {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: String, required: true },
    description: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    stars: { type: Number, required: true },
    piece: { type: String, required: true },
    imageUrl: { type: String, required: true },
    },{
        toJSON:{
            virtuals: true
        },
        toObject:{
            virtuals: true
        },
        timestamps:true
    }
);

export const FoodModel = model<Food>('food', FoodSchema);
