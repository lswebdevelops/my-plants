import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, Image } from "react-bootstrap";
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

const getMesesTexto = (entrada) => {
  const nomesDosMeses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  if (typeof entrada === "number" && entrada % 1 !== 0) {
    const [inicio, fim] = entrada.toString().split(".").map(Number);
    return `${nomesDosMeses[inicio - 1]} a ${nomesDosMeses[fim - 1]}`;
  }

  // Se vier como string com vírgula, tipo "9,12"
  const partes = String(entrada).split(",").map((num) => parseInt(num.trim()));

  if (partes.length === 1) {
    return nomesDosMeses[partes[0] - 1];
  } else if (partes.length === 2) {
    const [inicio, fim] = partes;
    return `${nomesDosMeses[inicio - 1]} a ${nomesDosMeses[fim - 1]}`;
  } else {
    return partes.map((m) => nomesDosMeses[m - 1]).join(", ");
  }
};

  return (
    <>
      <Link className="btn btn-light my-3" to="/books">
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
                <h3>
                  <strong>Nome: </strong>
                  {book.name}
                </h3>
                <hr />
                <p>
                  <strong>
                    Plantas companheiras: <br />
                  </strong>
                  {book.category}
                </p>
                <hr />
                <p>
                  <strong>Estação: </strong>
                  {book.brand}
                </p>
                <p>
                  <strong>Meses para cultivo:(Sul do Brasil) </strong>
                  {getMesesTexto(book.price)}
                </p>

                <hr />
                <p>
                  <strong>Informações: </strong>
                  {book.description}
                </p>
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
