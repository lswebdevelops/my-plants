import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";


const Plant = ({ plant }) => {
  return (
    <Card className="my-3 p-3 rounded plants-keyframe">
      <Link to={`/plant/${plant._id}`}>
        <Card.Img src={plant.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/plant/${plant._id}`}>
          <Card.Title as="div" className="plant-title">
            <strong>{plant.name}</strong>
          </Card.Title>
        </Link>
       
      </Card.Body>
    </Card>
  );
};

export default Plant;
