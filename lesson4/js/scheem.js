(function() {
  var clone, evalScheem, evalScheemString, expect, lambda, parser;

  if (typeof module !== "undefined" && module !== null) {
    parser = require('./parser').parser;
    expect = require('chai').expect;
  }

  clone = function(obj) {
    var flags, key, newInstance;
    if (!(obj != null) || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) flags += g;
      if (obj.ignoreCase != null) flags += i;
      if (obj.multiline != null) flags += m;
      if (obj.sticky != null) flags += y;
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = clone(obj[key]);
    }
    return newInstance;
  };

  lambda = function(args, code, env) {
    var func;
    func = function() {
      var i, _ref;
      for (i = 0, _ref = args.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        env[args[i]] = arguments[i];
      }
      return evalScheem(code, env);
    };
    func.args = args;
    func.code = code;
    return func;
  };

  evalScheemString = function(s, env) {
    var ast;
    ast = parser(s);
    return evalScheem(ast, env);
  };

  evalScheem = function(expr, env) {
    var a, e, head, proc, q, r, tail, _i, _len, _ref;
    switch (typeof expr) {
      case 'number':
        return expr;
      case 'string':
        return env[expr];
    }
    switch (expr[0]) {
      case '=':
        q = evalScheem(expr[1], env) === evalScheem(expr[2], env);
        if (q) {
          return '#t';
        } else {
          return '#f';
        }
      case '!=':
        q = evalScheem(expr[1], env) !== evalScheem(expr[2], env);
        if (q) {
          return '#t';
        } else {
          return '#f';
        }
      case '+':
        return evalScheem(expr[1], env) + evalScheem(expr[2], env);
      case '-':
        return evalScheem(expr[1], env) - evalScheem(expr[2], env);
      case '*':
        return evalScheem(expr[1], env) * evalScheem(expr[2], env);
      case '/':
        return evalScheem(expr[1], env) / evalScheem(expr[2], env);
      case '<':
        q = evalScheem(expr[1], env) < evalScheem(expr[2], env);
        if (q) {
          return '#t';
        } else {
          return '#f';
        }
      case '>':
        q = evalScheem(expr[1], env) > evalScheem(expr[2], env);
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
      case 'lambda':
        return lambda(expr[1], expr[2], env);
      default:
        proc = expr[0];
        tail = clone(expr);
        tail.shift();
        return (_ref = env[proc]) != null ? _ref.apply(null, (function() {
          var _j, _len2, _results;
          _results = [];
          for (_j = 0, _len2 = tail.length; _j < _len2; _j++) {
            a = tail[_j];
            _results.push(evalScheem(a, env));
          }
          return _results;
        })()) : void 0;
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
