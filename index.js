EventEmitter = require('events').EventEmitter;

module.exports = $$in.adapters.json = function(opts, inArgs, arg, results) {

  var isStream = results[0].adapters.indexOf('stream') >= 0;
  var isBuffer = results[0].adapters.indexOf('buffer') >= 0;

  if (isBuffer) return;

  results.forEach(function(action) {
    if (typeof action.value === 'undefined') return;
    if (isStream) return handleStream(action);

    try {
      action.value = JSON.parse(action.value);
    } catch (e) {
      e.message += ' (' + action + ')'
      throw e
    }
  });
}

function handleStream(action) {

  var inmitter = action.value;
  var outmitter = new EventEmitter();
  var buf = '';
  var depth = 0;

  action.value = outmitter;

  inmitter.on('error', function(e) {
    if (outmitter.listeners('error').length > 0) outmitter.emit('error', e)
    else console.error(e.toString());
  });

  inmitter.on('end', function() {
    outmitter.emit('end');
  });

  inmitter.on('data', function(data) {
    // TODO: this'll be a bit slow, 
    //       option to set delimiter, 
    //       option to set one obj per emit
    for (var i = 0; i < data.length; i++) {
      buf += data[i];
      switch (data[i]) {
        case '{':
          depth++;
          break;
        case '[':
          depth++;
          break;
        case '}':
          depth--;
          break;
        case ']':
          depth--;
          break;
      }
      if (depth == 0) {
        try {
          buf = buf.trim();
          if (buf !== '') outmitter.emit('data', JSON.parse(buf));
        } catch (e) {
          e.message += ' (' + action + ')';
          if (outmitter.listeners('error').length > 0) outmitter.emit('error', e)
          else console.error(e.toString());
        }
        buf = '';
      } else if (depth < 0) {
        depth = 0;
        buf = '';
      }
    }
  });
}