import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdatePlantMutation,
  useGetPlantDetailsQuery,
  useUploadPlantImageMutation,
} from "../../slices/plantsApiSlice";

const PlantEditScreen = () => {
  const { id: plantId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: plant,
    isLoading,
    error,
  } = useGetPlantDetailsQuery(plantId);

  const [updatePlant, { isLoading: loadingUpdate }] =
    useUpdatePlantMutation();

  const [uploadPlantImage, { isLoading: loadingUpload }] =
    useUploadPlantImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (plant) {
      setName(plant.name);
      setPrice(plant.price);
      setImage(plant.image);
      setBrand(plant.brand);
      setCategory(plant.category);
      setCountInStock(plant.countInStock);
      setDescription(plant.description);
    }
  }, [plant]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedPlant = {
      plantId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updatePlant(updatedPlant);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Plant updated");
      navigate("/admin/plantlist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadPlantImage(formData).unwrap();
      toast.success(res.message);

      // Normalize the path to always use forward slashes
      const imageUrl = res.image.replace(/\\/g, "/");
      setImage(imageUrl); // Set the normalized image URL
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/plantlist" className="btn btn-light my-3">
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar Cultivo</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Cultivo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite nome do cultivo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Meses para plantio (Ex: Setembro a Dezembro: 9,12)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite meses para plantio. Ex: 6-12"
                value={price.toString().replace(".", ",")}
                onChange={(e) => {
                  // Substitui vírgula por ponto para conversão numérica correta
                  const value = e.target.value.replace(",", ".");
                  // Verifica se é um número válido antes de atualizar o estado
                  if (!isNaN(value)) {
                    setPrice(value);
                  }
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Imagem</Form.Label>              
              <Form.Control
                type="file"
                label="Escolha arquivo"
                onChange={uploadFileHandler}
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              {/* Estação > brand */}
              <Form.Label>Estação</Form.Label>
              <Form.Control
                type="text"
                placeholder="Estação para cultivo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              {/* Plantas companheiras>> > category */}
              <Form.Label>Plantas companheiras</Form.Label>
              <Form.Control
                type="text"
                placeholder="Plantas companheiras"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Sobre o cultivo</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                 rows={5}
                placeholder="Digite uma descrição sobre o cultivo"
                value={description}
                maxLength="2000"
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              Salvar
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default PlantEditScreen;
