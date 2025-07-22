import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { LoginPage } from "./pages/login-page";
import { HomePage } from "./pages/home-page";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

const theme = createTheme({
  // You can customize your theme here
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
