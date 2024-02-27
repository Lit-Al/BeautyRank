export const base64ToFileFunction = (image: string) => {
  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    return new File([buffer], 'avatar.jpg', {
      type: 'image/jpeg',
    });
  }
};
