const mongoose = require("mongoose");
const Book = require("../models/book");

exports.books_get_all = (req, res, next) => {
    Book.find()
      .select("name author pages price _id bookImage")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          books: docs.map(doc => {
            return {
              name: doc.name,
              author:doc.author,
              pages:doc.pages,
              price: doc.price,
              bookImage: doc.bookImage,
              _id: doc._id,
              request: {
                type: "GET",
                url: "http://localhost:3000/books/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

  exports.books_create_book = (req, res, next) => {
    const book = new Book({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      bookImage: req.file.path,
      author:req.body.author,
      pages:req.body.pages
    });
    book
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created book successfully",
          createdbook: {
              name: result.name,
              price: result.price,
              author:req.body.author,
              pages:req.body.pages,
              _id: result._id,
              request: {
                  type: 'GET',
                  url: "http://localhost:3000/books/" + result._id
              }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

  exports.books_get_book = (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
      .select('name author pages price _id bookImage')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              book: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/books'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  };

exports.books_update_book = (req, res, next) => {
    const id = req.params.bookId;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Book.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Book updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/books/' + id
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

exports.books_delete_book = (req, res, next) => {
    const id = req.params.bookId;
    Book.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Book deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/books',
                body: { name: 'String', price: 'Number', author: 'String', pages: 'Number' }
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };