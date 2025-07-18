import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateBlogMutation,
  useGetBlogDetailsQuery,
  useUploadBlogImageMutation,
} from "../../slices/blogsApiSlice";

const BlogEditScreen = () => {
  const { id: blogId } = useParams();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const { data: blog, isLoading, error } = useGetBlogDetailsQuery(blogId);

  const [updateBlog, { isLoading: loadingUpdate }] = useUpdateBlogMutation();

  const [uploadBlogImage, { isLoading: loadingUpload }] =
    useUploadBlogImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setImage(blog.image);
      setAuthor(blog.author);
      setContent(blog.content);
    }
  }, [blog]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedBlog = {
      blogId,
      title,
      image,
      author,
      content,
    };

    const result = await updateBlog(updatedBlog);
    if (result.error) {
      toast.error(result.error?.data?.message || result.error.error || "Erro ao atualizar blog.");
    } else {
      toast.success("Blog atualizado");
      navigate("/admin/bloglist");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    console.log("Selected file:", file); // Log the selected file
    if (file) {
      console.log("File name:", file.name);
      console.log("File type:", file.type); // Crucial: Log the MIME type
      console.log("File size:", file.size);
    }

    if (!file) {
      toast.error("Nenhum arquivo selecionado."); // Added check for no file
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      console.log("Invalid file type detected:", file.type); // Log when an invalid type is caught
      toast.error("Formato de imagem inválido. Use JPG ou PNG.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      // You can add a console.log here to confirm formData is being sent
      // for (let pair of formData.entries()) {
      //     console.log(pair[0]+ ', ' + pair[1]);
      // }

      const res = await uploadBlogImage(formData).unwrap();
      console.log("Upload successful response:", res); // Log successful response

      toast.success(res.message || "Imagem enviada com sucesso!"); // Add a default success message
      setImage(res.image);
    } catch (err) {
      console.error("Error during image upload:", err); // Log the full error object
      const message =
        err?.data?.message ||
        err?.message ||
        err?.error ||
        "Erro desconhecido ao enviar imagem."; // More descriptive default error
      toast.error(message);
    }
  };

  return (
    <>
      <Link to="/admin/bloglist" className="btn btn-light my-3">
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar Minha Colheitas</h1>
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Imagem</Form.Label>

              <Form.Control
                type="file"
                label="Escolha arquivo"
                onChange={uploadFileHandler}
                accept=".jpg,.jpeg,.png"
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId="author" className="my-2">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do autor"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="content" className="my-2">
              <Form.Label>Conteúdo</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={5}
                placeholder="Digite o conteúdo de seu Minha Colheita"
                value={content}
                maxLength="2000"
                onChange={(e) => setContent(e.target.value)}
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

export default BlogEditScreen;