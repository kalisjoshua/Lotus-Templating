module("Lotus templating");

var compress = function (str) {
        
        return str.replace(/\s+/g, "");
    };

test("simple templating", function () {    
    var data = {
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

        ,expd =
        '<div class="me">\
            <p><strong>Kalis</strong>, Joshua - Male</p>\
            no calendar defined\
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
            {?}\
            no calendar defined\
            {/calendar}\
            <ul>\
            {hobbies}\
                <li>{item}\
            {/hobbies}\
        </div>';
    
    equal(compress(lotus(tmpl, data)), compress(expd), "output of template engine");
});

test("scope chain access child properties", function () {
    var data = {
            name: {
                first: "Joshua"
                ,last: "Kalis"
            }
        }

        ,expd = '<p><strong>Kalis</strong>, Joshua - </p>'

        ,tmpl = '<p><strong>{name.last}</strong>, {name.first} - {gender}</p>';
    
    equal(compress(lotus(tmpl, data)), compress(expd), "<p><strong>{name.last}</strong>, {name.first} - {gender}</p>");
});

test("scope chain traversing up", function () {
    var data = {
            nav: {
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
            <h1>{prefix}</h1>\
            {nav}\
            <ul>\
                {links}<li><a href="//{prefix}/{item}">{item}</a>{/links}\
            {/nav}\
        </div>';
    
    equal(compress(lotus(tmpl, data)), compress(expd), "output of template engine");
});