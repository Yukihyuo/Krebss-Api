import "dotenv/config";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs"

const BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const PUBLIC_ACCESS_KEY = process.env.AWS_PUBLIC_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const client = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: PUBLIC_ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});


const streamToString = (stream) =>
  new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });




export const uploadFile = async (name,data) => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: name,
    Body: data,
  };
  const command = new PutObjectCommand(uploadParams);
  return await client.send(command);
};

export const readFile = async (data) => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: data,
  };
  const command = new GetObjectCommand(uploadParams);
  // return await client.send(command);
   const response = await client.send(command);
  const bodyContents = await response.Body.transformToString('base64')
  return `data:${response.ContentType};base64,${bodyContents}`;
};
