import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dbsagmixt', 
  api_key: '794921628947665', 
  api_secret: 'K-h6lTgd4btIwSJPOtXLO4n2ll4',
  secure: true
});

export default cloudinary