(function() {
  var escape, runCode, stringify;

  stringify = function(x) {
    return JSON.stringify(x, escape, " ");
  };

  escape = function(k, v) {
    var type;
    type = typeof v;
    switch (type) {
      case "function":
        return 'lambda';
      default:
        return v;
    }
    return v;
  };

  runCode = function() {
    var ast, data, r;
    data = document.myCodeMirror.getValue();
    try {
      ast = document.parse(data);
      $('#ast').text(stringify(ast));
      try {
        r = document.evalScheem(ast, document.env);
        $('#result').text(stringify(r));
        return $('#env').text(stringify(document.env));
      } catch (error) {
        return $('#result').text('eval failed ' + error);
      }
    } catch (error) {
      $('#ast').text('ast failed ' + error);
      return $('#result').text('None');
    }
  };

  $(function() {
    document.env = {};
    document.parse = PEG.buildParser(document.grammer).parse;
    $('#code').val(";;This is my Scheem Toy test for http://nathansuniversity.com\n\n(define factorial (lambda (n)\n                    (if (= n 1)\n                        1\n                        (* n (factorial (- n 1))))))\n(factorial 6)");
    document.myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
      mode: "scheme",
      lineNumbers: true,
      indentUnit: 4,
      autofocus: true,
      extraKeys: {
        "Ctrl-Enter": runCode
      }
    });
    $('#runButton').click(runCode);
    runCode();
  });

}).call(this);
