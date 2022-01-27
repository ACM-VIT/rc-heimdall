import * as config from 'config';

export const oldJWTConstants = {
  secret: 'supersecretdaksh@>231asd',
};

export const newJWTConstants = {
  secret: config.get('jwt.secret'),
  expiresIn: config.get('jwt.expires'),
  issuer: config.get('jwt.issuer'),
};
