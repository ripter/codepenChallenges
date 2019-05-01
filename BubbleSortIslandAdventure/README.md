# Bubble Sort Island Adventure

# Architecture

* `actions/`
  * Actions take state, and return a promise.
  * `(state) => Promise`
  * Starts/Stops animations.
  * Updates states.
* `animations/`
  * returns a promise.
  * Runs animation and resolves promise when it completes.
* `views/`
  * Render functions to update the DOM based on state
