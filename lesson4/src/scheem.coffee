todo = """
Numbers
Variable references
begin
quote
=
<
cons
car
cdr
if
"""

evalScheem = (expr, env) ->
    # Numbers evaluate to themselves
    if typeof expr == 'number'
        return expr
    # Look at head of list for operation
    switch expr[0]
        when '+'
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env)
        when 'quote'
            return expr[1]

# If we are used as Node module, export evalScheem
if typeof module != 'undefined'
    module.exports.evalScheem = evalScheem

