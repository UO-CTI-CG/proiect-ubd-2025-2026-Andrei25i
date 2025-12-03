const getOptimizedImageUrl = (url) => {
  if (!url) return '/placeholder.png';
  if (!url.includes('cloudinary.com')) return url;

  return url.replace('/upload/', '/upload/w_320,h_240,c_fill,q_auto,f_auto/');
};

export default getOptimizedImageUrl;