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
                    value = resolve(node[1], data, scope);

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
                                // console.log("~~~ Danger, recursion! ~~~");
                                // push the node we are recursing into onto the scope chain
                                scope.push(node[1]);
                                // if the value is an Object then recurse into the template
                                temp = process(node[2], data, scope);
                                // remove the top of the scope chain now that it has been processed
                                scope.pop();
                                // console.log("~~~ end recursion. ~~~");
                            }
                        }
                    } else {
                        // the data doesn't exist in the data object, use else condition
                        temp = node[3] || "";
                    }
                    
                    // replace the full match with what was found
                    template = template.replace(node[0], temp);
                    temp = "";
                    node = next(template);
                }

                return template;
            }
        }

        resolve = function (needle, data, scope) {
            var i = 0
                ,len = 0
                ,path = scope.slice(0) // "... did you make a copy, because if you did we could [use] the copy."
                ,result;
            
            // create one path to search with full scope and property
            ([]).push.apply(path, needle.split("."));
            len = path.length
            // start off the result with a lookup into the data object
            result = data[path[i++]];
            // needle now refers to the actual property being searched for instead of having dot notation
            needle = path[len - 1];

            // work down the path to enlightenment
            for (;i < len; i++) {
                result = result[path[i]];
            }

            // incase the property wasn't found, attempt to look for it higher up in the object
            if (!result) {
                // pop off the property being searched for
                path.pop();
                while (path.length && !result) {
                    // pop off the scope we just looked in since it isn't there
                    path.pop();
                    result = resolve(needle, data, path);
                }
            }

            return result;
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