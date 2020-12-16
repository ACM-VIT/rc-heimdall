export interface AuthToken {
  _id: string;
  name: string;
  email: string;
  googleId: string;
  iat: number;
  exp: number;
}

export interface JwtToken {
  team: {
    id: string;
    name: string;
  };
  participant: {
    googleID: string;
    name: string;
    isAdmin: boolean;
  };
}
