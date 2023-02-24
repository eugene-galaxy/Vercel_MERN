import express from "express";
import City from "../models/city.model.js";
import haversine from "haversine";
const router = express.Router();

// retrive name of cities according to request
router.get("/get_cities", async (req, res) => {
  City.find({ city: new RegExp(req.query.key, "i") }, { city: 1, _id: 0 })
    .then((cities) => {
      res.status(200).json({
        cities: cities,
      });
    })
    .catch((err) => {
      throw err;
    });
});

// calculate travel distance
router.post("/get_result", async (req, res) => {
  let data = req.body;
  let position = []; // positions of cities
  let distance = []; // distances between cities
  let cities = []; // travel cities
  let sum = 0; // total distance
  let result; // all information of the cities from database
  let errors = []; // errors for city of existance
  // get travel cities
  cities.push(data.origin);
  for (let i = 0; i < data.intermediateCities?.length; i++)
    cities.push(data.intermediateCities[i]);
  cities.push(data.destination);
  await City.find({ city: { $in: cities } }, { _id: 0 }).then((res) => {
    result = res;
  });
  let i;
  for (i = 0; i < cities.length; i++) {
    let tmp;
    tmp = result.find(({ city }) => city === cities[i]);
    if (tmp)
      position.push({ latitude: tmp.pos_x, longitude: tmp.pos_y }),
        (errors[i] = 0);
    else position.push(null), (errors[i] = 1);
    if (i) {
      if (position[i - 1] && position[i])
        distance[i - 1] =
          parseInt(haversine(position[i - 1], position[i]) * 100) / 100;
      sum += distance[i - 1] ? distance[i - 1] : 0;
    }
  }
  distance[i - 1] = parseInt(sum * 100) / 100;
  data["errors"] = errors;
  data["distance"] = distance;
  res.json(data);
});
export default router;
