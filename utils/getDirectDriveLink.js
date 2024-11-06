// lib/utils/getDirectDriveLink.js

export const getDirectDriveLink = (fileLink) => {
  if (typeof fileLink !== 'string') {
    console.warn("Invalid fileLink provided to getDirectDriveLink:", fileLink);
    return ''; // Return an empty string or a fallback URL if needed
  }
  
  const match = fileLink.match(/\/d\/(.*?)\//);
  return match
    ? `https://drive.google.com/uc?export=view&id=${match[1]}`
    : fileLink;
};
