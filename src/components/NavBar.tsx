import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import './NavBar.css';
import '../App.css';

const NavBar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
            <Container className="navbar-container">
                <Navbar.Brand className="navbar-title fw-bold">
                    Bill Splitter
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="navbar-links">
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
