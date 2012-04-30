(function() {
  var evalScheem, evalScheemString, expect, parser;

  if (typeof module !== "undefined" && module !== null) {
    parser = require('./parser').parser;
    expect = require('chai').expect;
  }

  evalScheemString = function(s, env) {
    return evalScheem(parser(s), env);
  };

  evalScheem = function(expr, env) {
    var e, head, q, r, tail, _i, _len;
    if (typeof expr === 'number') return expr;
    if (typeof expr === 'string') return env[expr];
    switch (expr[0]) {
      case '=':
        q = evalScheem(expr[1], env) === evalScheem(expr[2], env);
        if (q) {
          return '#t';
        } else {
          return '#f';
        }
      case '+':
        return evalScheem(expr[1], env) + evalScheem(expr[2], env);
      case '*':
        return evalScheem(expr[1], env) * evalScheem(expr[2], env);
      case '<':
        q = evalScheem(expr[1], env) < evalScheem(expr[2], env);
        if (q) {
          return '#t';
        } else {
          return '#f';
        }
      case 'if':
        q = evalScheem(expr[1], env);
        if (q === '#t') {
          return evalScheem(expr[2], env);
        } else {
          return evalScheem(expr[3], env);
        }
        break;
      case 'quote':
        return expr[1];
      case 'define':
        env[expr[1]] = evalScheem(expr[2], env);
        return 0;
      case 'begin':
        expr.shift();
        for (_i = 0, _len = expr.length; _i < _len; _i++) {
          e = expr[_i];
          r = evalScheem(e, env);
        }
        return r;
      case 'car':
        return evalScheem(expr[1], env)[0];
      case 'cdr':
        r = evalScheem(expr[1], env);
        r.shift();
        return r;
      case 'cons':
        head = evalScheem(expr[1], env);
        tail = evalScheem(expr[2], env);
        tail.unshift(head);
        return tail;
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports.evalScheem = evalScheem;
    module.exports.parser = parser;
    module.exports.evalScheemString = evalScheemString;
  }

  if (typeof document !== "undefined" && document !== null) {
    document.evalScheem = evalScheem;
  }

}).call(this);
