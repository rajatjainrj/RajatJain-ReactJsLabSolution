import React from "react";
import NavigationMenu from "./NavigationMenu";
import {Route, Routes} from "react-router-dom";
import Expenses from "./expenses/Expenses";
import AddExpense from "./AddExpense";

const App = () => {
    return (
        <>
            <NavigationMenu/>
            <Routes>
                <Route path="/" element={<Expenses/>}></Route>
                <Route path="expenses" element={<Expenses/>}></Route>
                <Route path="add" element={<AddExpense/>}></Route>
            </Routes>
        </>
    );
}

export default App;
