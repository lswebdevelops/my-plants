import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetBooksQuery } from "../slices/booksApiSlice";
import { Link } from "react-router-dom";
import Book from "../components/Book";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
// import BookCarousel from "../components/BookCarousel";

const BookScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetBooksQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="bookHomeScreenContainer">

   
    <div className="homeScreen">
      {!keyword ? (
        // for showing the carousel "comment out || uncomment"
        // <BookCarousel /> ||
        ""
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Voltar
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className="booksPageH1">Livros</h1>
          <Row>
            {data.books.map((book) => (
              <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
                <Book book={book} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </div>
    </div>
  );
};

export default BookScreen;
