/*/ //
= Lotus - logically organized templating usable and simple - I just made that up!
Syntaxically terse templating

== Examples

=== Simple variable lookup

 >>> JavaScript
 > data = {variable: "value"}
 > template = "variable is {variable}"
 > lotus(template, data)
 > // yields: 'variable is value'

=== Drill-down scope resolution

 >>> JavaScript
 > data = {name: {first: "Joshua", last: "Kalis"}}
 > template = "My name is {name.first} {name.last}."
 > lotus(template, data)
 > // yields: 'My name is Joshua Kalis.'


== TODO
 - relative scope traversing using dotdot notation
 - scope from the root of the object rather than relative to the current location
 - extracting element(s) of an array by [index|range?]
 - nested templates (django-ish?)
 - template functions (mustache-y?) - https://github.com/janl/mustache.js
    var data = {
            people: [
                {first: "Joshua", last: "Kalis"}
            ]
            ,name: function () {
                return this.first + " " + this.last;
            }
        }

        ,tmpl = "{people}{name}{/people}"

/*/ //

var lotus = (function () {
    var next = function (tmpl, skip) {
            /* regex result items
                0 - full match
                1 - block identifier/lookup key
                2 - block template
                3 - else condition
            */
            return tmpl
                .slice(skip)
                .match(/\{([^\/\}]+)\}(?:(.*?)(?:\{else\}(.*?))?\{\/\1\})?/);
        }

        // add scope chain argument for calling back up in the object
        ,process = function (template, data, scope) {
            var i
                ,len
                ,node = next(template, 0)
                ,skip = 0
                ,temp = ""
                ,value;
            
            if (!node) {
                // nothing in the template to replace move on
                return template;
            } else if (node[1]) {
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
                            if (node[2].indexOf("{") >= 0) {
                                // handle data-driven template sections
                                // work on the complex objects
                                if (({}).toString.call(value) === "[object Array]") {
                                    len = value.length;
                                    // loop over the elements of the value array
                                    for (i = 0; i < len; i++) {
                                        temp += value[i].toString() === value[i].valueOf()
                                            ? node[2].replace(/\{item\}/g, value[i]) // array element is a primitive
                                            : process(node[2], value[i], []); // array element is a non-primitive
                                    }
                                } else {
                                    // push the node we are recursing into onto the scope chain
                                    scope.push(node[1]);
                                    // if the value is an Object then recurse into the template
                                    temp = process(node[2], data, scope);
                                    // remove the top of the scope chain now that it has been processed
                                    scope.pop();
                                }
                            } else {
                                // handle data-driven template sections
                                temp = node[2];
                            }
                        }
                    } else {
                        // the data doesn't exist in the data object, use else condition
                        temp = node[3];
                    }
                    
                    // place the caret at the begining of the current node to replace so as to skip past any
                    // previously inserted data that might have content with syntax similar to templating
                    skip = +template.indexOf(node[0]);
                    // replace the full match with what was found
                    template = template.slice(0, skip) + template.slice(skip).replace(node[0], temp || "");
                    // skip past the replacement for the current node
                    skip += +((temp || "").length);

                    temp = "";
                    node = next(template, skip);
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
                // recurse up the property tree to search for the property higher up
                while (path.length && !result) {
                    // pop off the previous scope since the value wasn't found
                    path.pop();
                    result = resolve(needle, data, path);
                }
            }

            return result || ""; // was anything found?
        };
    
    return process;
}());