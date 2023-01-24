import express, { request } from "express";
import cors from "cors";
import { sample_foods, sample_tags } from "./data";

const app = express();
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.get("/api/foods", (req, res) => {
    res.send(sample_foods);
})

app.get("/api/search/:searchTerm", (req, res) => {
    const searchTerm = req.params.searchTerm;
    const foods = sample_foods
    .filter(food => food.name.toLowerCase()
    .includes(searchTerm.toLowerCase()));
    res.send(foods);
})

app.get("/api/tags", (req, res) => {
    res.send(sample_tags);
})

app.get("/api/tag/:tagName", (req, res) => {
    const tagName = req.params.tagName;
    const foods = sample_foods
    .filter(food => food.tags?.includes(tagName));
    res.send(foods);
})

app.get("/api/:tagName/:foodId", (req, res) => {
    const foodId = req.params.foodId
    const food = sample_foods
    .find(food => food.id == foodId);
    res.send(food);
})

const port = 5000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})