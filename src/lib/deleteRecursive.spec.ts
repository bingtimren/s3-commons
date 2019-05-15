/* tslint:disable */

process.env.AWS_SDK_LOAD_CONFIG = 'true';
import test from 'ava';
import AWS from 'aws-sdk';
import { deleteRecursive, deleteRecursiveVerbose } from './deleteRecursive';

async function putObj(s3: AWS.S3, bucketName: string, t: any) {
  await s3
    .putObject({
      Body: 'file 1',
      Bucket: bucketName,
      Key: '/a/b/c/file1.txt'
    })
    .promise();
  await s3
    .putObject({
      Body: 'file 2',
      Bucket: bucketName,
      Key: '/a/d/e/file2.txt'
    })
    .promise();
  await t.notThrowsAsync(async () => {
    await s3
      .headObject({ Bucket: bucketName, Key: '/a/b/c/file1.txt' })
      .promise();
    await s3
      .headObject({ Bucket: bucketName, Key: '/a/d/e/file2.txt' })
      .promise();
  });
  console.log(`Objects put`);
}

async function assertNotFound(s3: AWS.S3, bucketName: string, t: any) {
  // await s3.headObject({ Bucket:bucketName,Key:"/a/b/c/file1.txt"}).promise()
  const err1 = await t.throwsAsync(async () => {
    await s3
      .headObject({ Bucket: bucketName, Key: '/a/b/c/file1.txt' })
      .promise();
  });
  t.is('NotFound', err1.code);
  const err2 = await t.throwsAsync(async () => {
    await s3
      .headObject({ Bucket: bucketName, Key: '/a/d/e/file2.txt' })
      .promise();
  });
  t.is('NotFound', err2.code);
}

test('delete recursive', async t => {
  const s3 = new AWS.S3();
  const bucketName = `test-bucket-78h23kb387g23eb12u-safe-to-remove`;
  console.log(`Creating bucket ${bucketName}`);
  await s3
    .createBucket({
      Bucket: bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-west-1'
      }
    })
    .promise();
  await s3.headBucket({ Bucket: bucketName }).promise();
  console.log(`Bucket ${bucketName} created`);
  try {
    await putObj(s3, bucketName, t);
    await t.notThrowsAsync(async () => {
      const list = await deleteRecursiveVerbose(s3, bucketName, '/a');
      t.is(true, list.findIndex(v => v === '/a/b/c/file1.txt') >= 0);
      t.is(true, list.findIndex(v => v === '/a/d/e/file2.txt') >= 0);
      t.is(2, list.length);
    });
    await assertNotFound(s3, bucketName, t);
    // test again, count only
    await putObj(s3, bucketName, t);
    await t.notThrowsAsync(async () => {
      const count = await deleteRecursive(s3, bucketName, '/a');
      t.is(2, count);
    });
    await assertNotFound(s3, bucketName, t);
  } finally {
    await s3.deleteBucket({ Bucket: bucketName }).promise();
    console.log('Bucket deleted');
  }
});
