const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleWare/check-auth');
const BooksController = require('../controllers/books');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


router.get("/", BooksController.books_get_all);

router.post("/", checkAuth, upload.single('bookImage'), BooksController.books_create_book);

router.get("/:bookId", BooksController.books_get_book);

router.patch("/:bookId",  checkAuth, BooksController.books_update_book);

router.delete("/:bookId",  checkAuth, BooksController.books_delete_book);

module.exports = router;