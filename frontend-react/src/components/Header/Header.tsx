import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { authService } from "../../services/auth.service";
import { AuthDialog } from "../AuthDialog/AuthDialog";

export const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isLoggedIn()) {
        try {
          const profile = await authService.getProfile();
          setUserEmail(profile.email);
          setIsLoggedIn(true);
        } catch (error) {
          setIsLoggedIn(false);
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserEmail("");
    setDrawerOpen(false);
  };

  const handleAuthSuccess = async () => {
    const profile = await authService.getProfile();
    setUserEmail(profile.email);
    setIsLoggedIn(true);
  };

  const authContent = (
    <>
      {isLoggedIn ? (
        <>
          <Typography sx={{ mr: 2 }}>Welcome, {userEmail}</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Button color="inherit" onClick={() => setAuthDialogOpen(true)}>
          Login / Register
        </Button>
      )}
    </>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            authContent
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {isLoggedIn ? (
              <>
                <ListItem>
                  <ListItemText primary={`Welcome, ${userEmail}`} />
                </ListItem>
                <ListItem>
                  <Button fullWidth variant="contained" onClick={handleLogout}>
                    Logout
                  </Button>
                </ListItem>
              </>
            ) : (
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setAuthDialogOpen(true);
                    setDrawerOpen(false);
                  }}
                >
                  Login / Register
                </Button>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      <AuthDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
