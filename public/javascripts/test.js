(function ($, _, twig) {
    'use strict';

    var testCases = {
        login: {
            method: 'post',
            url:    '/api/login',
            send:   ['email', 'password']
        },
        registration: {
            method: 'post',
            url:    '/api/register',
            send:   ['phone', 'name', 'email', 'password']
        },
    };


    var testRender = twig({
            id:   'item',
            href: '/javascripts/item.twig',
            async: false
        }),
        body       = $('body');
    //testRender = testRender.render.bind(testRender);
    _.each(testCases, function (test, name) {
        body.append('<h3>' + name + '</h3>');
        body.append(testRender.render(test));
    });
    $('.form-wrapper form button.send').click(function (e) {
        e.preventDefault();
        var it = $(this),
            form = it.parents('form');
        $.ajax({
            url: form.prop('action'),
            method: form.prop('method')
        }).then(function (a, b, c) {
            console.log(a);
            form.find('div.result').html(c.status + ':  ' + c.responseText);
        });
    });

})(jQuery, _, Twig.twig);