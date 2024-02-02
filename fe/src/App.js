import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import UserPage from "./pages/user/index";
import AdminPage from "./pages/admin/index";
import { ADMIN_ID, USER_ID, authToken } from "./utils/users";
import { decodeToken } from "./utils/index";

const PrivateRoute = ({ children, userId, userIdToCheckAgainst, redirectTo }) => {
  return userId === userIdToCheckAgainst ? children : <Navigate to={redirectTo} replace />;
};

function App() {
  const userId = decodeToken(authToken).userId;
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <PrivateRoute userId={userId} userIdToCheckAgainst={ADMIN_ID} redirectTo="/">
            <AdminPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute userId={userId} userIdToCheckAgainst={USER_ID} redirectTo="/admin">
            <UserPage />
          </PrivateRoute>
        }
      />
      {/* Add other routes here */}
    </Routes>
  );
}

export default App;