if module?
    parser = require('./parser').parser
    expect = require('chai').expect


#CoffeeScript Cookbook
clone = (obj) ->
    if not obj? or typeof obj isnt 'object'
        return obj

    if obj instanceof Date
        return new Date(obj.getTime())

    if obj instanceof RegExp
        flags = ''
        flags += g if obj.global?
        flags += i if obj.ignoreCase?
        flags += m if obj.multiline?
        flags += y if obj.sticky?
        return new RegExp(obj.source, flags)

    newInstance = new obj.constructor()

    for key of obj
        newInstance[key] = clone obj[key]

    return newInstance


lambda = (args, code, env) ->
    func = ->
        for i in [0...args.length]
            env[args[i]] = arguments[i]
        evalScheem code, env
    func.args = args
    func.code = code
    return func


evalScheemString = (s, env) ->
    ast = parser s
    return evalScheem ast, env


evalScheem = (expr, env) ->
    # Numbers evaluate to themselves
    switch typeof(expr)
        when 'number'
            return expr
        when 'string'
            return env[expr]
    # Look at head of list for operation
    switch expr[0]
        when '='
            q = evalScheem(expr[1], env) == evalScheem(expr[2], env)
            return if q then '#t' else '#f'
        when '!='
            q = evalScheem(expr[1], env) != evalScheem(expr[2], env)
            return if q then '#t' else '#f'
        when '+'
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env)
        when '-'
            return evalScheem(expr[1], env) -
                   evalScheem(expr[2], env)
        when '*'
            return evalScheem(expr[1], env) *
                   evalScheem(expr[2], env)
        when '/'
            return evalScheem(expr[1], env) /
                   evalScheem(expr[2], env)
        when '<'
            q = evalScheem(expr[1], env) < evalScheem(expr[2], env)
            return if q then '#t' else '#f'
        when '>'
            q = evalScheem(expr[1], env) > evalScheem(expr[2], env)
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
        when 'lambda'
            return lambda expr[1], expr[2], env
        else
            proc = expr[0]
            tail = clone expr
            tail.shift()
            return env[proc]?.apply null, (evalScheem a, env for a in tail)


if module?
    module.exports.evalScheem = evalScheem
    module.exports.parser = parser
    module.exports.evalScheemString = evalScheemString

if document?
    document.evalScheem = evalScheem

