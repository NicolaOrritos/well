'use strict';

var restify = require('restify');
var CONF    = require('./conf');

var MongoClient = require('mongodb').MongoClient;


function save(data, conf, log, callback)
{
    if (data && conf && log && callback)
    {
        var url = 'mongodb://'
                + conf.HOST
                + ':'
                + conf.PORT
                + '/'
                + conf.DB;

        MongoClient.connect(url, function(err, db)
        {
            if (err)
            {
                log.error('Could not connect to "%s". %s', url, err);

                callback(err);
            }
            else
            {
                db.collection('drops').insert([data], function(err2)
                {
                    db.close();

                    if (err2)
                    {
                        log.error('Could not save data to "drops" collection. %s', err2);

                        callback(err2);
                    }
                    else
                    {
                        callback();
                    }
                });
            }
        });
    }
    else
    {
        callback(new Error('Missing one or more "save()" parameters'));
    }
}


module.exports =
{
    push: function(req, res, next)
    {
        var bucket = req.params.bucket || 'default';

        if (CONF.BUCKETS[bucket])
        {
            if (req.body)
            {
                try
                {
                    req.log.info('Pushing to bucket "%s" data "%s"...', bucket, JSON.stringify(req.body));

                    JSON.stringify(req.body);



                    save(req.body, CONF.BUCKETS[bucket], req.log, function(err)
                    {
                        if (err)
                        {
                            next(new restify.ResourceNotFoundError(err));
                        }
                        else
                        {
                            res.send({status: 'ok'});

                            next();
                        }
                    });
                }
                catch (err)
                {
                    req.log.error('Could not push data to bucket "%s" collection. Malformed data: %s', bucket, req.body);

                    return next(new restify.BadRequestError(err));
                }
            }
            else
            {
                req.log.error('Could not push data to bucket "%s" collection: missing request body', bucket);

                return next(new restify.BadRequestError('Empty request'));
            }
        }
        else
        {
            req.log.error('Could not find bucket "%s". Aborting...', bucket);

            return next(new restify.ResourceNotFoundError('Bucket not found'));
        }
    }
};
