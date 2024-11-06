// server.js

import express from 'express';
import next from 'next';
import mongoose from 'mongoose';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGODB_URI = process.env.MONGODB_URL || 'mongodb+srv://admin:admin@fstudiocluster.tmihq.mongodb.net/FrameStudioData?retryWrites=true&w=majority&appName=FSTUDIOCLUSTER';

const TYPE = "service_account"
const PROJECT_ID = "frame-studio-439515"
const PRIVATE_KEY_ID = "934e617b0a62da986ffaef14d3036fb4b3405fed"
const PRIVATE_KEY =  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC44DQm9SHcMQnk\n1JJAFjoRSwIQV5vD1cCzYF5rotlunfYrVypJCbtf6HddjDiShI280Gq8ItdiuGUF\n1TKVxFS2Ey5HvkylFuZXCwBXiaGi3CmpxC5u0h+WB61SlAJOYp0SwOR9uqD5dUcS\n6fBUguqWsF+hu1XFjj7isl8aH8GyfUeS4w5CA+ipjiV/UcxPvtK5wmqGgHhS3H62\n+Svv0hFNpeAMdh0WiZzN85OjjwFLiZl1MQwRCzc2dDHTk3W3H9Hn1KvKbHOUPtgX\n+oKejzDWiR+uVvDsoUgQ77ubQCnSDD3SDFe1qN+oYODTKOAApX9YTSGFroW5bQkN\n6FFN5oSlAgMBAAECggEAFrfqgL0P36ShEB81J63zjct3YfW6HPsn9oMJp1V4Pbko\nlpPcDOSmw3boMDU6gHrMhh7gduUbLbT2KRzVXgUl2cgKoGNYvNLPFHQ0Iw21MLO4\nZPXINPMaUY/48xRgIizJG5Rbn72u6WjJhp/72g7KcCEVZ2UDecbsoGQF/spXPa0k\n8yxVf62Rxra6lX90zNXfownMnEz7sHX+bc92ZDTU/MCzyv5XShipXiLr3sdn3274\ncMT5H67M2Sv5Fjl/1qsENdT+8WTOuJ7zek5DXBoSbm1BtQU1LEW+osBm38u1Qm0L\n18EubGpzP5KGPSHL9zs0CSDXpZmhC3NRXxGZVwpLQwKBgQDlUKutvpQ56arm5G7l\nKwZr5YXmpem167R8lbK9FvXm+Id9f9OjHCHQxgK1dKppNct31uXOYOMridAlwiOp\nanEYkZN5Ln3icwq0/EwQ/+Kid6l4TUawY/HShIHCXeVaTQA/lf7ojucjm4+SMTVD\nATB7aRZ08HdVCIpNZNa6msoYjwKBgQDOY63wSZzesR9MI6aDYp7syLcphLRSbvxu\nZ3cX1u4GE4TyFEiCUwfEsc2+GnHiZKThVie0vjFn8DHbxthD8SvPtEZ7R1ZtvJdL\nfGMSEjUlSAtXZKh95nHr8OBrkp8zEttRaaaYoYIHAQwu96Y9VS6xb37e20QrtrUH\nRTmw/9NhiwKBgFZ8N1N+1g6Fd0Q/kSdzM6fL19Vma5+F9vspxlCUcUecIhWN+TbC\nLGq901W2W3L0q/lVnjRYzDSmdE9ZSfPiRic6+ECy7R1TwA0EPngG2eXmdY7+rhNm\njlSUTxAMM6z774ULwCjbhIcka2B6mJjdwPg6aRLPgmIap3aK+oVETcY3AoGAUUZP\nqOBUNh3qBUHEwNiFXRlth5wKpquuHIwCChFJinsFT49NPoUT+hFKxCIF1vFrPJGA\n8Vw0eInOGI4lfBvs9M45MzLUhkJOEhvZp7Qj2ZqVXMT21R16nz8sITCMIMC8PUMt\np81yNu/irFw5ys1Qpe8SNxCBt/UrNMG+BkW4KCECgYEA05bzkI+mC86slCUurEeK\n8QNPyqg/PoLQnzeAdVfcrJNCyMrJMiYmogAY81x5HjFDuzXh655uDwfgbP3MV0hQ\noj3Kk8tpZWsY5l1yqNBMLvzGT1mjRyxfGVPhhTtjBvUw4Q+YSNdpYf0BDuGFczGA\nHt0tpsqVjUDc6scQCAVGP8A=\n-----END PRIVATE KEY-----\n"
const CLIENT_EMAIL =  "frame-studio@frame-studio-439515.iam.gserviceaccount.com"
const CLIENT_ID =  "112653429135640403083"
const AUTH_URI = "https://accounts.google.com/o/oauth2/auth"
const TOKEN_URI = "https://oauth2.googleapis.com/token"
const AUTH_PROVIDER_X509_CERT_URL = "https://www.googleapis.com/oauth2/v1/certs"
const CLIENT_X509_CERT_URL = "https://www.googleapis.com/robot/v1/metadata/x509/frame-studio%40frame-studio-439515.iam.gserviceaccount.com"
const UNIVERSE_DOMAIN = "googleapis.com"

const server = express();

async function checkMongoDBConnection() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      // console.log('MongoDB is connected');
    } else {
      // console.log('MongoDB is already connected');
    }
  } catch (error) {
    // console.error('MongoDB connection error:', error);
  }
}

// Function to check Google Drive connection
async function checkGoogleDriveConnection() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: TYPE,
        project_id: PROJECT_ID,
        private_key_id: PRIVATE_KEY_ID,
        private_key: PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: CLIENT_EMAIL,
        client_id: CLIENT_ID,
        auth_uri: AUTH_URI,
        token_uri: TOKEN_URI,
        auth_provider_x509_cert_url:AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: CLIENT_X509_CERT_URL,
        universe_domain: UNIVERSE_DOMAIN,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const driveService = google.drive({ version: 'v3', auth });
    const response = await driveService.files.list({
      pageSize: 1,
      fields: 'files(id)',
    });

    if (response.status === 200) {
      // console.log('Google Drive is connected');
    } else {
      // console.error('Google Drive connection failed');
    }
  } catch (error) {
    // console.error('Google Drive connection error:', error);
  }
}

async function checkConnections() {
  await checkMongoDBConnection();
  await checkGoogleDriveConnection();
}

server.all('*', (req, res) => {
  return handle(req, res);
});

app.prepare().then(() => {
  checkConnections().then(() => {
    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  }).catch((error) => {
    // console.error('Error starting the server:', error);
  });
});
