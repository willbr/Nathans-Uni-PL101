if (typeof module !== 'undefined') {
    // In Node load required modules
    var assert = require('chai').assert;
    var scheem = require('../js/scheem');
    var evalScheemString = scheem.evalScheemString;
    var evalScheem = scheem.evalScheem;
    var parser = scheem.parser;
} else {
    // In browser assume already loaded by <script> tags
    var assert = chai.assert;
}

suite('number', function() {
    test('3', function() {
        assert.deepEqual(
            evalScheem(3, {}),
            3
        );
    });
});

suite('quote', function() {
    test('a number', function() {
        assert.deepEqual(
            evalScheem(['quote', 3], {}),
            3
        );
    });
    test('an atom', function() {
        assert.deepEqual(
            evalScheem(['quote', 'dog'], {}),
            'dog'
        );
    });
    test('a list', function() {
        assert.deepEqual(
            evalScheem(['quote', [1, 2, 3]], {}),
            [1, 2, 3]
        );
    });
});

suite('variables', function() {
    test('define a 3', function() {
        var env = {};
        assert.deepEqual(
            evalScheem(["define", 'a', 3], env),
            0
        );
        assert.deepEqual(
            evalScheem('a', env),
            3
        );
    });
});

suite('begin', function() {
    test('(define a 3)', function() {
        var env = {};
        assert.deepEqual(
            evalScheem(['begin', ["define", 'a', 3]], env),
            0
        );
        assert.deepEqual(
            evalScheem('a', env),
            3
        );
    });
    test('(define a 3) (+ a a)', function() {
        var env = {};
        assert.deepEqual(
            evalScheem(['begin', ["define", 'a', 3], ['+', 'a', 'a']], env),
            6
        );
    });
});

suite('equal', function() {
    test('= 3 3', function() {
        assert.deepEqual(
            evalScheem(['=',3,3], {}),
            '#t'
        );
    });
    test('= 3 4', function() {
        assert.deepEqual(
            evalScheem(['=',3,4], {}),
            '#f'
        );
    });
});

suite('less than', function() {
    test('< 3 3', function() {
        assert.deepEqual(
            evalScheem(['<',3,3], {}),
            '#f'
        );
    });
    test('< 3 4', function() {
        assert.deepEqual(
            evalScheem(['<',3,4], {}),
            '#t'
        );
    });
});

suite('if', function() {
    test('(= 3 4) 9 10', function() {
        assert.deepEqual(
            evalScheem(['if', ['=',3,4], 9, 10], {}),
            10
        );
    });
    test('(= 3 3) 9 10', function() {
        assert.deepEqual(
            evalScheem(['if', ['=',3,3], 9, 10], {}),
            9
        );
    });
});

suite('car', function() {
    test('\'(1 2 3)', function() {
        assert.deepEqual(
            evalScheem(['car', ['quote', [1, 2, 3]]], {}),
            1
        );
    });
});

suite('cdr', function() {
    test('\'(1 2 3)', function() {
        assert.deepEqual(
            evalScheem(['cdr', ['quote', [1, 2, 3]]], {}),
            [2, 3]
        );
    });
});

suite('cons', function() {
    test('1 \'()', function() {
        assert.deepEqual(
            evalScheem(['cons', 1, ['quote', []]], {}),
            [1]
        );
    });
});

suite('parser', function() {
    var s1 = '(quote 1)';
    var s2 = '(car (quote (1 2 3)))';
    test(s1, function() {
        assert.deepEqual(
            parser(s1),
            ['quote', 1]
        );
    });
    test(s2, function() {
        assert.deepEqual(
            parser(s2),
            ['car', ['quote', [1,2,3]]]
        );
    });
});

suite('evalScheemString', function() {
    var s1 = '(car (quote (1 2 3)))';
    test(s1, function() {
        assert.deepEqual(
            evalScheemString(s1),
            1
        );
    });

    var s2 = '(+ 2 (* 3 4))';
    test(s2, function() {
        assert.deepEqual(
            evalScheemString(s2),
            14
        );
    });
});

suite('list', function() {
    var s1 = "'()";
    test(s1, function() {
        assert.deepEqual(
            parser(s1),
            ['quote', []]
        );
    });

    var s2 = "(quote ())";
    test(s2, function() {
        assert.deepEqual(
            parser(s2),
            ['quote', []]
        );
    });
});

suite('truthy', function() {
    var s1 = "(= 5 5)";
    test(s1, function() {
        assert.deepEqual(
            evalScheemString(s1, {}),
            '#t'
        );
    });
    var s2 = "(!= 5 5)";
    test(s2, function() {
        assert.deepEqual(
            evalScheemString(s2),
            '#f'
        );
    });
    var s3 = "(> 5 5)";
    test(s3, function() {
        assert.deepEqual(
            evalScheemString(s3),
            '#f'
        );
    });
    var s4 = "(< 5 5)";
    test(s4, function() {
        assert.deepEqual(
            evalScheemString(s4),
            '#f'
        );
    });
});

