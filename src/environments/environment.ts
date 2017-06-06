const pkg = require('../../package.json');

export const environment = {
  production: false,
  version: pkg.version,
  homepage: pkg.homepage,
  EMAIL_API_URL: 'https://node-mailsender.herokuapp.com/send',
};
