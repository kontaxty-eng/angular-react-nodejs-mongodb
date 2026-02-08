import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Alert,
} from "@mui/material";
import { authService } from "../../services/auth.service";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (tab === 0) {
        await authService.login({ email, password });
      } else {
        await authService.register({ email, password });
      }
      setEmail("");
      setPassword("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Authentication</DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            inputProps={{ minLength: 6 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {tab === 0 ? "Login" : "Register"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
