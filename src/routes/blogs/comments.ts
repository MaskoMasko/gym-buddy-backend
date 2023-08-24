import express from "express";
import { client } from "../../prismaClient";

const router = express.Router();

router.post("/comments", async (req, res) => {
  try {
    const { content, postId, authorId } = req.body;
    const comment = await client.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
    });
    res.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Unable to create comment" });
  }
});

router.get("/comments/:postId", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await client.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
      },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Unable to fetch comments" });
  }
});
router.put("/comments/:id", async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const { content } = req.body;
    const updatedComment = await client.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Unable to update comment" });
  }
});
router.delete("/comments/:id", async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    await client.comment.delete({
      where: {
        id: commentId,
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Unable to delete comment" });
  }
});

export default router;
