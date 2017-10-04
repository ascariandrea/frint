'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialCode = '// import\nconst { createApp } = Frint;\nconst { render } = FrintReact;\n\n// component\nclass Root extends React.Component {\n  render() {\n    return <p>Hello World</p>;\n  }\n}\n\n// App\nconst App = createApp({\n  name: \'MyTestApp\',\n  providers: [\n    {\n      name: \'component\',\n      useValue: Root\n    }\n  ]\n});\n\n// render\nconst app = new App();\nrender(app, document.getElementById(\'root\'));';

// editor
var editor = ace.edit('editor');
editor.setTheme('ace/theme/chrome');
editor.getSession().setMode('ace/mode/javascript');
editor.getSession().setTabSize(4);
editor.getSession().setUseSoftTabs(true);
editor.setShowPrintMargin(false);

function renderToRoot() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));

  var input = editor.getValue();

  try {
    var output = Babel.transform(input, {
      presets: ['es2015', 'react']
    }).code;

    eval(output);
    updateUrlHash(input);
  } catch (error) {
    throw error;
  }
}

function parseHashParams(hash) {
  var params = hash.split('#?')[1];

  if (!params) {
    return {};
  }

  return params.split('&').map(function (item) {
    var kv = item.split('=');
    var key = kv[0];
    var value = kv[1];
    return _defineProperty({}, key, value);
  }).reduce(function (acc, val) {
    return Object.assign({}, acc, val);
  }, {});
}

function updateUrlHash() {
  var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  var currentHashParams = parseHashParams(location.hash);
  currentHashParams.code = escape(code);

  var stringifiedParams = Object.keys(currentHashParams).map(function (key) {
    return key + '=' + currentHashParams[key];
  }).join('&');

  if (history.pushState) {
    history.pushState(null, null, '#?' + stringifiedParams);
  }
}

(function () {
  // get code from URL on first page-load
  var parsedParams = parseHashParams(location.hash);
  if (typeof parsedParams.code !== 'undefined') {
    editor.setValue(unescape(parsedParams.code));
  } else {
    editor.setValue(initialCode);
  }

  // re-render on changes
  editor.getSession().on('change', _.debounce(function (e) {
    renderToRoot();
  }, 300));

  // initial render
  renderToRoot();
})();