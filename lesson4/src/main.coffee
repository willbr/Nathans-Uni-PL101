stringify = (x) ->
    JSON.stringify x, escape, " "

escape = (k,v) ->
    type = typeof(v)
    switch type
        when "function"
            return 'lambda'
        else
            return v
    return v

runCode = ->
    data = document.myCodeMirror.getValue()
    try
        ast = document.parse data
        $('#ast').text stringify ast
        try
            r = document.evalScheem ast, document.env
            $('#result').text stringify r
            $('#env').text stringify document.env
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

    (define factorial (lambda (n)
                        (if (= n 1)
                            1
                            (* n (factorial (- n 1))))))
    (factorial 6)
    """
    document.myCodeMirror = CodeMirror.fromTextArea document.getElementById('code'),
        mode: "scheme"
        lineNumbers: true
        indentUnit: 4
        autofocus: true
        extraKeys:
            "Ctrl-Enter": runCode
    $('#runButton').click runCode
    runCode()
    return
