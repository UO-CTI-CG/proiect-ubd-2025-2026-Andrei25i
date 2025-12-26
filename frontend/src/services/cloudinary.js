import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const uploadImagesToCloudinary = async (images) => {
  if (!images || images.length === 0) return [];

  const uploadPromises = images.map(async (image) => {
    if (!allowedTypes.includes(image.type)) {
      console.error(`Fișierul ${image.name} nu este o imagine validă.`);
      return null;
    }

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );

      return {
        url: res.data.secure_url,
        public_id: res.data.public_id,
      };
    } catch (err) {
      console.error(`Eroare la upload pentru imaginea ${image.name}:`, err);
      return null;
    }
  });

  const results = await Promise.all(uploadPromises);

  return results.filter((img) => img !== null);
};
