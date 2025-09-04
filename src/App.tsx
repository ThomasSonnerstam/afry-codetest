import { Routes, Route } from "react-router-dom";
import "./App.css";
import PersonsPage from "./pages/PersonsPage";
import CompaniesPage from "./pages/CompaniesPage";
import UnassignedPage from "./pages/UnassignedPage";
import Nav from "./components/Nav";
import loadDb from "./api/storage";
import { Box } from "@mui/material";

function App() {
  const db = loadDb();
  console.log("db", db);

  return (
    <Box sx={{ width: "100%" }}>
      <Nav />

      <Routes>
        <Route path="/" element={<PersonsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/unassigned" element={<UnassignedPage />} />
      </Routes>
    </Box>
  );
}

export default App;
