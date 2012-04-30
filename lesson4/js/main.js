(function() {
  var runCode;

  runCode = function() {
    var ast, data, r;
    data = document.myCodeMirror.getValue();
    try {
      ast = document.parse(data);
      console.log(ast);
      $('#ast').text(JSON.stringify(ast));
      try {
        r = document.evalScheem(ast, document.env);
        console.log(r);
        return $('#result').text(r);
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
    $('#code').val("(define a (+ 5 5))\n(if (= a 10)\n    'omg_its_ten\n    (cdr '(10 11 12)))");
    document.myCodeMirror = CodeMirror.fromTextArea(document.getElementById('code'), {
      mode: "scheme",
      lineNumbers: true,
      indentUnit: 4,
      autofocus: true,
      extraKeys: {
        "Ctrl-Enter": runCode
      }
    });
    console.log('main ready');
    $('#runButton').click(runCode);
  });

}).call(this);
