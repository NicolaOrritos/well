'use strict';

var restify = require('restify');
var CONF    = require('./conf');

var DRIVERS_PATH = './drivers/';


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

                    // Used to check JSON validity by eventually triggering an error:
                    JSON.stringify(req.body);


                    var driver = require(DRIVERS_PATH + CONF.BUCKETS[bucket].DRIVER);

                    if (driver)
                    {
                        driver.save(req.body, CONF.BUCKETS[bucket], req.log, function(err)
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
                    else
                    {
                        req.log.error('Could not find driver "%s", for bucket "%s"', CONF.BUCKETS[bucket].DRIVER, bucket);

                        next(new restify.InternalError());
                    }
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
