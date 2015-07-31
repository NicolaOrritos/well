'use strict';

var MongoClient = require('mongodb').MongoClient;


module.exports =
{
    save: function(data, conf, log, callback)
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
};
