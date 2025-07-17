import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Row,
  Col,
  Form,
  Image,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import Rating from "../components/Rating";
import {
  useGetBookDetailsQuery,
  useCreateReviewMutation,
} from "../slices/booksApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const BookScreen = () => {
  const { id: bookId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: book,
    isLoading,
    refetch,
    error,
  } = useGetBookDetailsQuery(bookId);

  const [createReview, { isLoading: loadingBookReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        bookId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review adicionado");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Voltar
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="upper-div-book-div">
          <Row className="upper-div-book">
            <Col md={3} sm={8}>
              <Image
                src={book.image}
                alt={book.name}
                className="image-book-book"
                fluid
              />
            </Col>
            <Col md={9}>
              <h3>{book.name}</h3>
              <h4>{book.category}</h4>
              <p>{book.description}</p>
            </Col>
          </Row>

          </div>

          <hr />

        
        </>
      )}
    </>
  );
};

export default BookScreen;
