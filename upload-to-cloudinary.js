const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dyhgyswcn',
  api_key: '926531716543888',
  api_secret: 'hjZuv5Nz1cdr6UXMBgJQjdYyJR0'
});

const folders = ['Frontend/assets assuntos', 'Frontend/Assets home', 'Frontend/pages'];
const maxConcurrentUploads = 5; // Ajuste conforme necessário

async function uploadFile(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    console.log(`Uploaded ${filePath} to ${result.secure_url}`);
  } catch (error) {
    console.error(`Failed to upload ${filePath}: ${error.message}`);
  }
}

async function processFolder(folder) {
  const files = fs.readdirSync(folder, { withFileTypes: true });
  const imageFiles = files.filter(file => file.isFile() && /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(file.name));
  
  const uploadPromises = [];
  for (const file of imageFiles) {
    const filePath = path.join(folder, file.name);
    uploadPromises.push(uploadFile(filePath));

    if (uploadPromises.length === maxConcurrentUploads) {
      await Promise.all(uploadPromises);
      uploadPromises.length = 0; // Limpa o array de promessas
    }
  }

  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises);
  }

  const subDirectories = files.filter(file => file.isDirectory());
  for (const dir of subDirectories) {
    await processFolder(path.join(folder, dir.name));
  }
}

async function main() {
  for (const folder of folders) {
    await processFolder(folder);
  }
  console.log("All images uploaded.");
}

main().catch(console.error);