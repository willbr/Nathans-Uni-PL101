PEG = require('pegjs')
assert = require('assert')
fs = require('fs')
util = require 'util'
puts = console.log

data = fs.readFileSync('homework.peg', 'utf-8')
parse = PEG.buildParser(data).parse

note = (pitch, dur) ->
    dur ?= 100
    tag: "note"
    pitch:pitch
    dur:dur

seq = (left, right) ->
    tag: "seq"
    left:left
    right:right

par = (left, right) ->
    tag: "par"
    left:left
    right:right

rest = (dur) ->
    tag: "rest"
    dur: dur

repeat = (count, section) ->
    tag: "repeat"
    section: section
    count: count

tests = [
    ["a4 250", note("a4", 250)]
    ["a4", note("a4", 100)]
    ["(c4 250 c5 250)", par(note("c4", 250), note("c5", 250))]
    ["(c4 250 c5 250 c6 250)", par(note("c4", 250), par(note("c5", 250), note("c6", 250)))]
    ["( c4 250 ( e4 250 g4 250))", par(note("c4", 250), par(note("e4", 250), note("g4", 250)))]
    [". 100", rest(100)]
    ["[. 100 a4 250]", seq(rest(100), note("a4", 250))]
    [":3 a4", repeat(3, note("a4"))]
    [":3a4", repeat(3, note("a4"))]
    ["[a4]", note("a4")]
    ["[a4 a5]", seq(note("a4"), note("a5"))]
    ["[a4 a5 a6]", seq(note("a4"), seq(note("a5"), note("a6")))]
    ["[a4 [a4 a5]]", seq(note("a4"), seq(note("a4"), note("a5")))]
    ["(a4 a5 a6)", par(note("a4"), par(note("a5"), note("a6")))]
    ]

pass = 0
fail = 0
for test in tests
    try
        result = parse(test[0])
        #puts "#{util.inspect test[0]} => #{util.inspect result}"
        assert.deepEqual result, test[1]
        pass += 1
    catch error
        fail += 1
        puts util.inspect(test[0]) + " => " + error
    
puts ""
puts "pass: " + pass
puts "fail: " + fail

puts util.inspect parse(":3[.100 a4 a5 (c4 c5 c6)]"), true, null
