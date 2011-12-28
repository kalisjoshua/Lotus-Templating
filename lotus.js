var lotus = (function (undefined) {
    var next = function (tmpl) {
            /* regex result items
                0 - full match
                1 - block identifier/lookup key
                2 - block template
                3 - else condition
            */
            return tmpl.match(/\{([^\/\}]+)\}(?:(.*?)(?:\{\?\}(.*?))?\{\/\1\})?/);
        }

        // add scope chain argument for calling back up in the object
        ,process = function (template, data, scope) {
            var node = next(template)
                ,temp
                ,value;
            
            if (node[1]) {
                // if no scope was passed in start off with an empty scope chain
                scope = scope || [];

                while (node) {
                    // push onto the scope all of the keys from the template
                    [].push.apply(scope, node[1].split("."));
                    value = resolve(data, scope);

                    // loop over the nodes in the template
                    if (value) {
                        // check to see that there value is available in the data
                        if (value.toString() === value.valueOf()) {
                            // use the primitive value
                            temp = value;
                        } else {
                            // work on the complex objects
                            if (({}).toString.call(value) === "[object Array]") {
                                // loop over the elements of the value array
                                for (var i = 0, len = value.length; i < len; i++) {
                                    temp += node[2].replace(/\{item\}/g, value[i]);
                                }
                            } else {
                                // if the value is an Object then recurse into the template
                                temp = process(node[2], value, scope.slice(1));
                            }
                        }
                    } else {
                        // the data doesn't exist in the data object, use else condition
                        temp = node[3] || "";
                    }
                    
                    template = template.replace(node[0], temp);
                    scope = [];
                    temp = "";
                    node = next(template);
                }

                return template;
            }
        }

        resolve = function (data, scope) {

            return (scope.length > 1 && data[scope[0]]
                ? resolve(data[scope[0]], scope.slice(1))
                : data[scope[0]]);
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