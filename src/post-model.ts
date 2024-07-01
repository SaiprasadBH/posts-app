// Subscriber interface
export interface Subscriber {
  update: (publisher: Publisher) => void;
}

// Publisher interface
export interface Publisher {
  subscribers: Subscriber[];
  subscribe: (subscriber: Subscriber) => void;
  unsubscribe: (subscriber: Subscriber) => void;
  updateSubscribers: () => void;
}

// ModelStatus class to manage model status
class ModelStatus {
  private status: "available" | "pending" | "failure" = "available";

  getStatus(): "available" | "pending" | "failure" {
    return this.status;
  }

  setStatus(status: "available" | "pending" | "failure") {
    this.status = status;
  }
}

// ActualPublisher class implementing Publisher
class ActualPublisher implements Publisher {
  public subscribers: Subscriber[] = [];

  subscribe(subscriber: Subscriber): void {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  updateSubscribers(): void {
    this.subscribers.forEach((sub) => sub.update(this));
  }
}

// Post interface
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// PostsModel interface
export interface PostsModel {
  getPosts: () => Post[];
  setPosts: (posts: Post[]) => void;
  currentPostIndex: number;
  currentPost: () => Post | undefined;
}

// Comment interface
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// CommentsModel interface
export interface CommentsModel {
  commentsMap: Map<number, Comment[]>;
  insertCommentsForPost: (comments: Comment[], postId: number) => void;
  getCommentsForPost: (postId: number) => Comment[] | undefined;
}

// PostManager class
export class PostManager extends ActualPublisher implements PostsModel {
  private modelStatus: ModelStatus = new ModelStatus();
  public currentPostIndex: number = 0;
  private posts: Post[] = [];

  getModelStatus() {
    return this.modelStatus.getStatus();
  }

  setModelStatus(status: "available" | "pending" | "failure") {
    this.modelStatus.setStatus(status);
  }

  currentPost(): Post | undefined {
    return this.posts[this.currentPostIndex];
  }

  setPosts(posts: Post[]): void {
    this.setModelStatus("available");
    this.posts = posts;
    this.updateSubscribers();
  }

  getPosts() {
    return this.posts;
  }

  incrementCurrentIndex() {
    this.currentPostIndex += 1;
    if (this.currentPostIndex >= this.getPosts().length) {
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

// CommentsManager class
export class CommentsManager extends ActualPublisher implements CommentsModel {
  private modelStatus: ModelStatus = new ModelStatus();
  public commentsMap: Map<number, Comment[]> = new Map();

  getModelStatus() {
    return this.modelStatus.getStatus();
  }

  setModelStatus(status: "available" | "pending" | "failure") {
    this.modelStatus.setStatus(status);
  }

  insertCommentsForPost(comments: Comment[], postId: number): void {
    this.setModelStatus("available");
    this.commentsMap.set(postId, comments);
    this.updateSubscribers();
  }

  getCommentsForPost(postId: number): Comment[] | undefined {
    return this.commentsMap.get(postId);
  }
}
