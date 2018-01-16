# Hedron

Perform live shows your three.js creations.

## Dev setup

Once you've cloned the repo locally, install dependencies with:

`yarn`

You'll then need to add `dev.config.js` to `/config`.

```javascript
// config/dev.config.js
module.exports = {
  defaultProject: false
}
```

Setting `defaultProject` to the path of a saved project (e.g. `/Users/alex/Desktop/foo.json`) will mean that Hedron will restart every time changes are made to the sketches folder of that project. This can be useful when developing content.

Start development with:

`yarn start`

Run tests with:

`yarn test:dev`
