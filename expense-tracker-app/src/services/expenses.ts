import React from "react";
import axios from "axios";
import IExpense from "../models/IExpense";
import ITotal from "../models/ITotal";
import expenses from "../components/expenses/Expenses";

const getExpenses = () => {
    return axios.get<IExpense[]>(`${process.env.REACT_APP_API_BASE_URL}/expenses`)
        .then(response => response.data);
}

const getTotal = () => {
    return axios.get<ITotal>(`${process.env.REACT_APP_API_BASE_URL}/total`)
        .then(response => response.data);
}

const addExpense = (expense : Omit<IExpense, 'id'>) => {
    return axios.post<IExpense>(`${process.env.REACT_APP_API_BASE_URL}/expenses`, expense)
        .then(response => response.data).then(getExpenses);
}

const updateTotal = (total : ITotal) => {
    return axios.post<ITotal>(`${process.env.REACT_APP_API_BASE_URL}/total`, total)
        .then(response => response.data);
}

export {
    getExpenses,
    getTotal,
    addExpense,
    updateTotal
}
