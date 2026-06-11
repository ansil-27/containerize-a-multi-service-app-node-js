import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { query } from "./db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "Ansil's Blog API" });
});

app.get("/api/posts", async (_request, response, next) => {
  try {
    const result = await query(
      "SELECT id, title, content, author, created_at FROM posts ORDER BY created_at DESC"
    );
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get("/api/posts/:id", async (request, response, next) => {
  try {
    const result = await query(
      "SELECT id, title, content, author, created_at FROM posts WHERE id = $1",
      [request.params.id]
    );

    if (result.rowCount === 0) {
      return response.status(404).json({ message: "Post not found" });
    }

    response.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post("/api/posts", async (request, response, next) => {
  try {
    const { title, content, author } = request.body;

    if (!title?.trim() || !content?.trim()) {
      return response.status(400).json({ message: "Title and content are required" });
    }

    const result = await query(
      `INSERT INTO posts (title, content, author)
       VALUES ($1, $2, $3)
       RETURNING id, title, content, author, created_at`,
      [title.trim(), content.trim(), author?.trim() || "Ansil"]
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/posts/:id", async (request, response, next) => {
  try {
    const { title, content, author } = request.body;

    if (!title?.trim() || !content?.trim()) {
      return response.status(400).json({ message: "Title and content are required" });
    }

    const result = await query(
      `UPDATE posts
       SET title = $1, content = $2, author = $3
       WHERE id = $4
       RETURNING id, title, content, author, created_at`,
      [title.trim(), content.trim(), author?.trim() || "Ansil", request.params.id]
    );

    if (result.rowCount === 0) {
      return response.status(404).json({ message: "Post not found" });
    }

    response.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/posts/:id", async (request, response, next) => {
  try {
    const result = await query("DELETE FROM posts WHERE id = $1", [request.params.id]);

    if (result.rowCount === 0) {
      return response.status(404).json({ message: "Post not found" });
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Something went wrong" });
});

app.listen(port, () => {
  console.log(`Ansil's Blog API is running on port ${port}`);
});
