import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Col, Image } from "react-bootstrap";
import { toast } from "react-toastify";

import {
  useGetPlantDetailsQuery,
  useCreateReviewMutation,
} from "../slices/plantsApiSlice";

import Loader from "../components/Loader";
import Message from "../components/Message";
import PlantCalendar from "../components/PlantCalendar";

const PlantScreen = () => {
  const { id: plantId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const regioes = ["norte", "nordeste", "sul", "sudeste", "centroOeste"];

  const {
    data: plant,
    isLoading,
    error,
    refetch,
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
      toast.success("Review adicionada com sucesso!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
                  <strong>Nome:</strong> {plant.name}
                </h3>
                <hr />

                <h5>Meses de Plantio por Região</h5>
            <PlantCalendar monthsByRegion={plant.monthsByRegion} />



                <hr />

                <p>
                  <strong>Plantas Companheiras:</strong>{" "}
                  {plant.companions && plant.companions.length > 0
                    ? plant.companions.join(", ")
                    : "-"}
                </p>
                <hr />
                <p>
                  <strong>Informações Adicionais:</strong>{" "}
                  {plant.info || plant.description || "-"}
                </p>
              </Col>
            </Row>
          </div>

          {/* Aqui você pode adicionar o form de review, se desejar */}
        </>
      )}
    </>
  );
};

export default PlantScreen;
