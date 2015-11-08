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
        changeCurrentUser:      {
            method:    'put',
            url:       '/api/user/me',
            send:      ['phone', 'name', 'email', 'current_password', 'new_password'],
            scenarios: [
                {
                    data: ['+380990316128', 'Gregory', 'tomfun@gmail.com', 'password', 'password'],
                },
                {
                    data: ['+3809903161210', 'George', 'tomfun1990@gmail.com', 'password', 'password'],
                }
            ]
        },
        changeCurrentUserData:      {
            method:    'put',
            url:       '/api/user/me',
            send:      ['phone', 'name', 'email'],
            scenarios: [
                {
                    data: ['+380990316128', 'Gregory', 'tomfun@gmail.com'],
                },
                {
                    data: ['+3809903161210', 'George', 'tomfun1990@gmail.com'],
                }
            ]
        },
        changeCurrentUserPassword:      {
            method:    'put',
            url:       '/api/user/me',
            send:      ['current_password', 'new_password'],
            scenarios: [
                {
                    data: ['password', 'password2'],
                },
                {
                    data: ['password2', 'password'],
                }
            ]
        },
        searchUser:      {
            method:    'get',
            url:       '/api/user',
            send:      ['name', 'email'],
            addToUrlsAsQuery: ['name', 'email'],
            scenarios: [
                {
                    data: ['', 'tomfun1990@gmail.com'],
                },
                {
                    data: ['Grigory', ''],
                }
            ]
        },
        createItem: {
            method:    'post',
            url:       '/api/item',
            send:      ['title', 'price'],
            scenarios: [
                {
                    data: ['Note', '596.12'],
                },
                {
                    data: ['Magesty', '10 943 $'],
                }
            ]
        },
        getItem:      {
            method:    'get',
            url:       '/api/item/',
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
        deleteItem:      {
            method:    'delete',
            url:       '/api/item/',
            send:      ['id'],
            addToUrls: ['id'],
            scenarios: [
                {
                    data: ['3'],
                },
                {
                    data: ['2'],
                }
            ]
        },
        searchItem:      {
            method:    'get',
            url:       '/api/item',
            send:      ['title', 'user_id', 'order_by', 'order_type'],
            addToUrlsAsQuery: ['title', 'user_id', 'order_by', 'order_type'],
            scenarios: [
                {
                    data: ['', 'tomfun1990@gmail.com'],
                },
                {
                    data: ['Grigory', ''],
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
            method = form.attr('method'),
            token  = $('#global-token').val(),
            url    = form.prop('action'),
            asQuery = {};
        form.find('input').each(function (i, v) {
            v = $(v);
            var name = v.attr('name');
            if (v.data('toUrl')) {
                url += v.val();
            } else if (v.data('toUrlAsQuery')) {
                asQuery[name] = v.val();
            } else {
                data[name] = v.val();
            }
        });
        if (!_.isEmpty(asQuery)) {
            url += '?' + $.param(asQuery);
        }
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

    var routeTable = $('#routes');
    $('body > h1').first().click(function () {
        routeTable.slideToggle(1800);
    }).css('cursor', 'pointer');
    routeTable.click(function () {
        routeTable.slideToggle(1800);
    }).css('cursor', 'pointer').css({});
})(jQuery, _, Twig.twig);