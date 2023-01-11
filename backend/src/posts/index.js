import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const postsRouter = express.Router();

console.log("CURRENTS FILE URL:", import.meta.url);
console.log("CURRENTS FILE PATH:", fileURLToPath(import.meta.url));
console.log("PARENT FOLDER PATH: ", dirname(fileURLToPath(import.meta.url)));
console.log(
  "TARGET FILE PATH: ",
  join(dirname(fileURLToPath(import.meta.url)), "posts.json")
);

const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "Posts.json"
);

postsRouter.post("/", (req, res) => {
  console.log("REQ BODY:", req.body);

  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  const posts = JSON.parse(fs.readFileSync(postsJSONPath));

  posts.push(newAuthor);

  fs.writeFileSync(postsJSONPath, JSON.stringify(posts));

  res.status(201).send({ id: newAuthor.id });
});

postsRouter.get("/", (req, res) => {
  const fileContentAsABuffer = fs.readFileSync(postsJSONPath);
  const posts = JSON.parse(fileContentAsABuffer);
  res.send(posts);
});

postsRouter.get("/:id", (req, res) => {
  const postId = req.params.id;
  console.log("POST ID:", postId);
  const posts = JSON.parse(fs.readFileSync(postsJSONPath));
  const post = posts.find((post) => post.id === postId);
  console.log(post);
  res.send(post);
});

postsRouter.put("/:id", (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsJSONPath));
  const index = posts.findIndex((post) => post.id === req.params.id);
  const oldPost = posts[index];
  const newPost = { ...oldPost, ...req.body, updatedAt: new Date() };
  posts[index] = newPost;

  fs.writeFileSync(postsJSONPath, JSON.stringify(posts));

  res.send(newPost);
});

postsRouter.delete("/:id", (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsJSONPath));
  const remainingPosts = posts.filter((post) => post.id !== req.params.id);
  fs.writeFileSync(postsJSONPath, JSON.stringify(remainingPosts));
  res.send("Deleted!");
});

postsRouter.get("/author/:authorName", (req, res) => {
  const posts = JSON.parse(fs.readFileSync(postsJSONPath));
  const post = posts.filter((post) => post.author === req.params.authorName);
  if (post) {
    res.send(post);
  } else {
    res.status(404).send("Author not found");
  }
});

export default postsRouter;
