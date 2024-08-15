import { tokenGenerate } from '@vonage/jwt';
import axios from 'axios';
import fs from 'fs';

const applicationId = process.env.API_APPLICATION_ID || process.env.VONAGE_APPLICATION_ID;
const privateKey = process.env.PRIVATE_KEY || fs.readFileSync("./private.key");
const apiKey = process.env.VCR_API_ACCOUNT_ID || process.env.VONAGE_API_KEY;
const apiSecret = process.env.VCR_API_ACCOUNT_SECRET || process.env.VONAGE_API_SECRET;
const sipDomain = process.env.SIP_DOMAIN_NAME;

function generateJwt(username) {
    const exp = Math.round(new Date().getTime() / 1000) + 86400;
    
    const aclPaths = {
    "paths": {
      "/*/users/**": {},
      "/*/conversations/**": {},
      "/*/sessions/**": {},
      "/*/devices/**": {},
      "/*/image/**": {},
      "/*/media/**": {},
      "/*/applications/**": {},
      "/*/push/**": {},
      "/*/knocking/**": {},
      "/*/legs/**": {},
      "/*/rtc/**": {}
       }
    }

    if (!username) {
        return tokenGenerate(applicationId, privateKey, { exp: exp });
    }
    
    return tokenGenerate(applicationId, privateKey, {
      sub: username,
      exp: exp,
      acl: aclPaths
    });
}

function findObjectWithValue(arr, value) {
    return arr.find(obj => Object.values(obj).includes(value));
}

// Get SIP URI via PSIP API
async function getSipInfo() {
    const url = `https://api.nexmo.com/v1/psip/${sipDomain}/endpoints`;
    const token = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const config = {
      headers: { 'Authorization': `Basic ${token}` }
    };
  
    const response = await axios.get(url, config);
    return response.data[0].uri;
  }
  
  // Get SIP Domain Info via PSIP API
  async function getDomainInfo() {
    const url = `https://api.nexmo.com/v1/psip/${sipDomain}`;
    const token = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const config = {
      headers: { 'Authorization': `Basic ${token}` }
    };
  
    const response = await axios.get(url, config);
    return response.data;
  }

export {
    getSipInfo,
    generateJwt,
    getDomainInfo,
    findObjectWithValue
}