# Well
_Well_ is a fast, lightweight service that accepts JSON documents and stores them away into MongoDB servers.



## "WELL" IS ALMOST READY FOR PRIME-TIME, BUT IT'S NOT THERE YET: THIS NOTICE WILL DISAPPEAR ONCE IT'S DONE.



## Getting Started
First things first, install it:
```Bash
$ sudo npm install -g well
```
Then configure buckets and the _well_ server:
```Bash
$ sudo touch /etc/well.js
```
Here's the typical configuration:
```JSON
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
            "HOST": "localhost",
            "PORT": 27017,
            "DB":   "DefaultBucket"
        },
        
        "second":
        {
            "HOST": "10.0.0.123",
            "PORT": 27017,
            "DB":   "SecondBucket"
        },
        
        "third":
        {
            "HOST": "10.0.0.123",
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
This is a typical (pseudo-coded) request:

    POST http://localhost:6666/well/push/mybucket
    {
        "key": "value",
        "object":
        {
            "array": [1, 2, 3]
        }
    }

After posting it the previous request is simply routed to the MongoDB instance configured as "mybucket" in _/etc/well.conf_.  
Data POST-ed to _http://localhost:6666/well/push_ will be routed to the default bucket instead.


## License

Copyright (c) 2015 Nicola Orritos  
Licensed under the MIT license.
