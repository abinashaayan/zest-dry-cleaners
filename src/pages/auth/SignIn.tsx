import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  // Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Divider,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import TextFieldComponent from '../../components/ui/TextField';
import Button from "../../components/ui/Button";

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("hannah.turin@email.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
    navigate("/dashboard");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#336B3F", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1, sm: 2 }, }}>
      <Container maxWidth="sm" sx={{ width: "100%", px: { xs: 1, sm: 2 } }}>
        <Paper elevation={0} sx={{ borderRadius: { xs: "20px", sm: "30px" }, p: { xs: 2.5, sm: 4, md: 5 }, backgroundColor: "#C9F8BA", textAlign: "center", }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#336B3F", mb: 1, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.4rem" }, }}>
            Let's Sign You In
          </Typography>
          <Typography sx={{ color: "rgba(51,107,63,0.7)", mb: { xs: 3, sm: 4 }, fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" }, fontWeight: 400, }}>
            Welcome back, you've been missed!
          </Typography>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
            <TextFieldComponent label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <TextFieldComponent
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              required
            />
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between", 
              alignItems: { xs: "flex-start", sm: "center" }, 
              gap: { xs: 1, sm: 0 },
              color: "#336B3F", 
              mt: { xs: 0, sm: 1 },
            }}>
              <FormControlLabel
                control={
                  <Checkbox defaultChecked sx={{ color: "#336B3F", "&.Mui-checked": { color: "#336B3F" }, }} />
                }
                label={<Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Remember Me</Typography>}
              />
              <Link to="/forgot-password" style={{ textDecoration: "none", color: "#336B3F", fontWeight: 500, fontSize: "0.875rem" }}>
                Forgot Password ?
              </Link>
            </Box>

            <Button type="submit" variant="primary" size="large" className="w-full" style={{ width: "100%" }}>
              Login
            </Button>
          </Box>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: { xs: 2, sm: 0 } }}>
          <Divider sx={{ my: { xs: 2, sm: 3 }, color: "white", "&::before, &::after": { borderColor: "rgba(255,255,255,0.3)" } }}>OR</Divider>
          <Button
            variant="light"
            size="large"
            className="w-full"
            style={{ width: "100%" }}
            onClick={() => console.log("Continue with Google")}
          >
            <GoogleIcon style={{ color: "#EA4335", marginRight: "8px" }} />
            Continue with Google
          </Button>
          <Typography sx={{ mt: { xs: 1.5, sm: 2 }, color: "#d5cdcd", fontSize: { xs: "0.875rem", sm: "0.95rem" }, }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "rgba(117, 221, 82, 1)", fontWeight: 600, textDecoration: "none", }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignIn;
