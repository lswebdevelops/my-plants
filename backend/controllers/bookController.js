import asyncHandler from "../middleware/asyncHandler.js";
import Book from "../models/bookModel.js";
import cloudinary2 from "../config/cloudinary2.js";
import fs from "fs";

// @desc Fetch all books
// @route get /api/books
// @access Public

const getBooks = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Book.countDocuments({ ...keyword });

  const books = await Book.find({ ...keyword })
  .sort({ createdAt: -1})// newest books first
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ books, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a book
// @route get /api/books/:id
// @access Public

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado.");
  }
});

// @desc create a new book
// @route post /api/books
// @access private admin

const createBook = asyncHandler(async (req, res) => {
  const book = new Book({
    name: "Título da obra",
    price: 0,
    user: req.user._id,
    image: "https://res.cloudinary.com/dvnxrzpnl/image/upload/v1750946977/samplebook2_qrxwni.png",
    brand: "Editora X",
    category: "Harry Wiese",
    countInStock: 0,
    numReviews: 0,
    description: "Thriller psicológico envolvente que mergulha nas profundezas da mente humana e das escolhas morais em meio ao caos.Quando o renomado neurocientista Dr. Alan Reeves descobre um experimento secreto capaz de reprogramar a memória, ele se vê dividido entre a ética e a ambição. Mas sua pesquisa atrai a atenção de uma organização misteriosa que deseja usar sua invenção para fins obscuros. À medida que Alan luta para proteger seu trabalho, ele começa a questionar sua própria realidade. Memórias antes sólidas se tornam distorcidas, pessoas próximas a ele agem de forma estranha, e a linha entre verdade e ilusão começa a se desfazer. Com reviravoltas surpreendentes e um ritmo eletrizante, Book Sample desafia o leitor a questionar: e se suas lembranças não fossem realmente suas?",
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc update a book
// @route PUT  /api/book/:id
// @access private admin

const updateBook = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.name = name;
    book.price = price;
    book.description = description;
    book.image = image;
    book.brand = brand;
    book.category = category;
    book.countInStock = countInStock;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error("Book not found");
  }
});

// @desc delete a book
// @route delete  /api/book/:id
// @access private admin

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await Book.deleteOne({ _id: book._id });
    res.status(200).json({ message: "Livro deletado" });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});

// @desc create a new review
// @route post  /api/books/:id/reviews
// @access private

const createBookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const book = await Book.findById(req.params.id);

  if (book) {
    const alreadyReviewed = book.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Obra já avaliada.");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    book.reviews.push(review);

    book.numReviews = book.reviews.length;

    book.rating =
      book.reviews.reduce((acc, review) => acc + review.rating, 0) /
      book.reviews.length;

    await book.save();
    res.status(201).json({ message: "Avaliação adicionada" });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});

// @desc get top rated book
// @route get /api/books/top
// @access Public

const getTopBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json(books);
});

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin

const uploadBookImage = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error("Nenhum arquivo enviado");
  }

  const uploadResult = await cloudinary2.uploader.upload(file.path, {
    folder: "books", // <- isso define a pasta correta
  });

  // 🔍 Adicione isto:
  console.log("Upload result (BOOK):", uploadResult);

  fs.unlinkSync(file.path);

  res.status(200).json({
    message: "Imagem enviada com sucesso",
    image: uploadResult.secure_url,
  });
});



export {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  getTopBooks,
  uploadBookImage,
};
