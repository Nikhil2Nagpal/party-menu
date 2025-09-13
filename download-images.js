import fs from 'fs';
import https from 'https';
import path from 'path';

// Create images directory if it doesn't exist
const imagesDir = path.join('client', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Image URLs for each dish (using free stock food images)
const dishImages = {
  'fish-tikka.jpg': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'kadhai-paneer.jpg': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'butter-chicken.jpg': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'garden-salad.jpg': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'dal-makhni.jpg': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'vegetable-samosa.jpg': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'gulab-jamun.jpg': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'chicken-biryani.jpg': 'https://images.unsplash.com/photo-1563379091-2de6c4b49427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'garlic-naan.jpg': 'https://images.unsplash.com/photo-1628294895950-9805252327bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'chicken-wings.jpg': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'paneer-tikka.jpg': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'seekh-kebab.jpg': 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'rajma-masala.jpg': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'mutton-curry.jpg': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'ras-malai.jpg': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'kulfi.jpg': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'gajar-halwa.jpg': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'kheer.jpg': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'jeera-rice.jpg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240',
  'butter-naan.jpg': 'https://images.unsplash.com/photo-1628294895950-9805252327bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240'
};

// Download each image
Object.entries(dishImages).forEach(([filename, url]) => {
  const filePath = path.join(imagesDir, filename);
  
  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${filename} - already exists`);
    return;
  }
  
  const file = fs.createWriteStream(filePath);
  
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {}); // Delete the file async
    console.error(`Error downloading ${filename}:`, err.message);
  });
});

console.log('Image download script started. Images will be downloaded to client/public/images/');