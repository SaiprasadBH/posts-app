import { PostManager, Post, CommentsManager, Comment } from "./post-model";
import { PostView } from "./posts-view";

export class PostController {
  constructor(
    postView: PostView,
    postManager: PostManager,
    commentManager: CommentsManager
  ) {
    //We need to add post view as subscriber to model
    postManager.subscribe(postView);
    commentManager.subscribe(postView);
    postManager.setModelStatus("pending");
    this.fetchPost()
      .then((posts) => {
        postManager.setPosts(posts);
      })
      .catch((err) => {
        console.error(err);
        postManager.setModelStatus("failure");
      });
    function handlePrevious() {
      postManager.decrementCurrentIndex();
      postView.update(postManager);
      postView.comments!.innerHTML = "";
    }
    function handleNext() {
      postManager.incrementCurrentIndex();
      postView.update(postManager);
      postView.comments!.innerHTML = "";
    }
    const handleViewComments = (): void => {
      commentManager.subscribe(postView);
      const currentPost: Post | undefined = postManager.currentPost();
      if (currentPost) {
        commentManager.setModelStatus("pending");
        commentManager.updateSubscribers();
        this.fetchComment(currentPost.id)
          .then((comments) => {
            commentManager.insertCommentsForPost(comments, currentPost.id);
          })
          .catch((err: unknown) => {
            commentManager.setModelStatus("failure");
            commentManager.updateSubscribers();
          });
      }
    };
    postView.nextButton?.addEventListener("click", handleNext);
    postView.prevButton?.addEventListener("click", handlePrevious);
    postView.commentButton?.addEventListener("click", handleViewComments);
  }

  async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data as T;
    } catch (err: unknown) {
      throw new Error("could not fetch");
    }
  }

  async fetchPost(): Promise<Post[]> {
    const url = "https://jsonplaceholder.typicode.com/posts";
    return await this.fetchData<Post[]>(url);
  }

  async fetchComment(postId: number): Promise<Comment[]> {
    const url = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;
    return await this.fetchData<Comment[]>(url);
  }
}
