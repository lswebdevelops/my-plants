import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateBookMutation,
  useGetBookDetailsQuery,
  useUploadBookImageMutation,
} from "../../slices/booksApiSlice";

const BookEditScreen = () => {
  const { id: bookId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: book,
    isLoading,
    error,
  } = useGetBookDetailsQuery(bookId);

  const [updateBook, { isLoading: loadingUpdate }] =
    useUpdateBookMutation();

  const [uploadBookImage, { isLoading: loadingUpload }] =
    useUploadBookImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (book) {
      setName(book.name);
      setPrice(book.price);
      setImage(book.image);
      setBrand(book.brand);
      setCategory(book.category);
      setCountInStock(book.countInStock);
      setDescription(book.description);
    }
  }, [book]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedBook = {
      bookId,
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    };

    const result = await updateBook(updatedBook);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Book updated");
      navigate("/admin/booklist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadBookImage(formData).unwrap();
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
      <Link to="/admin/booklist" className="btn btn-light my-3">
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar Livro</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite título"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* <Form.Group controlId="price" className="my-2">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite preço"
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
            </Form.Group> */}

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
              {/* editora > brand */}
              <Form.Label>Editora</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome da editora"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Quantidade em estoque</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite a quantidade em estoque"
                value={countInStock}
                onChange={(e) => setCountInStock(parseInt(e.target.value))}
              ></Form.Control>
            </Form.Group> */}

            <Form.Group controlId="category" className="my-2">
              {/*  autor > category */}
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do autor"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Resenha</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                 rows={5}
                placeholder="Digite uma descrição da obra"
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

export default BookEditScreen;
