import express from "express";
import { client } from "../../prismaClient";

const router = express.Router();

router.post("/blogs", async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    const post = await client.post.create({
      data: {
        title,
        content,
        authorId,
        media: {
          create: [{ url: "https://picsum.photos/200/300" }],
        },
      },
      include: {
        media: true,
      },
    });

    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Unable to create post" });
  }
});

router.get("/blogs", async (req, res) => {
  try {
    const posts = await client.post.findMany({
      include: {
        media: true,
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
      },
    });
    res.json({
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
});

router.get("/blogs/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await client.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        media: true,
        comments: {
          include: {
            author: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    } else {
      res.json({ data: post });
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Unable to fetch post" });
  }
});

router.put("/blogs/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    const updatedPost = await client.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
      },
    });
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Unable to update post" });
  }
});

router.delete("/blogs/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    await client.post.delete({
      where: {
        id: postId,
      },
    });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Unable to delete post" });
  }
});

export default router;
