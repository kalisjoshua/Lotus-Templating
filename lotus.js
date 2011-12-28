var lotus = (function (undefined) {
    var next = function (tmpl) {
            /* regex result parts
                0 - full match
                1 - block identifier/lookup key
                2 - block template
                3 - else condition "template?"
            */
            return tmpl.match(/\{([^\/\}]+)\}(?:(.*?)(?:\{\?\}(.*?))?\{\/\1\})?/);
        }

        ,process = function (template, scope) {
            var node = next(template)
                ,temp;
            
            if (node[1]) {
                while (node) {
                    // loop over the nodes in the template
                    if (scope[node[1]]) {
                        // check to see that there value is available in the scope
                        if (scope[node[1]].toString() === scope[node[1]].valueOf()) {
                            // use the primitive value
                            temp = scope[node[1]];
                        } else {
                            // work on the complex objects
                            if (({}).toString.call(scope[node[1]]) === "[object Array]") {
                                // loop over the elements of the value array
                                for (var i = 0, len = scope[node[1]].length; i < len; i++) {
                                    temp += node[2].replace(/\{item\}/g, scope[node[1]][i]);
                                }
                            } else {
                                // if the value is an Object then recurse into the template
                                temp = process(node[2], scope[node[1]]);
                            }
                        }
                    } else {
                        // if the data doesn't exist in the scope object attempt to use the else condition template
                        temp = "" + node[3];
                    }
                    
                    template = template.replace(node[0], temp);
                    temp = "";
                    node = next(template);
                }

                return template;
            }
        };
    
    return function (template, data) {
        return process(template
            // tokenize the newline characters
            .replace(/\n+/g, "~n~")
            // tokenize the leading whitespace
            .replace(/^\s+/g, "~t~")
            // begin the templating
            , data)
                // replace newlines
                .replace(/~n~/g, "\n")
                // replace some whitespace
                .replace(/~t~/g, "    ");
    };
}());