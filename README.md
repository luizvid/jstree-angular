# jsTree-Angular

jsTree-Angular is a way to work with jQuery jsTree along with Angular and enjoy all the features jsTree offers.

See [jsTree](http://www.jstree.com/) for more information about jsTree - jQuery plugin.


# The jQuery jsTree

[jsTree](http://www.jstree.com/) is jquery plugin, that provides interactive trees. It is absolutely free, [open source](https://github.com/vakata/jstree) and distributed under the MIT license.

jsTree is easily extendable, themable and configurable, it supports HTML & JSON data sources, AJAX & async callback loading.

jsTree functions properly in either box-model (content-box or border-box), can be loaded as an AMD module, and has a built in mobile theme for responsive design, that can easily be customized. It uses jQuery's event system, so binding callbacks on various events in the tree is familiar and easy.


## Features

At the time, it's offers just a minimal to use.
* Working with drag´nd´drop plugin very well.
* Search plugin working fine.
* Accepts JSON data format.
 

## Coming soon...

* All configurations in handy.
* All plugins from jQuery jsTree - configurable.
* All ways to work with data.


## Quick start

### Include all neccessary files
To get started you need 4 things in your page:
 1. jQuery (anything above 1.9.1 will work)
 2. A jstree theme (there is only one theme supplied by default)
 3. The jstree source file or just use jstree-angular.pack.min.js
 4. The jstree-angular.js source file or just use jstree-angular.pack.min.js

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jstree/3.0.9/themes/default/style.min.css" />

<!-- jQuery must be loaded first -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<!-- if jQuery CDN not loaded -->
<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.8.0.min.js"><\/script>')</script>
<!-- Than load Angularjs -->
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.22/angular.min.js"></script>
<!-- if Angularjs CDN not loaded -->
<script>(typeof angular != 'undefined') || document.write('<script src="js/vendor/angular.min.js")<\/script>')</script>

<script src="/js/vendor/jstree-angular.pack.min.js"></script>
```

### Sample

See jsfiddle soon.


## Browser support

* Chrome *(latest 4)*
* Firefox *(latest 3)*


## Contributing

If you decide to get involved, please take a moment to review
the [guidelines](CONTRIBUTING.md):

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)


## jsTree-Angular License

The code is available under the [MIT license](LICENSE.txt).


## jsTree License

Copyright (c) 2014 Ivan Bozhanov (http://vakata.com)
Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php).