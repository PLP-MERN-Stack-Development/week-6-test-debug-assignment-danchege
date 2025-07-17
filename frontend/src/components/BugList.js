import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button,
  Paper,
  Box
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { ReactComponent as EditIcon } from '../icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../icons/delete.svg';
import axios from 'axios';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bugs');
        setBugs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBugs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bugs/${id}`);
      setBugs(bugs.filter(bug => bug._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Button
          variant="contained"
          color="primary"
          href="/new"
          sx={{ mb: 3 }}
        >
          New Bug
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bugs.map((bug) => (
                <TableRow key={bug._id}>
                  <TableCell>{bug.title}</TableCell>
                  <TableCell>
                    <span style={{ 
                      color: bug.status === 'open' ? 'orange' :
                             bug.status === 'in-progress' ? 'blue' :
                             'green'
                    }}>
                      {bug.status}
                    </span>
                  </TableCell>
                  <TableCell>{bug.priority}</TableCell>
                  <TableCell>{new Date(bug.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton color="primary" component="a" href={`/edit/${bug._id}`}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(bug._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default BugList;
