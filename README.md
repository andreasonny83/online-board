# Online Board

## Note

If you are updating from a version <= 0.1.0, you must reinstall all the
npm dependencies with:

```sh
$ npm cache clean
$ npm install

# Or using Yarn

$ yarn upgrade
```

## Prerequisites

The project has dependencies that require Node 6.9.0 or higher, together
with NPM 3 or higher.

## Development server

Run `npm start` for a dev server.
Navigate to `http://localhost:4200/`.
The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project.
The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Firebase

### Prerequisites

1. Create a free Firebase account at https://firebase.google.com
1. Create a project from your [Firebase account console](https://console.firebase.google.com)
1. Configure the authentication providers for your Firebase project from your Firebase account console

### Configure this app with your project-specific details

```javascript
// .firebaserc

{
  "projects": {
    "default": "your-project-id"
  }
}
```

```javascript
// src/firebase/index.ts

const firebaseConfig = {
  apiKey: 'your api key',
  authDomain: 'your-project-id.firebaseapp.com',
  databaseURL: 'https://your-project-id.firebaseio.com',
  storageBucket: 'your-project-id.appspot.com'
};
```

### Install firebase-tools

```sh
$ npm install -g firebase-tools
```

### Build and deploy the app

```sh
$ npm run build
$ firebase login
$ firebase use default
$ firebase deploy
```
