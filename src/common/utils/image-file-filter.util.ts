export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(null, false); // Reject without an error - replace null with new Error, if necessary.
  }
  callback(null, true);
};
