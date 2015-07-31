/* global describe, it */
'use strict';

var assert  = require('assert');
var request = require('request');
var CONF    = require('../lib/conf');


var baseURL = 'http://localhost:' + CONF.PORT + '/well/push';

var doc     = JSON.stringify({key: 'value'});


describe('"well" server', function()
{
    it('must answer to pushes on the default bucket', function(done)
    {
        request.post(
        {
            url: baseURL,
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: doc
        },
        function(err, res)
        {
            assert(err == null, 'There was an error pushing to the default bucket. ' + err);
            assert(res.statusCode === 200, 'Status code is not 200, but ' + res.statusCode + ' instead');

            var result = JSON.parse(res.body);

            assert(result);
            assert(result.status === 'ok');

            done();
        });
    });

    it('must reply with 404 when pushing to non existent buckets', function(done)
    {
        request.post(
        {
            url: baseURL + '/idontexist',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: doc
        },
        function(err, res)
        {
            assert(err == null, 'There was an error connecting to the proxy. ' + err);
            assert(res.statusCode === 404);

            done();
        });
    });

    it('must reply with 400 when pushing non-JSON data', function(done)
    {
        request.post(
        {
            url: baseURL,
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: 'I\'m not JSON'
        },
        function(err, res)
        {
            assert(err == null, 'There was an error connecting to the proxy. ' + err);
            assert(res.statusCode === 400, 'Status code is not 400, but ' + res.statusCode + ' instead');

            done();
        });
    });
});
