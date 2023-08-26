import express from "express";
import { client } from "../prismaClient";

const router = express.Router();

//this should get converted to post method
router.get("/add-gym", async (req, res) => {
  const {
    name,
    rating,
    reviews,
    workingHours,
    website,
    images,
    address,
    longitude,
    latitude,
  } = req.body;
  const reviewsCreate = reviews.map((review: any) => {
    return {
      user: {
        //rewrite as create or connect
        connect: {
          id: review.userId,
        },
      },
      text: review.text,
    };
  });

  const location = await client.gym.create({
    data: {
      name,
      rating,
      reviews: {
        create: reviewsCreate,
      },
      workingHours: {
        create: workingHours,
      },
      website,
      images: {
        create: images,
      },
      address,
      latitude,
      longitude,
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
