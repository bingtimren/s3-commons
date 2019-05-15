import AWS from 'aws-sdk';

// From Emi's answer in this post
// https://stackoverflow.com/questions/20207063/how-can-i-delete-folder-on-s3-with-node-js

/**
 * Recursively remove objects in bucket under dir
 * @param s3
 * @param bucket
 * @param dir
 * @param returnList - return a list of deleted keys, default false & return just count of deleted keys
 */
export async function deleteRecursive(
  s3: AWS.S3,
  bucket: string,
  dir: string,
  returnList: boolean = false
): Promise<number | string[]> {
  let count: number = 0;
  const list: string[] = [];
  while (true) {
    // list objects
    const listedObjects = await s3
      .listObjectsV2({
        Bucket: bucket,
        Prefix: dir
      })
      .promise();
    if (listedObjects.Contents === undefined) {
      throw new Error('Listing S3 returns no contents');
    }
    if (listedObjects.Contents.length !== 0) {
      // prepare delete request
      const deleteParams = {
        Bucket: bucket,
        Delete: {
          Objects: listedObjects.Contents.map(obj => ({
            Key: obj.Key as string
          }))
        }
      };
      // listedObjects.Contents.forEach(({ Key }) => {
      //     deleteParams.Delete.Objects.push({ Key as string });
      // });
      await s3.deleteObjects(deleteParams).promise();
      // count or list
      if (returnList) {
        deleteParams.Delete.Objects.forEach(obj => list.push(obj.Key));
      } else {
        count += deleteParams.Delete.Objects.length;
      }
    }
    if (!listedObjects.IsTruncated) {
      return returnList ? list : count;
    }
  }
}
