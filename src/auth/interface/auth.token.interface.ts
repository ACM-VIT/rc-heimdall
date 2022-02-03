export interface AuthToken {
  _id: string;
  name: string;
  email: string;
  googleID: string;
  iat: number;
  exp: number;
}

export interface JwtToken {
  // team: {
  //   id: number;
  //   name: string;
  // };
  participant: {
    id: string;
    googleID: string;
    name: string;
    isAdmin: boolean;
    team_id: number;
  };
}
