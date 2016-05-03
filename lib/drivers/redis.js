'use strict';

const redis = require('redis');

const REDIS_DEFAULT_PORT = 6379;

function getClient(conf, log)
{
    let client;

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
            let doneAlready = false;

            const client = getClient(conf, log);

            if (client)
            {
                client.once('error', err =>
                {
                    log.error('Got an error from the Redis client: ' + err);

                    doneAlready = true;

                    callback(err);
                });

                client.select(conf.DB, () =>
                {
                    if (!doneAlready)
                    {
                        const id = 'drops:' + Date().now;

                        client.set(id, JSON.stringify(data), err =>
                        {
                            // 'err' will be null if everything's OK
                            callback(err);
                        });
                    }
                });
            }
            else
            {
                const msg = 'Could not build client connection to Redis';

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
