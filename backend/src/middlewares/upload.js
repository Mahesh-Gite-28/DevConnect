const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `profile/${req.user._id}-${Date.now()}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
