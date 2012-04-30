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
        $('#result').text(JSON.stringify(r));
        return $('#env').text(JSON.stringify(document.env));
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
    $('#code').val(";;This is my Scheem Toy test for http://nathansuniversity.com\n\n(define four (car '(4 5 6 7)))\n\n(define ten (begin\n           (define six 6)\n           (+ four six)))\n\n(if (= ten 10)\n    'its_ten\n    'its_not_ten)");
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
    runCode();
  });

}).call(this);
