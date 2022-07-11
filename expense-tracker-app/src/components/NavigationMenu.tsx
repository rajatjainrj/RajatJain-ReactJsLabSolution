import React from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import IndianRupeeSymbol from "./common/IndianRupeeSymbol";

const NavigationMenu = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand to="/expenses" as={NavLink}>
                    <IndianRupeeSymbol/>
                    ExpenseTracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link to="/expenses" as={NavLink}>Expenses</Nav.Link>
                        <Nav.Link to="/add" as={NavLink}>Add Expense</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationMenu;
