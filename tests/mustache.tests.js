module("Mustache");

$.get("spec/_files/", function (directory) {
    $(directory)
        .find("a")
        .filter(function (indx, node) {return /js$/.test(node.href)})
        .map(function (indx, node) {return node.href.replace(/^.*\/|\..*$/g, "")})
        .each(function (indx, node) {
            var model, expected, template;

            $.when(
                $.get("spec/_files/" + node + ".js", function (result) {
                    model = (new Function ("return " + result.slice(result.indexOf('{'), 1 + result.lastIndexOf('}'))))();
                })

                ,$.get("spec/_files/" + node + ".txt", function (result) {
                    expected = result
                        .replace(/&#([^\)]+?);/g, function (full, code) {
                            return String.fromCharCode(code);
                        });
                })

                ,$.get("spec/_files/" + node + ".mustache", function (result) {
                    template = result
                        // convert to lotus templating syntaxes

                        //  - remove template comments
                        .replace(/\{\{![^\}\}]*\}/, "")

                        //  - remove block scoping syntax (#)
                        //  - remove output unescaping syntax: {{&value}} and {{{value}}} - triple-stash the double-stash
                        .replace(/(\{|\})\1\1?[#&]?/g, "$1")
                })
            )
            .then(function () {
                test(node, function () {
                    equal(lotus(template, model), expected);
                });
            });
        });
});