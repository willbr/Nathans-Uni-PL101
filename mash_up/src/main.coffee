puts = console.log 
wait = (delay, func) -> setTimeout func, delay

mashup = {}
document.mashup = mashup

compile = (musexpr) ->
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
                    pitch: e.pitch
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

$ ->
    $('#play').click runClick
    mashup.parse = PEG.buildParser(grammer).parse
    return

playNote = (delay, frequency, duration) ->
    wait delay, ->
        puts delay, frequency, duration
        playExample frequency, duration


runClick = ->
    code = $('#code').val()
    ast = mashup.parse code
    list = compile ast
    end = 0
    for note in list
        end = Math.max end, note.start + note.dur
        f = Note.fromLatin(note.pitch).frequency()
        playNote note.start, f, note.dur
    wait end, ->
        puts "fin"
    return
    

`
function playExample(frequency, duration) {
    duration /= 1000;
    var attack, release;
    attack = duration * 0.2;
    release = duration - attack;

    var Synth = function(audiolet) {
        AudioletGroup.apply(this, [audiolet, 0, 1]);
        this.sine = new Sine(this.audiolet, frequency);
        this.modulator = new Saw(this.audiolet, frequency * 2);
        this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2,
                                          frequency);

        this.gain = new Gain(this.audiolet);
        this.envelope = new PercussiveEnvelope(this.audiolet, 1, attack, release,
            function() {
                this.audiolet.scheduler.addRelative(0,
                                                    this.remove.bind(this));
            }.bind(this)
        );

        this.modulator.connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.sine);

        this.envelope.connect(this.gain, 0, 1);
        this.sine.connect(this.gain);

        this.gain.connect(this.outputs[0]);
    };
    extend(Synth, AudioletGroup);

    var AudioletApp = function() {
        this.audiolet = new Audiolet();
        var synth = new Synth(this.audiolet);
        synth.connect(this.audiolet.output);
    };

    AudioletApp();
};
`

makeSound = =>
    f = Note.fromLatin('A4').frequency()
    playExample(440, 1000)
    wait 1000, ->
        playExample(220, 1000)
    wait 1000, ->
        playExample(880, 1000)

grammer = """
start =
    expr

expr = note / seq / par / rest / repeat

_expr = 
    _ e:expr
    {return e;}

note = 
    pitch:pitch _ dur:duration
        {return {tag: "note", pitch:pitch, dur:dur};}
    /
    pitch:pitch
        {return {tag: "note", pitch:pitch, dur:1000};}

pitch = 
    pitch:([a-g][#b]?[1-9][0-9]?)
        {return pitch.join("").toUpperCase();}

duration =
    integer

integer =
    "0"
        {return 0;}
    /
    a:[1-9]b:[0-9]*
        {return parseInt(a+b.join(""), 10);}

seq =
    "[" _ head:expr tail:_expr* _ "]"
    {
        var seq = function (left, right) {
            return {tag: "seq", left:left, right:right};
        };
        var list = [head].concat(tail);
        if (list.length == 1) {
            return head;
        } else {
            var r, right;
            right = list.splice(-1)[0];
            r = seq(list.splice(-1)[0], right);
            while (list.length > 0) {
                r = seq(list.splice(-1)[0], r);
            }
            return r;
        }
    }

par = 
    "(" _ head:note_or_par tail:_note_or_par* _ ")"
    {
        var par = function (left, right) {
            return {tag: "par", left:left, right:right};
        };
        var list = [head].concat(tail);
        if (list.length == 1) {
            return head;
        } else {
            var r, right;
            right = list.splice(-1)[0];
            r = par(list.splice(-1)[0], right);
            while (list.length > 0) {
                r = par(list.splice(-1)[0], r);
            }
            return r;
        }
    }

rest =
    "." _ dur:integer
    {return {tag:"rest", dur:dur};}

repeat = 
    ":" _ count:integer _ section:expr
    {return {tag:"repeat", section:section, count:count};}

note_or_par =
    note / par

_note_or_par = 
    _ e:note_or_par
        {return e;}
_ =
    whitespace*

whitespace =
    [ \\t\\n]
"""

