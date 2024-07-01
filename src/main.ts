import { PostView } from "./posts-view";
import { PostManager, Post, CommentsManager } from "./post-model";
import { PostController } from "./post-controller";

const postview = new PostView();
const postManager = new PostManager();
const commentManger = new CommentsManager();
const postController = new PostController(postview, postManager, commentManger);
