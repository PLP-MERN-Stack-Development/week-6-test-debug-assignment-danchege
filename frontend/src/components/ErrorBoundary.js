import React, { Component } from 'react';
import { Paper, Typography, Button } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong!
          </Typography>
          <Typography color="textSecondary" paragraph>
            {this.state.error.message}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
