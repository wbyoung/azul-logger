# Azul.js Logger

[![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![Code Climate][codeclimate-image]][codeclimate-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][david-image]][david-url] [![devDependencies][david-dev-image]][david-dev-url]

A logging utility for [Azul.js][azul].

```js
require('azul-logger')(db.query);
```

## API

### azulLogger(query, [options])

#### query

Type: `Query`

An Azul.js query object that should be watched for logging. The query and all
queries that are derived from it will have information about them logged.
Usually you'll want this to be your main query instance, `db.query`.

#### options.slow

Type: `Number`  
Default: `500`

Number of milliseconds that should be considered a _slow_ query.

#### options.log

Type: `Function`  
Default: `console.log`

The function that will be called with logging output. This should function the
same way that `console.log` does.


## License

This project is distributed under the MIT license.

[azul]: http://www.azuljs.com/

[travis-image]: http://img.shields.io/travis/wbyoung/azul-logger.svg?style=flat
[travis-url]: http://travis-ci.org/wbyoung/azul-logger
[npm-image]: http://img.shields.io/npm/v/azul-logger.svg?style=flat
[npm-url]: https://npmjs.org/package/azul-logger
[codeclimate-image]: http://img.shields.io/codeclimate/github/wbyoung/azul-logger.svg?style=flat
[codeclimate-url]: https://codeclimate.com/github/wbyoung/azul-logger
[coverage-image]: http://img.shields.io/coveralls/wbyoung/azul-logger.svg?style=flat
[coverage-url]: https://coveralls.io/r/wbyoung/azul-logger
[david-image]: http://img.shields.io/david/wbyoung/azul-logger.svg?style=flat
[david-url]: https://david-dm.org/wbyoung/azul-logger
[david-dev-image]: http://img.shields.io/david/dev/wbyoung/azul-logger.svg?style=flat
[david-dev-url]: https://david-dm.org/wbyoung/azul-logger#info=devDependencies
