'use strict';

const restify = require('restify');
const CONF    = require('./conf');

const DRIVERS_PATH = './drivers/';


module.exports =
{
    push: function(req, res, next)
    {
        const bucket = req.params.bucket || 'default';

        if (CONF.BUCKETS[bucket])
        {
            if (req.body)
            {
                try
                {
                    req.log.info('Pushing to bucket "%s" data "%s"...', bucket, JSON.stringify(req.body));

                    // Used to check JSON validity by eventually triggering an error:
                    JSON.stringify(req.body);


                    const driver = require(DRIVERS_PATH + CONF.BUCKETS[bucket].DRIVER);

                    if (driver && driver.save)
                    {
                        driver.save(req.body, CONF.BUCKETS[bucket], req.log, err =>
                        {
                            if (err)
                            {
                                req.log.error('Could not save data. %s', err);

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
                    req.log.error('Could not push data to bucket "%s" collection. Malformed data: %j. %s', bucket, req.body, err);

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
