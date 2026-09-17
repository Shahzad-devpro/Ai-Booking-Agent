import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";


import Home
    from "./pages/Home";

import Chat
    from "./pages/Chat";

import Login
    from "./pages/Login";

import Dashboard
    from "./pages/dashboard/Dashboard";

import Leads
    from "./pages/dashboard/Leads";

import Appointments
    from "./pages/dashboard/Appointments";

import Customers
    from "./pages/dashboard/Customers";

const App = () => {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                <Route
                    path="/chat"
                    element={
                        <Chat />
                    }
                />


                <Route
                    path="/admin/login"
                    element={
                        <Login />
                    }
                />


                <Route
                    path="/admin"
                    element={
                        <Dashboard />
                    }
                />


                <Route
                    path="/admin/leads"
                    element={
                        <Leads />
                    }
                />


                <Route
                    path="/admin/appointments"
                    element={
                        <Appointments />
                    }
                />
                <Route
                     path="/admin/customers"
                     element={<Customers />}
                />

            </Routes>

        </BrowserRouter>

    );

};


export default App;