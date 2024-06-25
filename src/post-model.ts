export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export interface PostsModel {
  //posts: Post[];
  getPosts: () => Post[];
  setPosts: (posts: Post[]) => void;
  currentPostIndex: number;
  currentPost: () => Post | undefined;
}
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  insertCommentsForPost: (comments: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}
/* Subscriber interface */
export interface Subscriber {
  update: (publisher: Publisher) => void;
}
/** publisher interface **/
export interface Publisher {
  subscribers: Subscriber[];
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
  updateSubscribers: () => void;
}

type ModelStatus = "available" | "pending" | "failure";
export class PostManager implements PostsModel, Publisher {
  public modelStatus: ModelStatus = "available";
  public subscribers: Subscriber[] = [];
  public currentPostIndex: number = 0;
  private posts: Post[] = [];
  getModelStatus() {
    return this.modelStatus;
  }
  setModelStatus(status: ModelStatus) {
    this.modelStatus = status;
  }
  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }
  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }
  unsubscribe(subscriber: Subscriber): void {
    if (this.subscribers.includes(subscriber)) {
      this.subscribers = this.subscribers.filter((sub) => sub != sub);
    }
  }
  updateSubscribers(): void {
    this.subscribers.forEach((sub) => sub.update(this));
  }
  setPosts(posts: Post[]): void {
    this.posts = posts;
    this.updateSubscribers();
    this.setModelStatus("available");
  }
  getPosts() {
    return this.posts;
  }
  incrementCurrentIndex() {
    this.currentPostIndex += 1;
    if (this.currentPostIndex === this.getPosts().length - 1) {
      this.currentPostIndex = this.getPosts().length - 1;
    }
    this.updateSubscribers();
  }
  decrementCurrentIndex() {
    this.currentPostIndex -= 1;
    if (this.currentPostIndex < 0) {
      this.currentPostIndex = 0;
    }
    this.updateSubscribers();
  }
}
export class CommentsManager implements CommentsModel {
  commentsMap: Map<number, Comment[]> = new Map();
  insertCommentsForPost(comments: Comment[], postId: number): void {
    this.commentsMap.set(postId, comments);
  }
  getCommentsForPost(postId: number): Comment[] | undefined {
    return this.commentsMap.get(postId);
  }
}
