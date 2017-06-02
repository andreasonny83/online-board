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
