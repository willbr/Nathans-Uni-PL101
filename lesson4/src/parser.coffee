if module?
    PEG = require 'pegjs'

data = """
start =
    e:expression+
    {
        if (e.length === 1) {
            return e[0];
        } else {
            e.unshift("begin");
            return e;
        }
    }

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
    _ "(" _ a:expression? b:whitespace_expression* _ ")" _
        {
            return a === "" ? [] : [a].concat(b);
        }

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
    /
    "quote" _+ a:expression
        {return ["quote", a];}
"""

if module?
    parser = PEG.buildParser(data).parse
else
    $ ->
        document.grammer = data



if module?
    module.exports.parser = parser

