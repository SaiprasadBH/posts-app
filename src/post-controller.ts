import { PostManager, Post } from "./post-model";
import { PostView } from "./posts-view";

export class PostController {
  constructor(postView: PostView, postManager: PostManager) {
    //We need to add post view as subscriber to model
    postManager.subscribe(postView);
    function handlePrevious() {
      postManager.decrementCurrentIndex();
      postView.update(postManager);
    }
    function handleNext() {
      postManager.incrementCurrentIndex();
      postView.update(postManager);
    }
    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);
  }
  async fetchPost() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const posts = (await response.json()) as Post[];
      return posts;
    } catch (err: unknown) {
      throw new Error("could not fetch");
    }
  }
}
