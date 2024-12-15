import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import './NavBar.css';
import '../App.css';
import { useAuth } from '../App';


const NavBar = () => {

    const { setIsAuthenticated, setUser } = useAuth();

    const handleLogout = () => {
        // Clear token from local storage
        localStorage.removeItem('jwt_token');

        // Clear authentication context
        setIsAuthenticated(false);
        setUser(null);

        // Optionally make a backend call to clear session
        fetch('http://localhost:5001/logout', { method: 'GET' })
            .then(() => {
                // Redirect to login
                window.location.href = '/login';
            })
            .catch(err => console.error('Logout failed:', err));
    };
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
            <Container className="navbar-container">
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="navbar-links">
                        <Nav.Link as={NavLink} to="/billsplitter" className="nav-link">
                            Bill Splitter
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/socialaccountability" className="nav-link">
                            Social Accountability
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/userlisting" className="nav-link"> {/* Add this */}
                            Users Listing
                        </Nav.Link>
                        <Nav.Link onClick={handleLogout} className="nav-link">
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
