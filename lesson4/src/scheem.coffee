if module?
    parser = require('./parser').parser
    expect = require('chai').expect

evalScheemString = (s, env) ->
    return evalScheem parser(s), env

evalScheem = (expr, env) ->
    # Numbers evaluate to themselves
    if typeof expr == 'number'
        return expr
    if typeof expr == 'string'
        return env[expr]
    # Look at head of list for operation
    switch expr[0]
        when '='
            q = evalScheem(expr[1], env) == evalScheem(expr[2], env)
            return if q then '#t' else '#f'
        when '+'
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env)
        when '*'
            return evalScheem(expr[1], env) *
                   evalScheem(expr[2], env)
        when '<'
            q = evalScheem(expr[1], env) < evalScheem(expr[2], env)
            return if q then '#t' else '#f'
        when 'if'
            q = evalScheem(expr[1], env)
            if q == '#t'
                return evalScheem expr[2], env
            else
                return evalScheem expr[3], env


        when 'quote'
            return expr[1]
        when 'define'
            env[expr[1]] = evalScheem expr[2], env
            return 0
        when 'begin'
            expr.shift()
            for e in expr
                r = evalScheem e, env
            return r
        when 'car'
            return evalScheem(expr[1], env)[0]
        when 'cdr'
            r = evalScheem(expr[1], env)
            r.shift()
            return r
        when 'cons'
            head = evalScheem expr[1], env
            tail = evalScheem expr[2], env
            tail.unshift head
            return tail

if module?
    module.exports.evalScheem = evalScheem
    module.exports.parser = parser
    module.exports.evalScheemString = evalScheemString

if document?
    document.evalScheem = evalScheem

