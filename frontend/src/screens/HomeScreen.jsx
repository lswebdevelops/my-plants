import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetPlantsQuery } from "../slices/plantsApiSlice";
import { Link } from "react-router-dom";
import Plant from "../components/Plant";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
// import PlantCarousel from "../components/PlantCarousel";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetPlantsQuery({
    keyword,
    pageNumber,
  });

  return (
    <div className="plantHomeScreenContainer ">
      <div className="homeScreen">
        {!keyword ? (
          // for showing the carousel "comment out || uncomment"
          // <PlantCarousel /> 
          // || 
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
            <h1 className="h1-recent-titles">Meus Cultivos:</h1>
            <Row>
              {data.plants.map((plant) => (
                <Col key={plant._id} sm={12} md={6} lg={4} xl={3}>
                  {/* <Plant plant={plant} /> */}
                  {/* aqui adicionar meus cultivos */}
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

export default HomeScreen;
