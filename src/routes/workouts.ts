import express from "express";
import { client } from "../prismaClient";

const router = express.Router();

// TYPE: "CHEST" | "ABS" | "LEGS" | "ARMS" | "BACK" | "FULL BODY" | "UPPER BODY" | "LOWERBODY"
// DIFFICULTY: BEGINNER | ADVANCED | INTERMEDIATE
// DURATION: 15 | 30  | 45 | 60
// EQUIPMENT: "No equipment (bodyweight)" | "Weighted workout"

router.get("/workouts/:filter", async (req, res) => {
  const { filter } = req.params;
  const workouts = await client.workout.findMany({
    where: {
      type: filter.replace(/^\w/, (c) => c.toUpperCase()),
    },
  });
  res.json({ data: workouts });
});

router.get("/workouts", async (req, res) => {
  const workouts = await client.workout.findMany();
  res.json({ data: workouts });
});

router.post("/add-workout", async (req, res) => {
  const { type, difficulty, duration, equipment } = req.body;
  await client.workout.create({
    data: {
      type,
      difficulty,
      duration,
      equipment,
    },
  });
  res.status(200).send({ message: "Workout was successfully created!" });
});

router.get("/workout-categories", (req, res) => {
  res.json({
    data: [
      {
        category: "abs",
        image: "http://localhost:4000/images/workout-abs.png",
      },
      {
        category: "chest",
        image: "http://localhost:4000/images/workout-chest.png",
      },
      {
        category: "arms",
        image: "http://localhost:4000/images/workout-arms.png",
      },
      {
        category: "legs",
        image: "http://localhost:4000/images/workout-legs.png",
      },
      {
        category: "back",
        image: "http://localhost:4000/images/workout-back.png",
      },
      {
        category: "full body",
        image: "http://localhost:4000/images/workout-fullbody.png",
      },
      {
        category: "upper body",
        image: "http://localhost:4000/images/workout-upperbody.png",
      },
      {
        category: "lower body",
        image: "http://localhost:4000/images/workout-lowerbody.png",
      },
    ],
  });
});
export default router;
