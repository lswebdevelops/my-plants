import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
  useGetPlantsQuery,
  useCreatePlantMutation,
  useDeletePlantMutation,
} from "../../slices/plantsApiSlice";
import { toast } from "react-toastify";

const PlantListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetPlantsQuery({ pageNumber });

  const [createPlant, { isLoading: loadingCreate }] = useCreatePlantMutation();

  const [deletePlant, { isLoading: loadingDelete }] = useDeletePlantMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deletePlant(id);
        toast.success("Plant deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createPlantHandler = async () => {
    if (!window.confirm("Tem certeza de que deseja criar um novo livro?")) {
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
          <Paginate pages={data?.pages} page={data?.page} isAdmin={true} />
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
                <th>id(Código)</th>
                <th>name(Cultivo)</th>
                <th>price(mes a plantar. ex: 6-12)</th>
                <th>category(Plantar com:ex(abóbora com tomate))</th>
                <th>brand(Estaçao)</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {data.plants.map((plant) => (
                <tr key={plant._id}>
                  <td>{plant._id}</td>
                  <td>{plant.name}</td>
                  <td>{plant.price}</td>
                  <td>{plant.category}</td>
                  <td>{plant.brand}</td>
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
