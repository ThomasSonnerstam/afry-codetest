import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 0, mr: 4 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Afry Code Test
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            ACT
          </Typography>
        </Box>

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
