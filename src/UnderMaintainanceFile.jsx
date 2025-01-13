const UnderMaintainanceFile = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
      backgroundColor: "#f8f9fa",
      color: "#343a40",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    text: {
      fontSize: "1.2rem",
      marginBottom: "30px",
    },
    icon: {
      fontSize: "4rem",
      color: "#ff6b6b",
      marginBottom: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚙️</div>
      <h1 style={styles.heading}>We'll Be Back Soon!</h1>
      <img src="https://dspncdn.com/a1/media/692x/b5/ee/15/b5ee154d08a7c6f21f50e07bf053abd4.jpg" />
      <p style={styles.text}>
        Our website is currently undergoing scheduled maintenance. <br />
        Thank you for your patience.
      </p>
    </div>
  );
};

export default UnderMaintainanceFile;
