PEG = require 'pegjs'
puts = console.log

data = """
start =
    expression

expression = integer / atom / list / quote

integer = 
    _ chars:[0-9]+ _
        { return parseInt(chars.join(""), 10); }

atom =
    _ chars:validchar+ _
        { return chars.join(""); }

validchar
    = [0-9a-zA-Z_?!+\-=@#$%^&*/.]

list =
    _ "(" _ a:expression b:whitespace_expression* _ ")" _
        {return [a].concat(b);}

_ = 
    (whitespace / comment)*

whitespace =
    [ \\t\\n]

comment = 
    ";;" [^\\n]* "\\n"
        {return;}

whitespace_expression =
    _ a:expression
        {return a;}

quote =
    "'" a:expression
        {return ["quote", a];}

"""
parser = PEG.buildParser(data).parse


if typeof module != 'undefined'
    module.exports.parser = parser

