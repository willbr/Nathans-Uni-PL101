(function() {
  var compile, grammer, makeSound, mashup, playNote, puts, runClick, wait,
    _this = this;

  puts = console.log;

  wait = function(delay, func) {
    return setTimeout(func, delay);
  };

  mashup = {};

  document.mashup = mashup;

  compile = function(musexpr) {
    var r, step, time;
    r = [];
    time = 0;
    step = function(e) {
      var a, b, i, _ref;
      switch (e.tag) {
        case 'seq':
          time = step(e.left);
          return step(e.right);
        case 'par':
          a = step(e.left);
          b = step(e.right);
          return Math.max(a, b);
        case 'note':
          r.push({
            tag: 'note',
            pitch: e.pitch,
            start: time,
            dur: e.dur
          });
          return time + e.dur;
        case 'rest':
          return time + e.dur;
        case 'repeat':
          for (i = 0, _ref = e.count; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
            time = step(e.section);
          }
          return time;
      }
    };
    step(musexpr);
    return r;
  };

  $(function() {
    $('#play').click(runClick);
    mashup.parse = PEG.buildParser(grammer).parse;
  });

  playNote = function(delay, frequency, duration) {
    return wait(delay, function() {
      puts(delay, frequency, duration);
      return playExample(frequency, duration);
    });
  };

  runClick = function() {
    var ast, code, end, f, list, note, _i, _len;
    code = $('#code').val();
    ast = mashup.parse(code);
    list = compile(ast);
    end = 0;
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      note = list[_i];
      end = Math.max(end, note.start + note.dur);
      f = Note.fromLatin(note.pitch).frequency();
      playNote(note.start, f, note.dur);
    }
    wait(end, function() {
      return puts("fin");
    });
  };

  
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
;

  makeSound = function() {
    var f;
    f = Note.fromLatin('A4').frequency();
    playExample(440, 1000);
    wait(1000, function() {
      return playExample(220, 1000);
    });
    return wait(1000, function() {
      return playExample(880, 1000);
    });
  };

  grammer = "start =\n    expr\n\nexpr = note / seq / par / rest / repeat\n\n_expr = \n    _ e:expr\n    {return e;}\n\nnote = \n    pitch:pitch _ dur:duration\n        {return {tag: \"note\", pitch:pitch, dur:dur};}\n    /\n    pitch:pitch\n        {return {tag: \"note\", pitch:pitch, dur:1000};}\n\npitch = \n    pitch:([a-g][#b]?[1-9][0-9]?)\n        {return pitch.join(\"\").toUpperCase();}\n\nduration =\n    integer\n\ninteger =\n    \"0\"\n        {return 0;}\n    /\n    a:[1-9]b:[0-9]*\n        {return parseInt(a+b.join(\"\"), 10);}\n\nseq =\n    \"[\" _ head:expr tail:_expr* _ \"]\"\n    {\n        var seq = function (left, right) {\n            return {tag: \"seq\", left:left, right:right};\n        };\n        var list = [head].concat(tail);\n        if (list.length == 1) {\n            return head;\n        } else {\n            var r, right;\n            right = list.splice(-1)[0];\n            r = seq(list.splice(-1)[0], right);\n            while (list.length > 0) {\n                r = seq(list.splice(-1)[0], r);\n            }\n            return r;\n        }\n    }\n\npar = \n    \"(\" _ head:note_or_par tail:_note_or_par* _ \")\"\n    {\n        var par = function (left, right) {\n            return {tag: \"par\", left:left, right:right};\n        };\n        var list = [head].concat(tail);\n        if (list.length == 1) {\n            return head;\n        } else {\n            var r, right;\n            right = list.splice(-1)[0];\n            r = par(list.splice(-1)[0], right);\n            while (list.length > 0) {\n                r = par(list.splice(-1)[0], r);\n            }\n            return r;\n        }\n    }\n\nrest =\n    \".\" _ dur:integer\n    {return {tag:\"rest\", dur:dur};}\n\nrepeat = \n    \":\" _ count:integer _ section:expr\n    {return {tag:\"repeat\", section:section, count:count};}\n\nnote_or_par =\n    note / par\n\n_note_or_par = \n    _ e:note_or_par\n        {return e;}\n_ =\n    whitespace*\n\nwhitespace =\n    [ \\t\\n]";

}).call(this);
