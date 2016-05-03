
'use strict';


const Logger  = require('bunyan');
const restify = require('restify');
const buckets = require('./buckets');
const CONF    = require('./conf');


const log = new Logger(
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


const server = restify.createServer(
{
    name: 'well',
    log:  log
});

server.use(restify.acceptParser('application/json'));
server.use(restify.bodyParser());


server.post('/well/push/:bucket', buckets.push);  // Goes to a specific  bucket
server.post('/well/push',         buckets.push);  // Goes to the default bucket


server.listen(CONF.PORT, () =>
{
    log.info('"Well" server started on port "%s"', CONF.PORT);
    log.info('Loaded with the following configuration: %j', CONF);
});
