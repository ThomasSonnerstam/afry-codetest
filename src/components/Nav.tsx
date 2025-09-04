import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Afry Code Test
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            variant={isActive("/") ? "contained" : "text"}
            sx={{
              backgroundColor: isActive("/")
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Persons
          </Button>

          <Button
            component={Link}
            to="/companies"
            color="inherit"
            variant={isActive("/companies") ? "contained" : "text"}
            sx={{
              backgroundColor: isActive("/companies")
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Companies
          </Button>

          <Button
            component={Link}
            to="/unassigned"
            color="inherit"
            variant={isActive("/unassigned") ? "contained" : "text"}
            sx={{
              backgroundColor: isActive("/unassigned")
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Unassigned
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
