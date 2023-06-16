import express from "express";
import { client } from "../prismaClient";
import { Workout } from "@prisma/client";
import _ from "lodash";

const router = express.Router();

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
  const params = req.query;
  let filteredWorkouts: Workout[] = [];
  filteredWorkouts = _.flatten(
    _.castArray(params.type ?? []).map((type) =>
      workouts.filter((workout) => {
        if (
          workout.type === _.capitalize(type as string) &&
          //if param is undefined, fallback to workout property
          workout.difficulty === (params.difficulty ?? workout.difficulty) &&
          workout.duration === Number(params?.duration ?? workout.duration) &&
          workout.equipment ===
            //we have to be careful here, cause if equipment is undefined,
            // it will return workouts with equipment: false -> Boolean(undefined) === false
            (params?.equipment !== undefined
              ? Boolean(params.equipment)
              : workout.equipment)
        ) {
          return workout;
        }
      })
    )
  );

  res.json({ data: filteredWorkouts });
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
