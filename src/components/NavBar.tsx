import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import './NavBar.css'; // Import custom CSS for additional styling

const NavBar = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow">
            <Container>
                <Navbar.Brand href="/" className="fw-bold text-white">
                    BillsWithFriends
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/billsplitter">
                            Bill Splitter
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/expenseplanner">
                            Expense Planner
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/socialaccountability">
                            Social Accountability
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
