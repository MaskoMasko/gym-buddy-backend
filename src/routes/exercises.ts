import express from "express";
import axios from "axios";
import _ from "lodash";
import { client } from "../prismaClient";

const router = express.Router();

// async function getImages() {
//   const url =
//     "https://api.slingacademy.com/v1/sample-data/photos?offset=5&limit=100";

//   try {
//     const response = await axios.get(url);
//     return response.data;
//   } catch (error: any) {
//     console.error("Error:", error.message);
//     throw error;
//   }
// }
let uniqueNumbers = new Set();
const generateRandomNumber = () => {
  const randomNumber = _.random(2000, 10000);
  if (uniqueNumbers.has(randomNumber)) {
    generateRandomNumber();
  }
  uniqueNumbers.add(randomNumber);
  return randomNumber;
};
if (!process.env.WGER_API_URL) {
  throw Error(
    "process.env.WGER_API_URL is undefined. Check your env file configuration."
  );
}
if (!process.env.WGER_ACCESS_TOKEN) {
  throw Error(
    "process.env.WGER_ACCESS_TOKEN is undefined. Check your env file configuration."
  );
}
const wgerApiUrl = process.env.WGER_API_URL;
const wgerAccessToken = process.env.WGER_ACCESS_TOKEN;

router.get("/exercises", async (req, res) => {
  // const { photos } = await getImages();
  // async function fetchExercises(url: string) {
  //   const response = await axios.get(url, {
  //     headers: {
  //       Authorization: `Token ${wgerAccessToken}`,
  //     },
  //   });
  //   if (response.data.next) {
  //     await fetchExercises(response.data.next);
  //     const newResponse = await response.data.results.map((exercise: any) => {
  //       if (exercise.images.length === 0) {
  //         const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
  //         const uniqueNumber = generateRandomNumber();
  //         exercise.images = [{ id: uniqueNumber, image: randomPhoto.url }];
  //         (async function () {
  //           if (!uniqueNumber) return;
  //           await client.image.create({
  //             data: { id: uniqueNumber, image: randomPhoto.url },
  //           });
  //         })();
  //         // newImages.push({ id: uniqueNumber, image: randomPhoto.url })
  //         return exercise;
  //       }

  //       return exercise;
  //     });
  //     newResponse.forEach(async (exercise: any) => {
  //       if (!exercise.images || !exercise.videos) return;
  //       const equipment = exercise.equipment.map((item: any) => ({
  //         id: item.id,
  //       }));
  //       const images = exercise.images.map((item: any) => {
  //         return { id: item.id };
  //       });
  //       const videos = (exercise.videos ?? []).map((item: any) => ({
  //         id: item.id,
  //       }));
  //       await client.workout.create({
  //         data: {
  //           id: exercise.id,
  //           name: exercise.name,
  //           description: exercise.description,
  //           category: {
  //             connect: {
  //               //shiee
  //               id: exercise.category.id ?? 10,
  //             },
  //           },
  //           equipment: {
  //             connect: equipment,
  //           },
  //           images: {
  //             connect: images,
  //           },
  //           videos: {
  //             connect: videos,
  //           },
  //           creation_date: exercise.creation_date,
  //           exercise_base_id: exercise.exercise_base_id,
  //           uuid: exercise.uuid,
  //         },
  //       });
  //     });
  //   } else {
  //     const newResponse = await response.data.results.map((exercise: any) => {
  //       if (exercise.images.length === 0) {
  //         const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
  //         const uniqueNumber = generateRandomNumber();
  //         exercise.images = [{ id: uniqueNumber, image: randomPhoto.url }];
  //         (async function () {
  //           if (!uniqueNumber) return;
  //           await client.image.create({
  //             data: { id: uniqueNumber, image: randomPhoto.url },
  //           });
  //         })();
  //         // newImages.push({ id: uniqueNumber, image: randomPhoto.url })
  //         return exercise;
  //       }
  //       return exercise;
  //     });
  //     newResponse.forEach(async (exercise: any) => {
  //       const equipment = exercise.equipment.map((item: any) => ({
  //         id: item.id,
  //       }));
  //       const images = exercise.images.map((item: any) => ({
  //         id: item.id,
  //       }));
  //       const videos = (exercise.videos ?? []).map((item: any) => ({
  //         id: item.id,
  //       }));

  //       await client.workout.create({
  //         data: {
  //           id: exercise.id,
  //           name: exercise.name,
  //           description: exercise.description,
  //           category: {
  //             connect: {
  //               //shiee
  //               id: exercise.category.id ?? 10,
  //             },
  //           },
  //           equipment: {
  //             connect: equipment,
  //           },
  //           images: {
  //             connect: images,
  //           },
  //           videos: {
  //             connect: videos,
  //           },
  //           creation_date: exercise.creation_date,
  //           exercise_base_id: exercise.exercise_base_id,
  //           uuid: exercise.uuid,
  //         },
  //       });
  //     });
  //   }
  // }
  // fetchExercises(wgerApiUrl + "exerciseinfo");
  // res.send(200);
  try {
    const exercises = await client.workout.findMany();
    res.json({ data: exercises });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching exercises" });
  }
});

