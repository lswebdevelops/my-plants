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

          <Row>
            <Col md={3} sm={8}>
              <Rating
                value={book.rating}
                text={`${book.numReviews} ${
                  book.numReviews === 1 ? "avaliação" : "avaliações"
                }`}
              />
            </Col>
            <Col md={6}></Col>
            <Col md={3}>
              <Card  className="ml-button">
                <ListGroup variant="flush">
                  <Button className="btn-block " type="button">
                    <a
                      href="https://www.mercadolivre.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "white", textDecoration: "none" }}
                    >
                     Comprar no Mercado Livre
                    </a>
                  </Button>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <hr />

          <Row className="review">
            <Col md={6}>
              <h2 className="book-rating-h2">Avaliações</h2>
              {book.reviews.length === 0 && (
                <Message>Nenhuma Avaliação</Message>
              )}
              <ListGroup variant="flush">
                {book.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>
                      {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <p id="parag-review-comment">{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2 className="book-rating-h2">Deixe sua Avaliação</h2>

                  {loadingBookReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Avaliações</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Selecione...</option>
                          <option value="1">1 - Ruim</option>
                          <option value="2">2 - Regular</option>
                          <option value="3">3 - Bom</option>
                          <option value="4">4 - Muito Bom</option>
                          <option value="5">5 - Excelente</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          maxLength="330"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingBookReview}
                        type="submit"
                        variant="primary"
                      >
                        Salvar
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Por favor, <Link to="/login">logue aqui</Link> para deixar
                      sua avaliação
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default BookScreen;
