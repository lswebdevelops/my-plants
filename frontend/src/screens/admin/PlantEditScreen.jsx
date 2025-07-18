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
    const [image, setImage] = useState("");
    const [companions, setCompanions] = useState("");
    const [season, setSeason] = useState("");
    const [monthsNorte, setMonthsNorte] = useState("");
    const [monthsNordeste, setMonthsNordeste] = useState("");
    const [monthsSul, setMonthsSul] = useState("");
    const [monthsSudeste, setMonthsSudeste] = useState("");
    const [monthsCentroOeste, setMonthsCentroOeste] = useState("");
    const [info, setInfo] = useState("");

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
            setImage(plant.image);
            setCompanions(plant.companions ? plant.companions.join(", ") : "");
            setSeason(plant.season ? plant.season.join(", ") : "");
            setMonthsNorte(plant.monthsByRegion?.norte ? plant.monthsByRegion.norte.join(", ") : "");
            setMonthsNordeste(plant.monthsByRegion?.nordeste ? plant.monthsByRegion.nordeste.join(", ") : "");
            setMonthsSul(plant.monthsByRegion?.sul ? plant.monthsByRegion.sul.join(", ") : "");
            setMonthsSudeste(plant.monthsByRegion?.sudeste ? plant.monthsByRegion.sudeste.join(", ") : "");
            setMonthsCentroOeste(plant.monthsByRegion?.centroOeste ? plant.monthsByRegion.centroOeste.join(", ") : "");
            setInfo(plant.info);
        }
    }, [plant]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedPlant = {
            plantId,
            name,
            image,
            companions: companions.split(",").map((c) => c.trim()),
            season: season.split(",").map((s) => s.trim()),
            monthsByRegion: {
                norte: monthsNorte.split(",").map((m) => parseInt(m.trim())).filter(m => !isNaN(m)),
                nordeste: monthsNordeste.split(",").map((m) => parseInt(m.trim())).filter(m => !isNaN(m)),
                sul: monthsSul.split(",").map((m) => parseInt(m.trim())).filter(m => !isNaN(m)),
                sudeste: monthsSudeste.split(",").map((m) => parseInt(m.trim())).filter(m => !isNaN(m)),
                centroOeste: monthsCentroOeste.split(",").map((m) => parseInt(m.trim())).filter(m => !isNaN(m)),
            },
            info,
        };

        const result = await updatePlant(updatedPlant);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Cultivo atualizado");
            navigate("/admin/plantlist");
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        try {
            const res = await uploadPlantImage(formData).unwrap();
            toast.success(res.message);
            const imageUrl = res.image.replace(/\\/g, "/");
            setImage(imageUrl);
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
                            <Form.Label>Nome do Cultivo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Digite nome do cultivo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="imageFile" className="my-2">
                            <Form.Label>Imagem(somente .png, .jpg, .jpeg)</Form.Label>
                            <Form.Control
                                type="file"
                                label="Escolha arquivo"
                                onChange={uploadFileHandler}
                            ></Form.Control>
                            {loadingUpload && <Loader />}
                        </Form.Group>

                        <Form.Group controlId="companions" className="my-2">
                            <Form.Label>Plantas Companheiras (separadas por vírgula)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: Manjericão, Calêndula"
                                value={companions}
                                onChange={(e) => setCompanions(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="season" className="my-2">
                            <Form.Label>Estações de Cultivo (separadas por vírgula)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: Primavera, Verão"
                                value={season}
                                onChange={(e) => setSeason(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="monthsNorte" className="my-2">
                            <Form.Label>Meses de Plantio - Região Norte (separados por vírgula)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: 1, 2, 3"
                                value={monthsNorte}
                                onChange={(e) => setMonthsNorte(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="monthsNordeste" className="my-2">
                            <Form.Label>Meses de Plantio - Região Nordeste (separados por vírgula)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: 2, 3, 4"
                                value={monthsNordeste}
                                onChange={(e) => setMonthsNordeste(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="monthsSul" className="my-2">
                            <Form.Label>Meses de Plantio - Região Sul (separados por vírgula)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: 9, 10, 11"
                                value={monthsSul}
                                onChange={(e) => setMonthsSul(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="monthsSudeste" className="my-2">
                            <Form.Label>Meses de Plantio - Região Sudeste (separados por vírgula)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: 9, 10, 11, 12"
                                value={monthsSudeste}
                                onChange={(e) => setMonthsSudeste(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="monthsCentroOeste" className="my-2">
                            <Form.Label>Meses de Plantio - Região Centro-Oeste (separados por vírgula)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ex: 3, 4, 5"
                                value={monthsCentroOeste}
                                onChange={(e) => setMonthsCentroOeste(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="info" className="my-2">
                            <Form.Label>Informações sobre o Cultivo</Form.Label>
                            <Form.Control
                                type="text"
                                as="textarea"
                                rows={5}
                                placeholder="Digite informações sobre o cultivo"
                                value={info}
                                maxLength="2000"
                                onChange={(e) => setInfo(e.target.value)}
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