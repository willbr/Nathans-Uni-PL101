compiler = require './compiler'

melody_mus = 
    tag: 'seq'
    left:
        tag: 'seq'
        left:
            tag: 'seq'
            left:
                tag: 'note'
                pitch: 'a4'
                dur: 250
            right:
                tag: 'rest'
                dur: 250
        right:
            tag: 'par'
            left:
                tag: 'note'
                pitch: 'b4'
                dur: 250
            right:
                tag: 'note'
                pitch: 'b3'
                dur: 500
    right:
        tag: 'seq'
        left:
            tag: 'note'
            pitch: 'c4'
            dur: 500
        right:
            tag: 'repeat'
            section:
                tag: 'note'
                pitch: 'd4'
                dur: 500
            count: 3

console.log compiler.compiler melody_mus
