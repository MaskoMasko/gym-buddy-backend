import express from "express";
import { client } from "../prismaClient";

const router = express.Router();

//this should get converted to post method
router.get("/add-location", async (req, res) => {
  const location = await client.gymLocation.create({
    data: {
      name: "This one",
      rating: 4.7,
      latitude: 45.0500135,
      longitude: 13.8704421,
    },
  });
  // console.log({ location });
  if (!location) {
    res
      .status(500)
      .send({ message: "Error while add new location. Try again later!" });
  } else {
    res.send({ message: "Location was successfully added!" });
  }
});

router.get("/gym-locations", async (req, res) => {
  const gymLocations = await client.gymLocation.findMany();
  if (!gymLocations) {
    return res.send({ message: "There are no locations added..." });
  }
  res.json({ data: gymLocations });
});

export default router;
