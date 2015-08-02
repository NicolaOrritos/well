'use strict';

var redis = require('redis');

var REDIS_DEFAULT_PORT = 6379;

function getClient(conf, log)
{
    var client;

    if (conf && log)
    {
        if (conf.SOCKET)
        {
            client = redis.createClient(conf.SOCKET, conf.OPTIONS);
        }
        else if (conf.HOST)
        {
            if (conf.PORT)
            {
                client = redis.createClient(conf.PORT, conf.HOST, conf.OPTIONS);
            }
            else
            {
                client = redis.createClient(REDIS_DEFAULT_PORT, conf.HOST, conf.OPTIONS);
            }
        }
        else
        {
            client = redis.createClient(conf.OPTIONS);
        }
    }

    return client;
}


module.exports =
{
    save: function(data, conf, log, callback)
    {
        if (data && conf && log && callback)
        {
            var doneAlready = false;

            var client = getClient(conf, log);

            if (client)
            {
                client.once('error', function (err)
                {
                    log.error('Got an error from the Redis client: ' + err);

                    doneAlready = true;

                    callback(err);
                });

                if (!doneAlready)
                {
                    client.select(conf.DB, function()
                    {
                        if (!doneAlready)
                        {
                            var id = 'drops:' + Date().now;

                            client.set(id, JSON.stringify(data), function(err)
                            {
                                // 'err' will be null if everything's OK
                                callback(err);
                            });
                        }
                    });
                }
            }
            else
            {
                var msg = 'Could not build client connection to Redis';

                log.error(msg);

                callback(new Error(msg));
            }
        }
        else
        {
            callback(new Error('Missing one or more "save()" parameters'));
        }
    }
};
