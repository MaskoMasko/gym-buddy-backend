import express from "express";
import { client } from "../../prismaClient";

const router = express.Router();
router.post("/likes", async (req, res) => {
  try {
    const { postId, userId } = req.body;
    const like = await client.like.create({
      data: {
        postId,
        userId,
      },
    });
    res.json(like);
  } catch (error) {
    console.error("Error creating like:", error);
    res.status(500).json({ error: "Unable to create like" });
  }
});
router.get("/likes/:postId", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const likes = await client.like.findMany({
      where: {
        postId,
      },
      include: {
        user: true,
      },
    });
    res.json({ data: likes });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Unable to fetch likes" });
  }
});
router.delete("/likes/:postId/:userId", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = parseInt(req.params.userId);
    const post = await client.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });
    const postFound = post?.likes.find((like) => like.userId === userId);
    if (!postFound) {
      res.status(404).json({ error: "Like not found" });
    } else {
      await client.like.delete({
        where: {
          id: postFound.id,
        },
      });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting like:", error);
    res.status(500).json({ error: "Unable to delete like" });
  }
});

export default router;
