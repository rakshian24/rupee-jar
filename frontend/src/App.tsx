import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { ROUTES, screenSize } from "./constants";
import { useAuth } from "./context/authContext";
import { Stack, useMediaQuery } from "@mui/material";
import Home from "./pages/home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import { AppLayout } from "./components/AppLayout";
import TransactionHistory from "./pages/transactionHistory";
import Categories from "./pages/categories";
import Reports from "./pages/reports";
import Settings from "./pages/settings";
import AddTransaction from "./pages/addTransaction";

function App() {
  const { isLoggedIn } = useAuth();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  return (
    <Stack sx={{ height: "100vh", minHeight: "100vh", margin: 0 }}>
      {(!isTablet || (isTablet && !isLoggedIn)) && <Header />}
      <Stack
        sx={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.REGISTER} element={<Home />}>
            <Route element={<Register />} index />
            <Route element={<Login />} path={ROUTES.LOGIN} />
          </Route>

          {/* Protected Routes wrapped in ProtectedRoute and AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route
                path={ROUTES.ADD_TRANSACTION}
                element={<AddTransaction />}
              />
              <Route
                path={ROUTES.TRANSACTION_HISTORY}
                element={<TransactionHistory />}
              />
              <Route path={ROUTES.CATEGORIES} element={<Categories />} />
              <Route path={ROUTES.REPORTS} element={<Reports />} />
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </Stack>
    </Stack>
  );
}

export default App;
