import * as pkg from '../../package.json';

export const environment = {
  production: true,
  version: pkg.version,
  homepage: pkg.homepage,
  EMAIL_API_URL: 'https://node-mailsender.herokuapp.com/send',
};
