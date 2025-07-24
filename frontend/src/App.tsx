import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { HomePage, TasksPage } from "./pages";

const theme = createTheme({
  // You can customize your theme here
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
