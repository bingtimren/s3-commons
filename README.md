# s3-commons

Common helper functions to make using AWS S3 service easier

## Usage

```Javascript
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const s3c = require('s3-commons')
await s3c.deleteRecursive(s3, 'your-bucket','/folder/to/empty')
```

## deleteRecursive
Definition:

```Typescript
async function deleteRecursive(s3: AWS.S3, bucket: string, dir: string, returnList: boolean = false): Promise<number | string[]
```

Parameters:
- s3: the S3 service instance
- bucket: string, bucket name
- dir: string, the path prefix
- returnList: boolean, default false to only return the count of deleted objects, if true return a list of deleted keys

Returns: depending on parameter 'returnList', either return a number that is count of deleted keys, or an array of string that is array of deleted keys



