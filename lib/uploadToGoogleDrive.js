//lib/uploadToGoogleDrive.js

"use server"; // if you are using reactjs remove this line this is for nextjs only
import { google } from "googleapis";
import { Readable } from "stream";
import sharp from "sharp";

import { saveFileLink } from "./mongodb"; // Import the function to save links

// Folder IDs
const FOLDER_IDS = {
  digitalArt: "1ocf4KNbvWY1kZn1aa_qORN69D9qDj_2p",
  product: "1Zg0ZXPrOA0Jg3oc64xSc0r8hepoZvJDv",
  photography: "1x-hC-4vIRGS_xNOhaGwi9K7dUCUKWZ61",
};

export const findExistingFile = async (driveService, fileName) => {
  try {
      const response = await driveService.files.list({
          q: `name='${fileName}'`,
          fields: "files(id, webViewLink)",
      });const files = response.data.files;
      if (files && files.length > 0) {
          return files[0]; // Return the first matching file
      } else {
          return null; // File not found
      }
  } catch (error) {
      console.error("Error searching for file:", error);
      throw error;
  }
};


async function uploadToGoogleDrive(
  file,
  type,
  title,
  details,
  category1,
  category2,
  category3,
  clientdetails,
  description
) {
  // const folderId = '1y0AJkIkjthzXBpOeQhF6zT-37qBrjY8w'; // Folder ID where files will be uploaded
  const folderId = FOLDER_IDS[type];

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: process.env.TYPE || "service_account",
      project_id: process.env.PROJECT_ID || "frame-studio-439515",
      private_key_id: process.env.PRIVATE_KEY_ID || "934e617b0a62da986ffaef14d3036fb4b3405fed",
      private_key: (process.env.PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC44DQm9SHcMQnk\n1JJAFjoRSwIQV5vD1cCzYF5rotlunfYrVypJCbtf6HddjDiShI280Gq8ItdiuGUF\n1TKVxFS2Ey5HvkylFuZXCwBXiaGi3CmpxC5u0h+WB61SlAJOYp0SwOR9uqD5dUcS\n6fBUguqWsF+hu1XFjj7isl8aH8GyfUeS4w5CA+ipjiV/UcxPvtK5wmqGgHhS3H62\n+Svv0hFNpeAMdh0WiZzN85OjjwFLiZl1MQwRCzc2dDHTk3W3H9Hn1KvKbHOUPtgX\n+oKejzDWiR+uVvDsoUgQ77ubQCnSDD3SDFe1qN+oYODTKOAApX9YTSGFroW5bQkN\n6FFN5oSlAgMBAAECggEAFrfqgL0P36ShEB81J63zjct3YfW6HPsn9oMJp1V4Pbko\nlpPcDOSmw3boMDU6gHrMhh7gduUbLbT2KRzVXgUl2cgKoGNYvNLPFHQ0Iw21MLO4\nZPXINPMaUY/48xRgIizJG5Rbn72u6WjJhp/72g7KcCEVZ2UDecbsoGQF/spXPa0k\n8yxVf62Rxra6lX90zNXfownMnEz7sHX+bc92ZDTU/MCzyv5XShipXiLr3sdn3274\ncMT5H67M2Sv5Fjl/1qsENdT+8WTOuJ7zek5DXBoSbm1BtQU1LEW+osBm38u1Qm0L\n18EubGpzP5KGPSHL9zs0CSDXpZmhC3NRXxGZVwpLQwKBgQDlUKutvpQ56arm5G7l\nKwZr5YXmpem167R8lbK9FvXm+Id9f9OjHCHQxgK1dKppNct31uXOYOMridAlwiOp\nanEYkZN5Ln3icwq0/EwQ/+Kid6l4TUawY/HShIHCXeVaTQA/lf7ojucjm4+SMTVD\nATB7aRZ08HdVCIpNZNa6msoYjwKBgQDOY63wSZzesR9MI6aDYp7syLcphLRSbvxu\nZ3cX1u4GE4TyFEiCUwfEsc2+GnHiZKThVie0vjFn8DHbxthD8SvPtEZ7R1ZtvJdL\nfGMSEjUlSAtXZKh95nHr8OBrkp8zEttRaaaYoYIHAQwu96Y9VS6xb37e20QrtrUH\nRTmw/9NhiwKBgFZ8N1N+1g6Fd0Q/kSdzM6fL19Vma5+F9vspxlCUcUecIhWN+TbC\nLGq901W2W3L0q/lVnjRYzDSmdE9ZSfPiRic6+ECy7R1TwA0EPngG2eXmdY7+rhNm\njlSUTxAMM6z774ULwCjbhIcka2B6mJjdwPg6aRLPgmIap3aK+oVETcY3AoGAUUZP\nqOBUNh3qBUHEwNiFXRlth5wKpquuHIwCChFJinsFT49NPoUT+hFKxCIF1vFrPJGA\n8Vw0eInOGI4lfBvs9M45MzLUhkJOEhvZp7Qj2ZqVXMT21R16nz8sITCMIMC8PUMt\np81yNu/irFw5ys1Qpe8SNxCBt/UrNMG+BkW4KCECgYEA05bzkI+mC86slCUurEeK\n8QNPyqg/PoLQnzeAdVfcrJNCyMrJMiYmogAY81x5HjFDuzXh655uDwfgbP3MV0hQ\noj3Kk8tpZWsY5l1yqNBMLvzGT1mjRyxfGVPhhTtjBvUw4Q+YSNdpYf0BDuGFczGA\nHt0tpsqVjUDc6scQCAVGP8A=\n-----END PRIVATE KEY-----\n").replace(/\\n/g, "\n"),
      client_email: process.env.CLIENT_EMAIL || "frame-studio@frame-studio-439515.iam.gserviceaccount.com",
      client_id: process.env.CLIENT_ID || "112653429135640403083",
      auth_uri: process.env.AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/frame-studio%40frame-studio-439515.iam.gserviceaccount.com",
      universe_domain: process.env.UNIVERSE_DOMAIN || "googleapis.com",
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const driveService = google.drive({ version: "v3", auth });

try {
  const fileBuffer = await file.arrayBuffer(); // Convert to buffer
  const webpBuffer = await sharp(Buffer.from(fileBuffer))
    .webp({ quality: 100 })
    .toBuffer();
  const readableStream = Readable.from(Buffer.from(webpBuffer));
  const webpFileName = `${file.name.split(".").slice(0, -1).join(".")}.webp`;

  const existingFile = await findExistingFile(driveService, file.name);
  if (existingFile) {
    console.log(`File '${thumbnailName}' already exists. Returning existing link.`);
    return { viewLink: existingFile.webViewLink, success: true };
  }

  const response = await driveService.files.create({
    requestBody: {
      name: webpFileName,
      parents: [folderId],
    },
    media: {
      mimeType: file.type,
      body: readableStream,
    },
    fields: "id, webViewLink",
  });

  const docId = response.data.id;
  const viewLink = response.data.webViewLink;
  
  await driveService.permissions.create({
    fileId: docId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  await saveFileLink({
    name: webpFileName,
    file: viewLink,
    type,
    title,
    details,
    description,
    category1,
    category2,
    category3,
    clientdetails,
  });

  return { viewLink: viewLink, success: true };
} catch (error) {
  console.error("Error uploading file to Google Drive:", error);
  return { success: false, error: error.message || "Unknown error" };
}
}

export { uploadToGoogleDrive };
