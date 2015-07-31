
'use strict';


var Logger  = require('bunyan');
var restify = require('restify');
var buckets = require('./buckets');
var CONF    = require('./conf');


var log = new Logger(
{
    name: 'well',

    streams:
    [
        {
            stream: process.stdout,
            level: 'debug'
        }
    ],

    serializers:
    {
        req: Logger.stdSerializers.req,
        res: Logger.stdSerializers.res
    }
});


var server = restify.createServer(
{
    name: 'well',
    log:  log
});

server.use(restify.acceptParser('application/json'));
server.use(restify.bodyParser());


server.post('/well/push/:bucket', buckets.push);  // Goes to a specific  bucket
server.post('/well/push',         buckets.push);  // Goes to the default bucket


server.listen(CONF.PORT);
