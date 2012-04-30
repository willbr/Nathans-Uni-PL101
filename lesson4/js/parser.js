(function() {
  var PEG, data, parser;

  if (typeof module !== "undefined" && module !== null) PEG = require('pegjs');

  data = "start =\n    e:expression+\n    {\n        if (e.length === 1) {\n            return e[0];\n        } else {\n            e.unshift(\"begin\");\n            return e;\n        }\n    }\n\nexpression = integer / atom / list / quote\n\ninteger = \n    _ chars:[0-9]+ _\n        { return parseInt(chars.join(\"\"), 10); }\n\natom =\n    _ chars:validchar+ _\n        { return chars.join(\"\"); }\n\nvalidchar\n    = [0-9a-zA-Z_?!+\-=@#$%^&*/.]\n\nlist =\n    _ \"(\" _ a:expression? b:whitespace_expression* _ \")\" _\n        {\n            return a === \"\" ? [] : [a].concat(b);\n        }\n\n_ = \n    (whitespace / comment)*\n\nwhitespace =\n    [ \\t\\n]\n\ncomment = \n    \";;\" [^\\n]* \"\\n\"\n        {return;}\n\nwhitespace_expression =\n    _ a:expression\n        {return a;}\n\nquote =\n    \"'\" a:expression\n        {return [\"quote\", a];}\n    /\n    \"quote\" _+ a:expression\n        {return [\"quote\", a];}";

  if (typeof module !== "undefined" && module !== null) {
    parser = PEG.buildParser(data).parse;
  } else {
    $(function() {
      return document.grammer = data;
    });
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports.parser = parser;
  }

}).call(this);
