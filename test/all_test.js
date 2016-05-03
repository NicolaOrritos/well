
/* global describe, it */

'use strict';

const assert  = require('assert');
const request = require('request');
const CONF    = require('../lib/conf');


const baseURL = 'http://localhost:' + CONF.PORT + '/well/push';

const doc     = JSON.stringify({key: 'value'});


describe('"well" server', () =>
{
    it('must answer to pushes on the default bucket', done =>
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

            const result = JSON.parse(res.body);

            assert(result);
            assert(result.status === 'ok');

            done();
        });
    });

    it('must reply with 404 when pushing to non existent buckets', done =>
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

    it('must reply with 400 when pushing non-JSON data', done =>
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
