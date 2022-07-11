import React, {Component} from "react";
import IExpense from "../models/IExpense";
import {addExpense, updateTotal} from "../services/expenses";
import {Button, Col, Container, Form, Row, Toast} from "react-bootstrap";
import ITotal from "../models/ITotal";

type State = {
    expense: {
        payeeName: string
        description: string
        price: string
        date: string
    },
    errors: {
        payeeName: string[]
        description: string[]
        price: string[]
        date: string[]
    },
    isValid: boolean
    responseState: 'initial' | 'success' | 'error',
    toastMessage: string,
    show: boolean
}

class AddExpense extends Component<{}, State> {
    state: State = {
        expense: {
            payeeName: 'Rahul',
            description: '',
            price: '0',
            date: ''
        },
        errors: {
            payeeName: [],
            description: [],
            price: [],
            date: []
        },
        isValid: false,
        responseState: 'initial',
        toastMessage: '',
        show: false
    }

    validate(nameOfInput?: keyof State['expense']) {
        const errors: State['errors'] = {
            payeeName: [],
            description: [],
            price: [],
            date: []
        };
        let isValid = true;
        const {price, description, date} = this.state.expense;

        if (description.trim() === '') {
            errors.description.push('Description should be at least 50 characters');
            isValid = false;
        }

        if (date.trim() === '') {
            errors.date.push('Date cannot be empty');
            isValid = false;
        }

        if (price === '0') {
            errors.price.push('Price cannot be 0');
            isValid = false;
        }

        const pricePat = /^\d+(\.\d{1,2})?$/;
        if (!pricePat.test(price.toString())) {
            errors.price.push('Price needs to be a valid currency value');
            isValid = false;
        }

        if (nameOfInput) {
            this.setState(
                state => {
                    return {
                        errors: {
                            ...state.errors,
                            [nameOfInput]: errors[nameOfInput]
                        },
                        isValid
                    }
                }
            )
            return errors[nameOfInput].length === 0;
        }

        this.setState({
            errors,
            isValid
        });

        return isValid;
    }

    updateValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        console.log(name, value)
        this.setState(
            state => {
                return {
                    expense: {
                        ...state.expense,
                        [name]: value
                    }
                };
            },
            () => {
                this.validate(name as keyof State['expense']);
            }
        );

    }

    addExpense = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!this.validate()) {
            return;
        }

        const expense = {
            ...this.state.expense,
            price: parseFloat(this.state.expense.price)
        }
        try {
            this.setState({
                responseState: 'initial'
            });
            const data = await addExpense(expense);
            console.log(data);
            const total = this.calculateTotal(data);
            this.updateTotal(total);
        } catch (error) {
            this.setState({
                responseState: 'error',
                toastMessage: error.message,
                show: true
            });
        }
    }

    calculateTotal = (expenses: IExpense[]) => {
        let totalAmount = 0, rahulPaid = 0, rameshPaid = 0;
        expenses.forEach(
            function ({price, payeeName}) {
                totalAmount = totalAmount + price;
                if (payeeName === 'Rahul') {
                    rahulPaid = rahulPaid + price;
                } else {
                    rameshPaid = rameshPaid + price;
                }
            }
        )
        return {
            total: totalAmount,
            payeeOnePaid: rahulPaid,
            payeeTwoPaid: rameshPaid,
            payeeTwoToPayPayeeOne: totalAmount - rameshPaid
        };
    }

    updateTotal = async (total: ITotal) => {
        try {
            this.setState({
                responseState: 'initial'
            });
            const data = await updateTotal(total);
            this.setState({
                responseState: 'success',
                toastMessage: `An expense has been successfully added`,
                show: true
            })
        } catch (error) {
            this.setState({
                responseState: 'error',
                toastMessage: error.message,
                show: true
            });
        }
    }

    render() {
        const {
            payeeName,
            description,
            date,
            price
        } = this.state.expense;

        const {
            payeeName: payeeNameErrors,
            description: descriptionErrors,
            date: dateErrors,
            price: priceErrors
        } = this.state.errors;

        const isValid = this.state.isValid;

        const {responseState, show, toastMessage} = this.state;

        return (
            <>
                <Container className="mt-5">
                    <Row>
                        <Col xs={12}>
                            <h3>Add an Expense</h3>
                            <hr/>
                        </Col>
                        <Col xs={12}>
                            <Form onSubmit={this.addExpense}>
                                <Form.Group
                                    as={Row}
                                    className="my-3"
                                    controlId="payeeName"
                                >
                                    <Form.Label column sm={3}>Payee Name</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control as="select"
                                                      name="payeeName"
                                                      value={payeeName}
                                                      onChange={this.updateValue}>
                                            <option value="Rahul">Rahul</option>
                                            <option value="Ramesh">Ramesh</option>
                                        </Form.Control>
                                        <Form.Text id="nameHelp" muted>
                                            Select payee Name
                                        </Form.Text>
                                    </Col>
                                </Form.Group>
                                <Form.Group
                                    as={Row}
                                    className="my-3"
                                    controlId="price"
                                >
                                    <Form.Label column sm={3}>Price</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="text"
                                            name="price"
                                            value={price}
                                            onChange={this.updateValue}
                                            aria-describedby="priceHelp"
                                            isInvalid={priceErrors.length !== 0}
                                        />
                                        <Form.Text id="priceHelp" muted>
                                            Price should be in Indian Rupees (a currency value)
                                        </Form.Text>
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                priceErrors.map(
                                                    err => <div key={err}>{err}</div>
                                                )
                                            }
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group
                                    as={Row}
                                    className="my-3"
                                    controlId="description"
                                >
                                    <Form.Label column sm={3}>Description</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            value={description}
                                            onChange={this.updateValue}
                                            aria-describedby="descriptionHelp"
                                            isInvalid={descriptionErrors.length !== 0}
                                        />
                                        <Form.Text id="descriptionHelp" muted>
                                            Describe the expense
                                        </Form.Text>
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                descriptionErrors.map(
                                                    err => <div key={err}>{err}</div>
                                                )
                                            }
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group
                                    as={Row}
                                    className="my-3"
                                    controlId="date"
                                >
                                    <Form.Label column sm={3}>Image URL</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control
                                            type="date"
                                            name="date"
                                            value={date}
                                            onChange={this.updateValue}
                                            aria-describedby="dateHelp"
                                            isInvalid={dateErrors.length !== 0}
                                        />
                                        <Form.Text id="dateHelp" muted>
                                            Select the date of expense
                                        </Form.Text>
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                dateErrors.map(
                                                    err => <div key={err}>{err}</div>
                                                )
                                            }
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                                <Form.Group
                                    as={Row}
                                    className="my-3"
                                    controlId="submitBtn"
                                >
                                    <Col sm={{offset: 3, span: 9}}>
                                        <Button type="submit" disabled={!isValid}>Add menu item</Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    {
                        show && (
                            <Toast
                                bg={responseState === 'success' ? 'success' : 'danger'}
                                show={show}
                                autohide
                                delay={5000}
                                onClose={() => this.setState({
                                    show: false
                                })}
                            >
                                <Toast.Header closeButton={false}>
                                    {responseState === 'success' ? 'Success' : 'Error'}
                                </Toast.Header>
                                <Toast.Body>{toastMessage}</Toast.Body>
                            </Toast>
                        )
                    }
                </Container>
            </>
        );
    }

}

export default AddExpense;
