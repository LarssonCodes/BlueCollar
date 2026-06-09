/**
 * Utility to compress an image file client-side using HTML5 Canvas.
 * Resizes the image to a maximum dimension while maintaining aspect ratio,
 * and outputs it as a compressed JPEG base64 Data URL.
 * 
 * @param {File} file - The image file to compress.
 * @param {Object} options - Compression options.
 * @param {number} options.maxWidth - Maximum width of the compressed image. Defaults to 400.
 * @param {number} options.maxHeight - Maximum height of the compressed image. Defaults to 400.
 * @param {number} options.quality - Quality of compression (0 to 1). Defaults to 0.7.
 * @param {string} options.outputType - MIME type of output. Defaults to 'image/jpeg'.
 * @returns {Promise<string>} - Resolves to the compressed image as a base64 Data URL.
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const maxWidth = options.maxWidth || 400;
    const maxHeight = options.maxHeight || 400;
    const quality = options.quality !== undefined ? options.quality : 0.7;
    const outputType = options.outputType || 'image/jpeg';

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Clean up the object URL to free memory
      URL.revokeObjectURL(objectUrl);

      let width = img.width;
      let height = img.height;

      // Calculate new dimensions to maintain aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      // Set white background for JPEG outputs to prevent transparent PNGs from having black backgrounds
      if (outputType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to base64 with requested quality
      try {
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
};
