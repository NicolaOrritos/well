/* global describe, it */
'use strict';

var assert  = require('assert');
var request = require('request');
var CONF    = require('../lib/conf');


var baseURL = 'http://localhost:' + CONF.PORT + '/well/push';

var doc     = {key: 'value'};


describe('"well" server', function()
{
    it('must answer to pushes on the default bucket', function(done)
    {
        request.post(baseURL, {form: doc}, function(err, res)
        {
            assert(err == null, 'There was an error pushing to the default bucket. ' + err);
            assert(res.statusCode === 200);

            var result = JSON.parse(res.body);

            assert(result);
            assert(result.status === 'ok');

            done();
        });
    });

    it('must reply with 404 when pushing to non existent buckets', function(done)
    {
        request.post(baseURL + '/idontexist', doc, function(err, res)
        {
            assert(err == null, 'There was an error connecting to the proxy. ' + err);
            assert(res.statusCode === 404);

            done();
        });
    });
});
