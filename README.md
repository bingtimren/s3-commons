# s3-commons

Common helper functions to make using AWS S3 service easier

## Usage

```Javascript
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const s3c = require('s3-commons')
const count = await s3c.deleteRecursive(
    s3, 
    'your-bucket',
    '/folder/to/empty')
const list = await s3c.deleteRecursiveVerbose(
    s3, 
    'your-bucket',
    '/folder/to/empty')
```

## deleteRecursive & deleteRecursiveVerbose
Both async functions delete objects recursively under a dir (or "prefix" according to S3) and returns a Promise (as all async functions do).

The Promise from deleteRecursive resolves to a number that is count of deleted keys. The Promise from deleteRecursiveVerbose resolves to an array of string that is array of deleted keys

Parameters:
- s3: the S3 service instance
- bucket: string, bucket name
- dir: string, the path prefix
