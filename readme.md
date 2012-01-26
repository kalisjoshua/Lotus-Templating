# Lotus - text templating

 Lotus templates are meant to be light on syntax and smart on execution. There is very little extra cruft to Lotus templates: very few extra characters to identify tag use, single-curly-brace syntax, value-aware execution.

 If a value is truthy and is an opening to a block then recurse into that block and continue working. If a value is falsy and is an opening to a block process into the "else" portion of the block. If the value is not a block attempt to render the content to the template. The premise is that the data drives the template and the template is clean; without complex execution directives.

 ## Usage

 A quick example of Lotus in action:

    var data = {
            author: "Joshua Kalis"
        }

        ,tmpl = "The original author of Lotus is {author}."

        ,result = lotus(tmpl, data);
    
    result; // = "The original author of Lotus is Joshua Kalis."