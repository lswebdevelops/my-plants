import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import {
  FaUser,
  FaUserTie,
  FaHome,
  FaLeaf,
  FaNewspaper,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          {/* Logo */}
          <Navbar.Brand href="/">
            <img
              src="https://res.cloudinary.com/dvnxrzpnl/image/upload/v1752757753/icons8-leaf-96_lj5vq8.png"
              alt="logo of My plants"
              className="logo-hw"
            />
          </Navbar.Brand>

          {/* Icons (Static on Left) */}
          <Nav className="me-auto d-flex flex-row nav-header">
            <Nav.Link
              as={Link}
              to="/"
              className="d-flex align-items-center me-3"
            >
              <FaHome size={20} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Home</span>
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/poems" className="d-flex align-items-center me-3">
    <FaFeatherAlt size={20} className="d-lg-none" />
    <span className="ms-2 d-none d-lg-inline">Poemas</span>
  </Nav.Link> */}
            <Nav.Link
              as={Link}
              to="/plants"
              className="d-flex align-items-center me-3"
            >
              <FaLeaf size={20} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Plantas</span>
            </Nav.Link>

            {/* <Nav.Link as={Link} to="/upcoming" className="d-flex align-items-center me-3">
    <FaProjectDiagram size={20} className="d-lg-none" />
    <span className="ms-2 d-none d-lg-inline">Projetos</span>
  </Nav.Link> */}

            <Nav.Link
              as={Link}
              to="/blogs"
              className="d-flex align-items-center"
            >
              <FaNewspaper size={27} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Minha Colheita</span>
            </Nav.Link>
          </Nav>

          {/* Toggle for Collapsible Section */}
          <Navbar.Toggle aria-controls="user-navbar-collapse" />

          {/* Collapse for SearchBox and Dropdowns (On Right) */}
          <Navbar.Collapse id="user-navbar-collapse">
            <Nav className="ms-auto">
              {/* Search Box */}
              <SearchBox />

              {/* User Dropdown */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item
                    className="perfil-link-a"
                    as={Link}
                    to="/profile"
                  >
                    Meu Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    className="perfil-link-a"
                    onClick={logoutHandler}
                  >
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="d-flex align-items-center"
                >
                  <FaUser />
                  <span className="ms-2 d-none d-lg-inline ">Login</span>
                </Nav.Link>
              )}

              {/* Admin Dropdown */}
              {userInfo?.isAdmin && (
                <NavDropdown title={<FaUserTie size={20} />} id="adminmenu">
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/plantlist"
                    className="admin-menu-a"
                  >
                    Editar Cultivos
                  </NavDropdown.Item>                  
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/bloglist"
                    className="admin-menu-a"
                  >
                    Editar Minha Colheita
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/userlist"
                    className="admin-menu-a"
                  >
                    Editar Usuários
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/email-list"
                    className="admin-menu-a"
                  >
                    Email Usuários
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