router.get("/exercises/equipment", async (req, res) => {
  // const response = await axios.get(wgerApiUrl + "equipment", {
  //   headers: {
  //     Authorization: `Token ${wgerAccessToken}`,
  //   },
  // });
  // const equipmentList = response.data.results;
  // await client.equipment.createMany({ data: equipmentList });
  // res.send(200);
  try {
    const data = await client.equipment.findMany();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching exercise images." });
  }
});

router.get("/exercises/image", async (req, res) => {
  // let data: any[] = [];
  // async function fetchData(url: string) {
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Token ${wgerAccessToken}`,
  //       },
  //     });
  //     if (response.data.next) {
  //       data.push(...response.data.results);
  //       await fetchData(response.data.next);
  //       res.send({ data });
  //       response.data.results.forEach(async (item: any) => {
  //         await client.image.create({
  //           data: {
  //             id: item.id,
  //             image: item.image,
  //           },
  //         });
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  // fetchData(wgerApiUrl + "exerciseimage" + "?is_main=True");
  try {
    const data = await client.image.findMany();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching exercise images." });
  }
});

router.get("/exercises/video", async (req, res) => {
  // let data: any[] = [];
  // async function fetchData(url: string) {
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Token ${wgerAccessToken}`,
  //       },
  //     });
  //     if (response.data.next) {
  //       data.push(...response.data.results);
  //       await fetchData(response.data.next);
  //       res.send({ data });
  //       response.data.results.forEach(async (item: any) => {
  //         await client.video.create({
  //           data: { id: item.id, video: item.video },
  //         });
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  // fetchData(wgerApiUrl + "video");
  try {
    const data = await client.video.findMany();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching exercise videos." });
  }
});

// router.get("/exercises/base-info", (req, res) => {
//   axios
//     .get(wgerApiUrl + "exercisebaseinfo", {
//       headers: {
//         Authorization: `Token ${wgerAccessToken}`,
//       },
//     })
//     .then((response) => {
//       // Handle the response data
//       const exercises = response.data;
//       res.json(exercises);
//     })
//     .catch((error) => {
//       // Handle any errors
//       console.error(error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while fetching exercises." });
//     });
// });
router.get("/exercises/category", async (req, res) => {
  // const images = [
  //   "http://localhost:4000/images/workout-abs.png",
  //   "http://localhost:4000/images/workout-chest.png",
  //   "http://localhost:4000/images/workout-arms.png",
  //   "http://localhost:4000/images/workout-legs.png",
  //   "http://localhost:4000/images/workout-back.png",
  //   "http://localhost:4000/images/workout-fullbody.png",
  // ];
  // const response = await axios.get(wgerApiUrl + "exercisecategory", {
  //   headers: {
  //     Authorization: `Token ${wgerAccessToken}`,
  //   },
  // });
  // const resultsWithImages = response.data.results.map((result: any) => ({
  //   ...result,
  //   image: images[_.round(_.random(0, images.length - 1))],
  // }));
  // await client.category.createMany({ data: resultsWithImages });
  // res.send(200);
  try {
    const data = await client.category.findMany();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching exercise categories." });
  }
});

// router.get("/exercises/language", async (req, res) => {
// let data: any[] = [];
// async function fetchData(url: string) {
//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Token ${wgerAccessToken}`,
//       },
//     });
//     if (response.data.next) {
//       data.push(...response.data.results);
//       await fetchData(response.data.next);
//       res.send({ data });
//       await client.language.createMany({ data });
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }
// fetchData(wgerApiUrl + "language");
// try {
// const data = await client.language.findMany();
// res.json({ data }).status(200);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching languages." });
//   }
// });

// router.get("/exercises/license", async (req, res) => {
// try {
//   const response = await axios.get(wgerApiUrl + "license", {
//     headers: {
//       Authorization: `Token ${wgerAccessToken}`,
//     },
//   });
//   const data = response.data.results;
//   await client.license.createMany({ data });
//   res.send({ data }).status(200);
// } catch (err) {
//   console.error(err);
//   res.status(500);
// }
// try {
// const data = await client.license.findMany();
// res.json({ data }).status(200);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching languages." });
//   }
// });
// router.get("/exercises/comments", async (req, res) => {
//   let data: any[] = [];
//   async function fetchData(url: string) {
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Token ${wgerAccessToken}`,
//         },
//       });
//       if (response.data.next) {
//         data.push(...response.data.results);
//         await fetchData(response.data.next);
//         res.send({ data });
//         // await client.workoutComment.createMany({ data });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   fetchData(wgerApiUrl + "exercisecomment");
// try {
//   const data = await client.workoutComment.findMany();
//   res.json({ data }).status(200);
// }catch(error){
//   console.error(error);
//   res
//     .status(500)
//     .json({ error: "An error occurred while fetching comments." });
// }
// });

// router.get("/exercises/muscle", async (req, res) => {
//   try {
// const data = await client.muscle.findMany();
// res.json({ data }).status(200);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching muscles." });
//   }
// });

export default router;
