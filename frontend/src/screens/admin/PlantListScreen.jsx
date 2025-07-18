import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

import {
  useGetPlantsQuery,
  useCreatePlantMutation,
  useDeletePlantMutation,
} from "../../slices/plantsApiSlice";
import { toast } from "react-toastify";

const monthMap = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

const sortMonths = (months) =>
  months ? [...months].sort((a, b) => a - b) : [];

const PlantListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetPlantsQuery({ pageNumber });

  const [createPlant, { isLoading: loadingCreate }] = useCreatePlantMutation();

  const [deletePlant, { isLoading: loadingDelete }] = useDeletePlantMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Tem certeza?")) {
      try {
        await deletePlant(id);
        toast.success("Cultivo deletado com sucesso.");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createPlantHandler = async () => {
    if (!window.confirm("Tem certeza de que deseja criar um novo cultivo?")) {
      return;
    }
    try {
      await createPlant();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Cultivos</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={createPlantHandler} className="btn-sm m-3">
            <FaEdit />
            &nbsp; Criar Cultivo
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error.data.message}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Códido(id)</th>
                <th>Cultivo</th>
                <th>Estação</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.plants.map((plant) => (
                <tr key={plant._id}>
                  <td>{plant._id}</td>
                  <td>{plant.name}</td>
                  {/* REMOVED THE SPACE HERE: Before: <td>{plant.name}</td>{" "} */}
                  <td>{plant.season ? plant.season.join(", ") : ""}</td>
                  <td>
                    <Link to={`/admin/plant/${plant._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(plant._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default PlantListScreen;