module("Lotus templating");

// test("finding blocks vs values", function () {
//     var block = /\{([^\/\}]+)\}(?:(.*?)(?:\{\?\}(.*?))?\{\/\1\})?/
//         ,strings = [
//              "<p>{name}</p>"
//             ,"{name}<p>{last}, {first}</p>{/name}"
//             ,"{name}<p>{last}, {first}</p>{?}no name given{/name}"
//             ,"{gender}{name}<p>{last}, {first}</p>{?}no name given{/name}"
//             ,"{name}<p>{last}, {first}</p>{?}no name given{/name}{gender}"
//         ];

//     strings.forEach(function (node) {
//         console.log(node.match(block));
//     });
// });

test("simple templating", function () {    
    var block = /\{([^\/\}]+)\}(?:(.*?)(?:\{\?\}(.*?))?\{\/\1\})?/

        ,data = {
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
    
    equal(lotus(tmpl, data).replace(/\s+/g, ""), expd.replace(/\s+/g, ""), "output of template engine");
});