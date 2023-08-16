import express from "express";
import { client } from "../prismaClient";
import { REST_ID } from "./exercises";

const router = express.Router();

router.post("/workout", async (req, res) => {
  const { completed, est_duration, duration, date, exercises } = req.body;
  //exercises is list of exercise ids
  const newExercises = exercises.map((exercise: string | number) =>
    typeof exercise === "string" ? { id: REST_ID } : { id: exercise }
  );
  try {
    // const addWorkout = await client.workout.create({
    //   data: {
    //     id: 100,
    //     date,
    //     duration,
    //     est_duration,
    //     exercises: {
    //       connect: newExercises,
    //     },
    //     completed,
    //   },
    //   include: {
    //     exercises: true,
    //   },
    // });
    const addWorkout = await client.workout.findMany({
      where: { id: 100 },
      include: { exercises: false },
    });
    res.json(addWorkout);
  } catch (error) {
    console.log(error);
  }
});

router.get("/workout", async (req, res) => {
  try {
    const workouts = await client.workout.findMany({
      include: {
        exercises: true,
      },
    });
    res.json({data: workouts});
  } catch (error) {
    console.log(error);
  }
});

export default router;
