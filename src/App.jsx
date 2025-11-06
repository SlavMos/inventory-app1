import { useStore } from "./store/useStore";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import InventoryPage from "./pages/InventoryPage";
import AdminPage from "./pages/AdminPage";
import NavBar from "./Components/NavBar";
import SideBar from "./Components/SideBar";
import InventoryItemsPage from "./pages/InventoryItemsPage";
import InventoryFieldsPage from "./pages/InventoryFieldsPage";
import InventoryCustomIdPage from "./pages/InventoryCustomIdPage";
import DiscussionTab from "./pages/DiscussionTab";

function PrivateRoute({ children }) {
  const { user } = useStore();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-100">
                <SideBar />
                <div className="flex flex-col flex-1">
                  <NavBar />
                  <main className="flex-1 p-6 overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/inventory" element={<InventoryPage />} />
                      <Route
                        path="/inventory/:id/custom-id"
                        element={<InventoryCustomIdPage />}
                      />
                      <Route path="/inventory/:id/discussion" element={<DiscussionTab />} />

                      <Route path="/admin" element={<AdminPage />} />
                      <Route
                        path="/inventory/:id/fields"
                        element={<InventoryFieldsPage />}
                      />

                      <Route
                        path="/inventory/:id"
                        element={<InventoryItemsPage />}
                      />
                    </Routes>
                  </main>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
