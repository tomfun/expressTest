(function ($, _, twig) {
    'use strict';

    var testCases = {
        login:        {
            method:    'post',
            url:       '/api/login',
            send:      ['email', 'password'],
            scenarios: [
                {
                    data: ['tomfun1990@gmail.com', 'password'],
                },
                {
                    data: ['ShitMail.ru', 'password'],
                },
                {
                    data: ['ShitMail.ru', 'password1'],
                }
            ]
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
        getUser:      {
            method:    'get',
            url:       '/api/user/',
            send:      ['id'],
            addToUrls: ['id'],
            scenarios: [
                {
                    data: ['1'],
                },
                {
                    data: ['2'],
                }
            ]
        },
        getCurrentUser:      {
            method:    'get',
            url:       '/api/user/me',
            send:      [],
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
            token  = $('#global-token').val(),
            url    = form.prop('action');
        form.find('input').each(function (i, v) {
            v = $(v);
            if (v.data('toUrl')) {
                url += v.val();//v.data('-to-url');
            } else {
                data[v.attr('name')] = v.val();
            }
        });
        var isGet = method.toLowerCase() === 'get';

        $.ajax({
            url:         url,
            data:        isGet ? data : JSON.stringify(data),
            dataType:    isGet ? undefined : 'json',
            contentType: isGet ? undefined : "application/json",
            method:      method,
            headers:     token ? {Authorization: token} : undefined
        }).then(function (a, b, c) {
            console.log(a);
            var res  = form.find('div.result'),
                html = res.html();
            html += (html ? '<br/>' : '') + 'url: ' + url + '<br/>'
                + 'input: ' + (token ? '<b>*</b> ' : '') + JSON.stringify(data) + '<br/>'
                + 'output ' + c.status + ':  ' + c.responseText;
            res.html(html);
        }).fail(function (a, b, c) {
            console.log(a);
            var res  = form.find('div.result'),
                html = res.html();
            html += (html ? '<br/>' : '')  + 'url: ' + url + '<br/>'
                + 'input: ' + (token ? '<b>*</b> ' : '') + JSON.stringify(data) + '<br/>'
                + 'output ' + a.status + ':  ' + (a.responseText === undefined ? '' : a.responseText);
            res.html(html);
        });
    });

})(jQuery, _, Twig.twig);