import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import './NavBar.css'; // Import custom CSS for additional styling
import '../App';

const NavBar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
            <Container>
                <Navbar.Brand href="/" className="fw-bold text-white">
                    Bill Splitter
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={NavLink} to="/billsplitter" className="nav-link">
                            Bill Splitter
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/expenseplanner" className="nav-link">
                            Expense Planner
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/socialaccountability" className="nav-link">
                            Social Accountability
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
