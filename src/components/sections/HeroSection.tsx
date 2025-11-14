import React from "react";
import { Box, Typography, Container } from "@mui/material";
import heroHome from "../../assets/hero-home.png";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "400px", sm: "500px", md: "600px" },
        display: "flex",
        alignItems: "center",
        backgroundImage: `url(${heroHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: { xs: "100%", md: "50%" },
          height: "100%",
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", }}>
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: { xs: "100%", md: "50%" } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#2E2E2E",
              mb: { xs: 2, md: 3 },
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            Need a helping hand today?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#333",
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
              opacity: 0.9,
              maxWidth: "100%",
              lineHeight: { xs: 1.5, md: 1.6 },
            }}
          >
            Let's embody your beautiful ideas together, simplify the way you
            visualize your next big things.
          </Typography>

          <Button onClick={() => navigate('/signup')} type="submit" variant="primary" size="large" className="w-full">
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
