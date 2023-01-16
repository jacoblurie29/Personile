import {
  AppBar,
  Toolbar,
  Collapse,
  Box,
  Typography,
  Zoom,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Logo from "logo/Logo";
import MenuIcon from "@mui/icons-material/Menu";
import AboutView from "features/AboutView/AboutView";

interface Props {
  page: string;
}

export default function WelcomeView({ page }: Props) {
  const [checked, setChecked] = useState(false);

  const history = useHistory();
  useEffect(() => {
    setChecked(true);
  }, []);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
      <Box
        sx={{
          flex: 1,
          margin: "0px",
          padding: "0px",
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: page === 'home' ? "center" : "flex-start",
          fontFamily: "Nunito",
          background:
            "linear-gradient(132deg, rgba(233,252,255,1) 0%, rgba(255,255,255,1) 48%, rgba(244,232,255,1) 100%)",
          overflow: "auto",
        }}
      >
        <AppBar
          sx={{ background: "white", paddingBottom: "10px" }}
          elevation={2}
        >
          <Toolbar sx={{ width: "80%", margin: "0 auto" }}>
            <Typography variant="h1" sx={{ flexGrow: "1" }}>
              <Logo />
            </Typography>
            <div>
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ marginTop: "15px" }}
              >
                <MenuIcon sx={{ color: "grey.600", fontSize: "40px" }} />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/welcome");
                  }}
                >
                  Home
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/about");
                  }}
                >
                  About
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/login");
                  }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    history.push("/register");
                  }}
                >
                  Register
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>

        {page == "home" && (
          <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h1"
                sx={{ color: "grey.800", fontSize: "3rem" }}
              >
                Agile planning
                <Box
                  component={"span"}
                  sx={{
                    color: "secondary.light",
                    fontSize: "40px",
                    fontFamily: "Open Sans",
                  }}
                >
                  .
                </Box>{" "}
                Finally for students
                <Box
                  component={"span"}
                  sx={{
                    color: "secondary.light",
                    fontSize: "40px",
                    fontFamily: "Open Sans",
                  }}
                >
                  .
                </Box>
              </Typography>
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
              <Box
                component={"img"}
                src="/oie_transparent.png"
                alt="Computer"
                sx={{ height: "170px", opacity: "85%" }}
              ></Box>
            </Box>
          </Collapse>
        )}
        {page == "about" && <AboutView />}
      </Box>
  );
}
