import "./style.css";
import "./posts.css";
import { PostManager, Publisher, Subscriber } from "./post-model";

export class PostView implements Subscriber {
  postTitleElement: HTMLHeadingElement | null = null;
  postDescription: HTMLParagraphElement | null = null;
  prevButton: HTMLButtonElement | null = null;
  nextButton: HTMLButtonElement | null = null;
  commentButton: HTMLButtonElement | null = null;

  constructor() {
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <section>
    <nav>
      <button data-testid="prev-button">Previous</button>
      <h2>Post Title</h2>
      <button data-testid="next-button">Next</button>
    </nav>
    <p class="post-desc" data-testid="post-desc">Post Description</p>
    </section>
    <section class="comment-section">
    <button data-testid="comments-button">View Comments</button>
    <section class="comments">
     Comments of current post goes here
    </section>
    </section>
  </div>
`;
    this.postDescription = document.querySelector("h2");
    this.postTitleElement = document.querySelector('[data-testid="post-desc"]');
    this.prevButton = document.querySelector("[data-testid='prev-button']");
    this.nextButton = document.querySelector('[data-testid="next-button"]');
    this.commentButton = document.querySelector(
      '[data-testid="comments-button"]'
    );
    console.assert(this.postDescription !== null, "postDescription is null");
    console.assert(this.postTitleElement !== null, "postTitle is null");
    //similarly add other asserts
  }
  update(manager: Publisher) {
    if (manager instanceof PostManager) {
      //check if model is in available state,if so we are good to consume posts data
      //on the other hand if the status is pending, that means
      //someone has initiated data fetch, but the data has not arrived.
      //in that case, we would like to let user know about the progress.
      //in this case time that might need to bring data from server is unkown.
      //if model goes into failure state, that also need to be made known to user.
      const post = manager.currentPost();
      switch (manager.getModelStatus()) {
        case "available":
          {
            this.postTitleElement!.textContent = post!.title;
            this.postDescription!.textContent = post!.body;
          }
          break;
        case "pending":
          {
            this.postTitleElement!.textContent = "Loading";
            this.postDescription!.textContent = "Loading";
          }
          break;
        case "failure":
          {
            this.postTitleElement!.textContent = "Failed to load";
            this.postDescription!.textContent = "Failed to load";
          }
          break;
      }
    }
  }
}
