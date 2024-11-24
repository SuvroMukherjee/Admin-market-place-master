import React from 'react';

const NOUserPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Oops! The page you are looking for does not exist.
      </p>
      <p style={styles.message}>
        If you believe this is an error, please contact the administrator.
      </p>
      <a href="mailto:admin@example.com" style={styles.link}>
        Contact Admin
      </a>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    color: '#333',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  link: {
    fontSize: '1rem',
    color: '#007bff',
    textDecoration: 'none',
    marginTop: '1rem',
  },
};

export default NOUserPage;
