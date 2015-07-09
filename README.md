[![Build Status](https://travis-ci.org/nomilous/in.adapter.json.svg?branch=master)](https://travis-ci.org/nomilous/in.adapter.json)

# in.adapter.json

Json parser for [in.](https://github.com/nomilous/in.)

```javascript
$$in(function(
  packages // in.as.json read {{ $$files('node_modules/*/package.json') }}
){
  console.log(packages.map(function(package) {
    return {
      name: package.name,
      version: package.version
    }
  }));
})
```

```javascript
$$in(function(
  stream // in.as.stream.json $ something that emits json
){
  // stream.on('error' ...
  // stream.on('end' ...
  stream.on('data', function(obj) {

  });
})
```
