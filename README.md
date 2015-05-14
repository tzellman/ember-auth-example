# ember-auth-example

This is an example ember app that demonstrates using the following:

* ember / ember-cli (w/pods)
* [ember-simple-auth](https://github.com/simplabs/ember-simple-auth/)
* [waterline](https://github.com/simplabs/ember-simple-auth/)
* [waterline](https://github.com/balderdashy/waterline)
* [bootstrap-sass](https://github.com/twbs/bootstrap-sass)

It is inspired by one of the ember-simple-auth [examples](https://github.com/simplabs/ember-simple-auth/blob/master/examples/1-simple.html).

I added Sass and waterline for fun.

This took about 30 minutes of time to create, granted I was able to copy most of the view/template code
from the example I linked to above.

I will post the steps I took to create this app, just to show how easy it is to do so.

## Installation

* `git clone git@github.com:tzellman/ember-auth-example.git` this repository
* cd ember-auth-example
* `npm install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).


## How I created this app

First off, I highly suggest using tmux - it makes it very easy to keep your server running while running
Ember CLI commands. (end plug)

* Make sure you have ember-cli installed:

```npm install -g ember-cli```

* Create the app structure

```
ember new ember-auth-example
cd ember-auth-example
```

* Add some dependencies

```
npm install --save-dev broccoli-sass ember-cli-simple-auth
bower install --save bootstrap-sass ember-simple-auth
```

* Move app.css to app.scss

Since I want to use Sass, this is required.

```
mv app/styles/app.css app/styles/app.scss
```

* Start the server!
At this point, you can start the server up.

```
ember serve
```

* Generate some structure

```
ember g -p route application
ember g -p route application
ember g -p route protected
ember g -p route login
ember g -p controller login
ember g -p template index
ember g initializer inject-auth
ember g -p adapter application
ember g server
```

* Add dependencies for our server

```
npm install --save-dev waterline sails-disk body-parser bcrypt method-override express
```

* Write code!
 
At this point, most of the structure has been generated for you.
Now is when you set down your coffee cup, open up your favorite editor and start wailing on the keyboard.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)