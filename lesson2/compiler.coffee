midiNumber = (name) ->
    # ascii a = 97
    # a0 = 21
    note = 21 + 97 - name.charCodeAt 0
    octave = 12 * parseInt name[1], 10
    note + octave

exports.compiler = (musexpr) ->
    r = []
    time = 0
    step = (e) ->
        switch e.tag
            when 'seq'
                time = step e.left
                step e.right
            when 'par'
                a = step e.left
                b = step e.right
                Math.max a, b
            when 'note'
                r.push
                    tag: 'note'
                    pitch: midiNumber(e.pitch)
                    start: time
                    dur: e.dur
                time + e.dur
            when 'rest'
                time + e.dur
            when 'repeat'
                for i in [0...e.count]
                    time = step e.section
                time
    step musexpr
    r
