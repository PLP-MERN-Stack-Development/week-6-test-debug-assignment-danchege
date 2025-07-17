import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BugForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBug();
    }
  }, [id]);

  const fetchBug = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bugs/${id}`);
      setBug(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setBug({
      ...bug,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (id) {
        await axios.patch(`http://localhost:5000/api/bugs/${id}`, bug);
      } else {
        await axios.post('http://localhost:5000/api/bugs', bug);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={bug.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={bug.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={bug.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={bug.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {id ? 'Update Bug' : 'Create Bug'}
            </Button>
          </form>
          {error && (
            <div style={{ color: 'red', marginTop: '1rem' }}>
              {error}
            </div>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default BugForm;
