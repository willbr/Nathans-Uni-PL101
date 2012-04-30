runCode = ->
    data = document.myCodeMirror.getValue()
    try
        ast = document.parse data
        console.log ast
        $('#ast').text JSON.stringify ast
        try
            r = document.evalScheem ast, document.env
            console.log r
            $('#result').text JSON.stringify r
            $('#env').text JSON.stringify document.env
        catch error
            $('#result').text 'eval failed ' + error
    catch error
        $('#ast').text 'ast failed ' + error
        $('#result').text 'None'


$ ->
    document.env = {}
    document.parse = PEG.buildParser(document.grammer).parse
    $('#code').val """
    ;;This is my Scheem Toy test for http://nathansuniversity.com

    (define four (car '(4 5 6 7)))

    (define ten (begin
               (define six 6)
               (+ four six)))

    (if (= ten 10)
        'its_ten
        'its_not_ten)
    """
    document.myCodeMirror = CodeMirror.fromTextArea document.getElementById('code'),
        mode: "scheme"
        lineNumbers: true
        indentUnit: 4
        autofocus: true
        extraKeys:
            "Ctrl-Enter": runCode
    console.log 'main ready'
    $('#runButton').click runCode
    runCode()
    return
