(function ($, _, twig) {
    'use strict';

    var testCases = {
        login:        {
            method: 'post',
            url:    '/api/login',
            send:   ['email', 'password']
        },
        registration: {
            method:    'post',
            url:       '/api/register',
            send:      ['phone', 'name', 'email', 'password'],
            scenarios: [
                {
                    data: ['+380990316128', 'Grigory', 'tomfun1990@gmail.com', 'password'],
                },
                {
                    data: ['', 'Tamara', 'ShitMail.ru', 'password'],
                }
            ]
        },
    };


    var testRender = twig({
            id:    'item',
            href:  '/javascripts/item.twig',
            async: false
        }),
        body       = $('body');
    //testRender = testRender.render.bind(testRender);
    _.each(testCases, function (test, name) {
        test.name = name;
        body.append(testRender.render(test));
    });
    $('.form-wrapper form button.fill').click(function (e) {
        e.preventDefault();
        var it         = $(this),
            form       = it.parents('form'),
            data       = testCases[form.prop('id')],
            numb       = data.numb === undefined ? -1 : data.numb,
            dataToFill = data.scenarios[data.numb = ++numb % data.scenarios.length];
        form.find('input').each(function (i, v) {
            $(v).val(dataToFill.data[i]);
        });
    });
    $('.form-wrapper form button.send').click(function (e) {
        e.preventDefault();
        var it     = $(this),
            form   = it.parents('form'),
            data   = {},
            method = form.prop('method'),
            token  = $('#global-token').val();
        form.find('input').each(function (i, v) {
            v = $(v);
            data[v.attr('name')] = v.val();
        });
        $.ajax({
            url:     form.prop('action'),
            data:    method.toLowerCase() === 'get' ? data : JSON.stringify(data),
            method:  method,
            headers: token ? {Authorization: token} : undefined
        }).then(function (a, b, c) {
            console.log(a);
            var res  = form.find('div.result'),
                html = res.html();
            html += (html ? '<br/>' : '') + 'input: ' + (token ? '<b>*</b> ' : '') + JSON.stringify(data) + '<br/>'
                + 'ouput ' + c.status + ':  ' + c.responseText;
            res.html(html);
        });
    });

})(jQuery, _, Twig.twig);