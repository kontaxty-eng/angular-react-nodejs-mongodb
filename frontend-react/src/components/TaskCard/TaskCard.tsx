import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Task } from "../../types/task.types";

interface TaskCardProps {
  task: Task;
  isEditing: boolean;
  editForm?: { title: string; description: string };
  onEdit: (task: Task) => void;
  onUpdate: (id: string, data: { title: string; description: string }) => void;
  onComplete: (id: string) => void;
  onCancel: (id: string) => void;
  onFormChange: (id: string, field: string, value: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isEditing,
  editForm,
  onEdit,
  onUpdate,
  onComplete,
  onCancel,
  onFormChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm) {
      onUpdate(task._id, editForm);
    }
  };

  return (
    <Card className="task-card">
      {isEditing && editForm ? (
        <form onSubmit={handleSubmit}>
          <CardContent>
            <TextField
              fullWidth
              label="Task Title"
              value={editForm.title}
              onChange={(e) => onFormChange(task._id, "title", e.target.value)}
              margin="normal"
              required
              inputProps={{ minLength: 3 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={editForm.description}
              onChange={(e) =>
                onFormChange(task._id, "description", e.target.value)
              }
              margin="normal"
              required
              multiline
              rows={3}
              inputProps={{ minLength: 5 }}
            />
          </CardContent>
          <CardActions>
            <Button type="submit" variant="contained" color="primary">
              Update Task
            </Button>
            <Button type="button" onClick={() => onCancel(task._id)}>
              Cancel
            </Button>
          </CardActions>
        </form>
      ) : (
        <>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => onEdit(task)}
            >
              Edit Task
            </Button>
            <Button
              variant="contained"
              color={task.completed ? "success" : "primary"}
              onClick={() => onComplete(task._id)}
            >
              {task.completed ? "Completed" : "Mark Complete"}
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};
