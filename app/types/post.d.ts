type ThreadCategory = "Thread" | "QNA"

type User = {
  userName: string,
  password: string,  
  email: string,
  
}

type Thread =  {
  id: string;
	title: string;
	category: ThreadCategory;
	creationDate: string;
	description: string;
	creator: User;
  comments: ThreadComment[];
  locked: boolean;
}

type QNAThread = Thread & {
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: string;
}

type ThreadComment = {
  id: string;
  thread: string;
  content: string;
  creator: User;
  isChecked: boolean;
}