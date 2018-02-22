# Hedron

Perform live shows your three.js creations.

## Quick start

1. Make sure [Node.js](https://nodejs.org/en/) is installed on your machine.
2. Clone/download the repo and navigate to the root directory in terminal.
3. Run `yarn` to install dependencies.
4. Launch Hedron in dev mode with `yarn start`.

## dev.config.js

You can get extra functionality by adding `dev.config.js` to `/config`.

```javascript
// config/dev.config.js
module.exports = {
  defaultProject: false
}
```

Setting `defaultProject` to the path of a saved project (e.g. `/Users/alex/Desktop/foo.json`) can help improve your workflow when developing:
* The project will load automatically on load/restart
* The project sketches folder will be watched for changes, triggering a restart

## Scripts

Package the app with `yarn dist`.

To quickly run a production build without packaging, run `yarn dist:dev`. Behaves similarly to `yarn start` in that it will look for a default project and open Chrome DevTools automatically. However it will not do any sort of live refreshing.

Run tests with `yarn test:dev`.
