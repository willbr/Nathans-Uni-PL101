PEG = require('pegjs')
assert = require('assert')
fs = require('fs')
util = require 'util'
puts = console.log

data = fs.readFileSync('homework.peg', 'utf-8')
#console.log(data)
parse = PEG.buildParser(data).parse

tests = [
    ["(a b c)", ["a", "b", "c"]]
    ["a", "a"]
    [" a", "a"]
    ["a ", "a"]
    ["(a\n b c)", ["a", "b", "c"]]
    ["( a  b  c )", ["a", "b", "c"]]
    [" ( a  b  c )", ["a", "b", "c"]]
    [" ( a  b  c ) ", ["a", "b", "c"]]
    ["(a (b c))", ["a", ["b", "c"]]]
    ["'(1 2 3)", ["quote", ["1", "2", "3"]]]
    ["'x", ["quote", "x"]]
    ["(a\n;;weird\nb c)", ["a", "b", "c"]]
    ]

for test in tests
    try
        result = parse(test[0])
        puts "#{util.inspect test[0]} => #{util.inspect result}"
        assert.deepEqual result, test[1]
    catch error
        puts util.inspect(test[0]) + " => " + error
    

