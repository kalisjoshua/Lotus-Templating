# Lotus - text templating

Lotus templates are meant to be light on syntax and smart on execution. There is very little extra cruft to Lotus templates: very few extra characters to identify tag use, single-curly-brace syntax, value-aware execution.

If a value is truthy and is an opening to a block then recurse into that block and continue working. If a value is falsy and is an opening to a block process into the "else" portion of the block. If the value is not a block attempt to render the content to the template.

The premise is that the data drives the template and the template is clean; without complex execution directives.

The second goal of Lotus was to be easy to understand from a source file perspective. I like to be able to look at code and quickly understand what is happening. This engine is incredibly short and doesn't use a bunch of trickery to process a template. For the most part all that is happening is string replacement.

## Usage

Some quick examples of Lotus in action:

### Simple value resolution

    var data = { author: "Joshua Kalis" }

        ,tmpl = "The original author of Lotus is {author}."

        ,result = lotus(tmpl, data);
    
    // result === "The original author of Lotus is Joshua Kalis."

### Using dot notation to drill-down

    var data = { name: { first: "Joshua", last: "Kalis" } }

        ,tmpl = "Putting my lastname first - {name.last}, {name.first}."

        ,result = lotus(tmpl, data);
    
    // result === "Putting my lastname first - Kalis, Joshua."

### Or use blocks

    var data = { name: { first: "Joshua", last: "Kalis" } }

        ,tmpl = "Putting my lastname first - {name}{last}, {first}{/name}."

        ,result = lotus(tmpl, data);
    
    // result === "Putting my lastname first - Kalis, Joshua."

### Now with an else if the value is falsy

    var data = {}

        ,tmpl = "Putting my lastname first - {name}{last}, {first}{else}no name given{/name}."

        ,result = lotus(tmpl, data);
    
    // result === "Putting my lastname first - no name given."

### And you can do lists as well

    var data = { skills: [ "CSS", "HTML", "JavaScript" ] }
        
        ,tmpl = "<ul>{skills}<li>{item}<li>{/skills}</ul>"

        ,result = lotus(tmpl, data);

    // result === "<ul><li>CSS<li><li>HTML<li><li>JavaScript<li></ul>"