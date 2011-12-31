module("Lotus templating");

var compress = function (str) {
        
        return str.replace(/\s+/g, "");
    }

    test_data = {
        brittany: {
            name: {
                first: "Brittany"
                ,last: "Stone"
            }
        }

        ,cmp: {
            databases: [
                 {name: "abc", username: "qwerty", password: "poiuy"}
                ,{name: "xyz", username: "3lkr;n09jefoniq30jf3", password: "l23ioufds0n23r09dv0few89"}
            ]
        }

        ,furniture: {
            appliances: {
                fridge: "Kenmore"
                ,stove: "GE"
            }

            ,inside: {
                bedroom: {
                    dresser: "Malm"
                }

                ,livingroom: {
                    chair: "Poang"
                    ,table: "MSU carving"
                }
            }

            ,outside: {
                chair: "Adirondak?"
                ,table: "Craftsman Style"
            }
        }

        ,joshua: {
            gender: "Male"
            ,hobbies: [
                 "Art"
                ,"JavaScript"
                ,"Photography"
            ]
            ,name: {
                first: "Joshua"
                ,last: "Kalis"
            }
        }
    };

test("simple templating", function () {    
    var expd =
        '<div class="me">\
            <p><strong>Kalis</strong>, Joshua - Male</p>\
            no~calendar\
            <ul>\
                <li>Art\
                <li>JavaScript\
                <li>Photography\
        </div>'

        ,tmpl =
        '<div class="me">\
            <p>{name}<strong>{last}</strong>, {first}{/name} - {gender}</p>\
            {calendar}\
            <calendar/>\
            {else}\
            no~calendar\
            {/calendar}\
            <ul>\
            {hobbies}\
                <li>{item}\
            {/hobbies}\
        </div>';
    
equal(compress(lotus(tmpl, test_data.joshua)), compress(expd), "{name}{last}, {first}{/name}");
});

test("drill-down access - child properties", function () {
    var expd = '<p><strong>Stone</strong>, Brittany - </p>'

        ,tmpl = '<p><strong>{name.last}</strong>, {name.first} - {age}</p>';
    
equal(compress(lotus(tmpl, test_data.brittany)), compress(expd), "<p><strong>{name.last}</strong>, {name.first} - {age}</p>");
});

test("look up the chain - higher-scoped properties", function () {
    var expd = 
        'Kalis, Joshua - Male'

        ,tmpl = 
        '{name}{last}, {first} - {gender}{/name}';
    
equal(compress(lotus(tmpl, test_data.joshua)), compress(expd), '{name}{last}, {first} - {gender}{/name}');
});

test("recursive templates for complex objects as array elements", function () {
    var expd = 
        '<ul>\
            <li>abc - [qwerty, poiuy]\
            <li>xyz - [3lkr;n09jefoniq30jf3, l23ioufds0n23r09dv0few89]\
        </ul>'

        ,tmpl = 
        '<ul>\
            {databases}<li>{name} - [{username}, {password}]{/databases}\
        </ul>';
    
equal(compress(lotus(tmpl, test_data.cmp)), compress(expd), '{databases}<li>{name} - [{username}, {password}]{/databases}');
});

test("multiple instances of a property in the template", function () {
    var expd = 
        '<h2>Databases</h2>\
        <ul>\
            <li>abc - [qwerty, poiuy]\
            <li>xyz - [3lkr;n09jefoniq30jf3, l23ioufds0n23r09dv0few89]\
        </ul>'

        ,tmpl = 
        '{databases}<h2>Databases</h2>{/databases}\
        <ul>\
            {databases}<li>{name} - [{username}, {password}]{/databases}\
        </ul>';
    
equal(compress(lotus(tmpl, test_data.cmp)), compress(expd), '{databases}<li>{name} - [{username}, {password}]{/databases}');
});

/*
test("scope chain relative-scoped properties", function () {
    var expd = 
        '<div>\
            <h1>domain.com</h1>\
            <ul>\
                <li><a href="//domain.com/about">about</a>\
                <li><a href="//domain.com/home">home</a>\
                <li><a href="//domain.com/portfolio">portfolio</a>\
        </div>'

        ,tmpl = 
        '<div>\
            {nav}\
            <ul>\
                {links}<li><a href="//{...contrived.example}/{item}">{item}</a>{/links}\
            {/nav}\
        </div>';
    
// equal(compress(lotus(tmpl, data)), compress(expd), "output of template engine");
});

test("scope chain absolute-scoped properties", function () {
    var data = {
            contrived: {
                example: "string"
            }
            ,nav: {
                links: [
                     "about"
                    ,"home"
                    ,"portfolio"
                ]
            }
            ,prefix: "domain.com"
        }

        ,expd = 
        '<div>\
            <h1>domain.com</h1>\
            <ul>\
                <li><a href="//domain.com/about">about</a>\
                <li><a href="//domain.com/home">home</a>\
                <li><a href="//domain.com/portfolio">portfolio</a>\
        </div>'

        ,tmpl = 
        '<div>\
            {nav}\
            <ul>\
                {links}<li><a href="//{>contrived.example}/{item}">{item}</a>{/links}\
            {/nav}\
        </div>';
    
// equal(compress(lotus(tmpl, data)), compress(expd), "output of template engine");
});


// {array.[index|#]}

// */