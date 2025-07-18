import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, Image } from "react-bootstrap";
import {
  useGetPlantDetailsQuery,
  useCreateReviewMutation,
} from "../slices/plantsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";

const PlantScreen = () => {
  const { id: plantId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: plant,
    isLoading,
    refetch,
    error,
  } = useGetPlantDetailsQuery(plantId);

  const [createReview, { isLoading: loadingPlantReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        plantId,
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
      <Link className="btn btn-light my-3" to="/plants">
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
          <div className="upper-div-plant-div">
            <Row className="upper-div-plant">
              <Col md={3} sm={8}>
                <Image
                  src={plant.image}
                  alt={plant.name}
                  className="image-plant-plant"
                  fluid
                />
              </Col>
              <Col md={9}>
                <h3>
                  <strong>Nome: </strong>
                  {plant.name}
                </h3>
                <hr />
                <p>
                  <strong>
                    Plantas companheiras: <br />
                  </strong>
                  {plant.category}
                </p>
                <hr />
                <p>
                  <strong>Estação: </strong>
                  {plant.brand}
                </p>
                <p>
                  <strong>Meses para cultivo:(Sul do Brasil) </strong>
                  {getMesesTexto(plant.price)}
                </p>

                <hr />
                <p>
                  <strong>Informações: </strong>
                  {plant.description}
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

export default PlantScreen;
