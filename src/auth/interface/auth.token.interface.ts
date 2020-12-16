export interface AuthToken {
  _id: string;
  name: string;
  email: string;
  googleId: string;
  iat: number;
  exp: number;
}
