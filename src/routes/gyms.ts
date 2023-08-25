import express from "express";
import { client } from "../prismaClient";

const router = express.Router();

//this should get converted to post method
router.get("/add-gym", async (req, res) => {
  const location = await client.gym.create({
    data: {
      name: "Elite Gym",
      rating: 5,
      reviews: {
        create: [
          {
            user: {
              connect: {
                id: 2,
              },
            },
            text: "This is the best gym in the world!",
          },
        ],
      },
      workingHours: {
        create: [
          {
            day: "Monday",
            open: "08:00",
            close: "22:00",
          },
          {
            day: "Tuesday",
            open: "08:00",
            close: "22:00",
          },

          {
            day: "Wednesday",
            open: "08:00",
            close: "22:00",
          },
          {
            day: "Thursday",
            open: "08:00",
            close: "22:00",
          },
          {
            day: "Friday",
            open: "08:00",
            close: "22:00",
          },
          {
            day: "Saturday",
            open: "08:00",
            close: "14:00",
          },
          {
            day: "Sunday",
            open: "08:00",
            close: "14:00",
          },
        ],
      },
      website: "https://elitegym.io/",
      images: {
        create: [
          { uri: "https://picsum.photos/200/300" },
          { uri: "https://picsum.photos/200/300" },
          { uri: "https://picsum.photos/200/300" },
        ],
      },
      address: "Supetarska 5, 52341, Žminj",
      latitude: 45.1472369,
      longitude: 13.8957274,
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

router.get("/gyms/base", async (req, res) => {
  const gymLocations = await client.gym.findMany({
    include: { reviews: true },
  });
  if (!gymLocations) {
    return res.send({ message: "There are no locations added..." });
  }
  res.json({ data: gymLocations });
});
router.get("/gyms", async (req, res) => {
  const gymLocations = await client.gym.findMany({
    include: { reviews: true, images: true, workingHours: true },
  });
  if (!gymLocations) {
    return res.send({ message: "There are no locations added..." });
  }
  res.json({ data: gymLocations });
});

export default router;
