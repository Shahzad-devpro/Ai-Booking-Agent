import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/chat"
                    element={<Chat />}
                />

                <Route
                    path="/admin/login"
                    element={<Login />}
                />

                <Route
                    path="/admin"
                    element={<Dashboard />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

