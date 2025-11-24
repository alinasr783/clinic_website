import {BrowserRouter, Route, Routes} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Booking from "./pages/Booking";
import CalculateCost from "./pages/CalculateCost";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ArticlesList from "./pages/ArticlesList";
import Article from "./pages/Article";
import {Toaster} from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<AppLayout />}>
          <Route path="/cost" element={<CalculateCost />} />
          {/* <Route path="/booking" element={<Booking />} /> */}
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:id" element={<Article />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{margin: "8px"}}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-dark-2)",
            color: "var(--color-gray-50)",
            borderRadius: "7px",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
