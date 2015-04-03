'use strict';


var sjl  = require("sjl");

var defaults =
{
    "PORT": 6666,
    
    "BUCKETS":
    {
        "default":
        {
            "HOST": "localhost",
            "PORT": 27017,
            "DB":   "DefaultBucket"
        }
    }
};

var CONF = sjl('/etc/well.conf', defaults, {"silent": true});


// Add some minor facilities:
function dummyLogging()
{
    console.log.apply(console, arguments);
}

CONF.LOG =
{
    DUMMY:
    {
        trace: dummyLogging,
        debug: dummyLogging,
        info:  dummyLogging,
        warn:  dummyLogging,
        error: dummyLogging,
        fatal: dummyLogging
    }
};


module.exports = CONF;
