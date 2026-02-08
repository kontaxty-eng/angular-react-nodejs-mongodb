import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Header } from "./components/Header/Header";
import { TaskList } from "./pages/TaskList/TaskList";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#ff4081",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header />
        <TaskList />
      </div>
    </ThemeProvider>
  );
}

export default App;
