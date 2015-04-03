'use strict';

var restify = require('restify');
var CONF    = require('./conf');

var MongoClient = require('mongodb').MongoClient;


function save(data, conf, log)
{
    if (data && conf && log)
    {
        // Connection URL
        var url = 'mongodb://'
                + conf.HOST
                + '/'
                + conf.PORT
                + '/'
                + conf.DB;
        
        // Use connect method to connect to the Server
        MongoClient.connect(url, function(err, db)
        {
            if (err)
            {
                log.error('Could not connect to "%s". %s', url, err);
            }
            else
            {
                db.collection('drops').insert([data], function(err2)
                {
                    if (err2)
                    {
                        log.error('Could not save data to "drops" collection. %s', err2);
                    }
                });
            }
        });
    }
}


module.exports =
{
    push: function(req, res, next)
    {
        var bucket = req.params.bucket || 'default';
        
        if (CONF.BUCKETS[bucket])
        {
            req.log.info('Pushing to bucket "%s"...', bucket);
            
            if (req.body)
            {
                save(req.body, CONF.BUCKETS[bucket], req.log);
                
                res.send({status: 'ok'});

                return next();
            }
            else
            {
                return next(new restify.BadRequestError('Empty request'));
            }
        }
        else
        {
            req.log.error('Could not find bucket "%s". Aborting...', bucket);
            
            return next(new restify.NotFoundError('Bucket not found'));
        }
    }
};
