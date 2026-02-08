import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Pagination,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { taskService } from "../../services/task.service";
import { Task, PaginationInfo } from "../../types/task.types";
import { TaskCard } from "../../components/TaskCard/TaskCard";
import "./TaskList.css";

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 8,
  });
  const [search, setSearch] = useState("");
  const [addForm, setAddForm] = useState({ title: "", description: "" });
  const [editingForms, setEditingForms] = useState<
    Map<string, { title: string; description: string }>
  >(new Map());
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const loadTasks = useCallback(
    async (page: number = 1, limit: number = 8, searchTerm: string = "") => {
      try {
        const response = await taskService.getTasks(page, limit, searchTerm);
        setTasks(response.tasks);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    },
    [],
  );

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      loadTasks(1, pagination.itemsPerPage, value);
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleClearSearch = () => {
    setSearch("");
    loadTasks(1, pagination.itemsPerPage, "");
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title || !addForm.description) return;

    try {
      const newTask = await taskService.createTask(addForm);
      setTasks([...tasks, newTask]);
      setAddForm({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    const newEditingForms = new Map(editingForms);
    newEditingForms.set(task._id, {
      title: task.title,
      description: task.description,
    });
    setEditingForms(newEditingForms);
  };

  const handleUpdateTask = async (
    id: string,
    data: { title: string; description: string },
  ) => {
    try {
      await taskService.updateTask(id, data);
      const newEditingForms = new Map(editingForms);
      newEditingForms.delete(id);
      setEditingForms(newEditingForms);
      loadTasks(pagination.currentPage, pagination.itemsPerPage, search);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const task = tasks.find((t) => t._id === id);
      if (task) {
        await taskService.updateTaskCompletion(id, !task.completed);
        loadTasks(pagination.currentPage, pagination.itemsPerPage, search);
      }
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  const handleCancelEdit = (id: string) => {
    const newEditingForms = new Map(editingForms);
    newEditingForms.delete(id);
    setEditingForms(newEditingForms);
  };

  const handleFormChange = (id: string, field: string, value: string) => {
    const newEditingForms = new Map(editingForms);
    const form = newEditingForms.get(id);
    if (form) {
      newEditingForms.set(id, { ...form, [field]: value });
      setEditingForms(newEditingForms);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    loadTasks(page, pagination.itemsPerPage, search);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Task List
          </Typography>

          {/* Search Section */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Search tasks"
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask}>
            <TextField
              fullWidth
              label="New Task"
              value={addForm.title}
              onChange={(e) =>
                setAddForm({ ...addForm, title: e.target.value })
              }
              margin="normal"
              required
              inputProps={{ minLength: 3 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={addForm.description}
              onChange={(e) =>
                setAddForm({ ...addForm, description: e.target.value })
              }
              margin="normal"
              required
              multiline
              rows={3}
              inputProps={{ minLength: 5 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isEditing={editingForms.has(task._id)}
            editForm={editingForms.get(task._id)}
            onEdit={handleEditTask}
            onUpdate={handleUpdateTask}
            onComplete={handleCompleteTask}
            onCancel={handleCancelEdit}
            onFormChange={handleFormChange}
          />
        ))}
      </Box>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  );
};
