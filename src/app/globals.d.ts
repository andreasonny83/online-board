interface IPackage {
  name: string;
  version: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

interface IUserRegister {
  email: string;
  password: string;
  passwordConfirm: string;
  displayName: string;
}

interface IUserInfo {
  uid: string;
  email: string;
  name: string;
  lastLogIn: number;
  boards?: any;
}

interface IMailSender {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface IBoardObj {
  readonly name: string;
  readonly cols: IBoradCol[];

  members: { [key: string]: boolean };
  invites?: { [key: string]: IBoardInvite } | null;
  posts?: { [key: string]: IBoardPost } | null;
}

interface IBoradCol {
  color: string;
  icon: string;
  pos: number;
  title: string;
}

interface IBoardInvite {
  email: string
}

interface IBoardPost {
  author: string;
  authorUID: string;
  col: number;
  val: string;
}
