import express from "express";
import listEndpoints from "express-list-endpoints";
import postsRouter from "./posts/index.js";
import cors from "cors";

const server = express();

const port = 3001;

server.use(cors());

server.use(express.json());

server.use("/posts", postsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
