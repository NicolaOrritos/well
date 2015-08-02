# Well
_Well_ is a fast, lightweight service that accepts JSON documents and saves them into one or more data-stores.  
It's storage-agnostic and can be expanded with drivers for (virtually) any data-storage.  
Currently drivers for MongoDB and Redis have been implemented, but more are on their way: next ones planned are CSV and RethinkDB.


## Getting Started
First things first, install it:
```Bash
$ sudo npm install -g node-well
```
Then configure buckets and the _well_ server:
```Bash
$ sudo touch /etc/well.conf
```
Here's a simple configuration, using the MongoDB driver:
```JSON
{
    "PORT": 6666,
    "BUCKETS":
    {
        "default":
        {
            "DRIVER": "mongodb",
            "HOST": "localhost",
            "PORT": 27017,
            "DB":   "DefaultBucket"
        }
    }
}
```

But you can add as many buckets as needed:
```JSON
{
    "PORT": 6666,
    "BUCKETS":
    {
        "default":
        {
            "DRIVER": "mongodb",
            "HOST": "localhost",
            "PORT": 27017,
            "DB":   "DefaultBucket"
        },

        "second":
        {
            "DRIVER": "redis",
            "HOST": "10.0.0.123",
            "PORT": 6379,
            "DB":   2
        },

        "third":
        {
            "DRIVER": "mongodb",
            "HOST": "10.0.0.222",
            "PORT": 27017,
            "DB":   "ThirdBucket"
        }
    }
}
```
The only rule of the _well_ configuration (club) is _"You must have the default bucket configured"_.  
That's all.

Once configured you can start it:
```Bash
$ sudo well
```


## Examples
Provided it's configured to listen on port 6666 _well_ will accept incoming *POST requests* at the following paths:

    http://localhost:6666/well/push
    http://localhost:6666/well/push/<BUCKET>

First one pushes to the default bucket while the second one to a specific one.  
This is a typical request, posting a simple JSON to the server:
```Bash
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' localhost:6666/well/push/mybucket
```

**Content-Type must be "application/json".**  
After posting it the previous request is simply routed to the data-storage instance configured as "mybucket" in _/etc/well.conf_.  
Data POST-ed to _http://localhost:6666/well/push_ will be routed to the default bucket instead.

Here's the answer returned by _well_ when the POST is successful:

    {"status":"ok"}


## Drivers
Writing a driver is as simple as implementing the following function and exporting it in a module:
```Javascript
module.exports =
{  save: function(data, conf, log, callback) {}  }
```
- 'data' is a Javascript object, required to be saved by the driver.
- 'conf' is a Javascript object, containing all the relevant configurations needed by the driver to know how and where to save the data.
- 'log'  is a Javascript object exposing three methods to be used for logging purposes: 'info', 'debug' and 'error'.
- 'callback' is a _Node-style_ callback to be called once the data have been saved. It takes one or zero arguments: if and only if an error occurred the only argument must be populated with that one error.


## License

Copyright (c) 2015 Nicola Orritos  
Licensed under the MIT license.
