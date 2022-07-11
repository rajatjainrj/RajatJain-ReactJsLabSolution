import React, {useEffect, useState} from "react";
import {LoadingStatus} from "../../models/types";
import IExpense from "../../models/IExpense";

import './expenses.css'
import {getExpenses, getTotal} from "../../services/expenses";
import {Button, Col, Container, Row, Toast, ToastContainer} from "react-bootstrap";
import IndianRupeeSymbol from "../common/IndianRupeeSymbol";
import ITotal from "../../models/ITotal";
import LoadingIndicator from "../common/LoadingIndicator";
import Dialog from "../common/Dialog";
import AddExpense from "../AddExpense";

const Expenses = () => {
    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("LOADING");
    const [error, setError] = useState<Error | null>(null);
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [totalData, setTotalData] = useState<ITotal | null>(null);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);

    const loadExpenses = async () => {
        setLoadingStatus("LOADING");
        try {
            const data = await getExpenses();
            setExpenses(data);
        } catch (error) {
            setLoadingStatus("ERROR_LOADING");
            setError(error as Error);
            setShowToast(true);
            setToastMessage(error.message);
        }
    }

    const getTotalApiCall = async () => {
        try {
            const data = await getTotal();
            setTotalData(data);
            setLoadingStatus("LOADED");
            setShowToast(true);
            setToastMessage("Expenses Loaded successfully");
        } catch (error) {
            setLoadingStatus("ERROR_LOADING");
            setError(error as Error);
            setShowToast(true);
            setToastMessage(error.message);
        }
    }

    useEffect(() => {
        loadExpenses().then(getTotalApiCall);
    }, []);


    const hideToast = () => {
        setShowToast(false);
    }

    const closeAddForm = () => {
        setShowAddForm(false);
        loadExpenses().then(getTotalApiCall);
    }

    const showAddFormModal = () => {
        setShowAddForm(true);
    }

    return (
        <>
            <Container className="mt-5">
                {
                    loadingStatus === "LOADING" && (
                        <LoadingIndicator size="large" message="We are fetching the expenses, please wait..."/>
                    )
                }
                <span>
                <Row>
                    <Col className="use-inline date heading center-text" xs={2} lg={2}>Date</Col>
                    <Col className="use-inline description heading" xs={3} lg={3}>Product Purchased</Col>
                    <Col className="use-inline price heading" xs={2} lg={2}>Price</Col>
                    <Col className="use-inline payeeOne heading" xs={2} lg={2}>Payee</Col>
                    <Col className="use-inline" xs={1} lg={1}><Button className="btn-primary"
                                                                      onClick={showAddFormModal}>Add</Button></Col>
                </Row>
                    {
                        expenses.map(
                            ({date, description, price, payeeName, id}) => (
                                <Row key={id}>
                                    <Col className="use-inline date center-text" xs={2} lg={2}>{date}</Col>
                                    <Col className="use-inline description" xs={3} lg={3}>{description}</Col>
                                    <Col className="use-inline price" xs={2} lg={2}>{price}</Col>
                                    <Col
                                        className={payeeName === 'Rahul' ? "use-inline payeeOne" : "use-inline payeeTwo"}
                                        xs={2} lg={2}>{payeeName}</Col>
                                </Row>
                            )
                        )
                    }
                    <hr/>
                <Row>
                    <Col className="use-inline total-box sky-blue-bg" xs={6} lg={6}>Total: </Col>
                    <Col className="use-inline final-amount-box green-bg" xs={2}
                         lg={2}><IndianRupeeSymbol/>{totalData?.total}</Col>
                </Row>
                <Row>
                    <Col className="use-inline total-box sky-blue-bg" xs={6} lg={6}>Rahul paid: </Col>
                    <Col className="use-inline final-amount-box payeeOne" xs={2}
                         lg={2}><IndianRupeeSymbol/>{totalData?.payeeOnePaid}</Col>
                </Row>
                <Row>
                    <Col className="use-inline total-box sky-blue-bg" xs={6} lg={6}>Ramesh paid: </Col>
                    <Col className="use-inline final-amount-box payeeTwo" xs={2}
                         lg={2}><IndianRupeeSymbol/>{totalData?.payeeTwoPaid}</Col>
                </Row>
                <Row>
                    <Col className="use-inline total-box red-bg" xs={6} lg={6}>Pay Rahul: </Col>
                    <Col
                        className="use-inline final-amount-box red-bg" xs={2}
                        lg={2}><IndianRupeeSymbol/>{totalData?.payeeTwoToPayPayeeOne}</Col>
                </Row>
                    {
                        showToast && (
                            <ToastContainer className="p-3 me-5" position="top-end">
                                <Toast
                                    bg={loadingStatus === 'LOADED' ? 'success' : 'danger'}
                                    show={showToast}
                                    autohide
                                    delay={2000}
                                    onClose={hideToast}
                                    className="mt-5"
                                >
                                    <Toast.Header closeButton={false}>
                                        {loadingStatus === 'LOADED' ? 'Success' : 'Error'}
                                    </Toast.Header>
                                    <Toast.Body>{toastMessage}</Toast.Body>
                                </Toast>
                            </ToastContainer>
                        )
                    }
            </span>
            </Container>
            {
                showAddForm && (
                    <Dialog show={true}>

                        <AddExpense/>
                        <div style={{textAlign: 'right'}}>
                            <Button className="btn btn-danger"
                                    onClick={closeAddForm}>Close</Button>
                        </div>
                    </Dialog>
                )
            }
        </>
    );
}

export default Expenses;
