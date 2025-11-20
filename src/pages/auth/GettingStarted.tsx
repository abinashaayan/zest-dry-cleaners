import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@mui/material";
import TextFieldComponent from "../../components/ui/TextField";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { Link, useNavigate } from "react-router-dom";

const indianStates = [
  { value: "mh", label: "Maharashtra" },
  { value: "dl", label: "Delhi" },
  { value: "ka", label: "Karnataka" },
  { value: "wb", label: "West Bengal" },
  { value: "rj", label: "Rajasthan" },
  { value: "up", label: "Uttar Pradesh" },
];

const GettingStarted: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      fullName,
      email,
      address,
      zipCode,
      state,
      password,
      confirmPassword,
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#336B3F", display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 1, sm: 2 }, }}>
      <Container maxWidth="sm" sx={{ width: "100%", px: { xs: 1, sm: 2 } }}>
        <Paper elevation={0} sx={{ borderRadius: { xs: "20px", sm: "30px" }, p: { xs: 2.5, sm: 4, md: 5 }, backgroundColor: "#C9F8BA", textAlign: "center", }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#336B3F", mb: 1, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.4rem" }, }}>
            Getting Started
          </Typography>

          <Typography sx={{ color: "rgba(51,107,63,0.7)", mb: { xs: 3, sm: 4 }, fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" }, fontWeight: 400, }}>
            Seems you are new here, Let's set up your profile.
          </Typography>

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
            <TextFieldComponent label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <TextFieldComponent label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <TextFieldComponent label="Current Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <Box sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between", 
              alignItems: { xs: "stretch", sm: "center" }, 
              gap: { xs: 2, sm: 3 },
            }}>
              <TextFieldComponent label="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
              <Select label="State" options={indianStates} value={state} onChange={(e) => setState(e.target.value)} placeholder="Select State" required />
            </Box>
            <TextFieldComponent
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              required
            />

            <TextFieldComponent
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
              required
            />
            <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", color: "#336B3F", mt: { xs: 0, sm: 1 }, }}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    sx={{
                      color: "#336B3F",
                      "&.Mui-checked": { color: "#336B3F" },
                    }}
                  />
                }
                label={<Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.95rem" }, textAlign: "left" }}>By creating an account, you agree to our Terms and Conditions</Typography>}
              />
            </Box>

            <Button onClick={() => navigate('/signin')} type="submit" variant="primary" size="large" className="w-full" style={{ width: "100%" }}>
              Submit
            </Button>
          </Box>
        </Paper>
        <Box sx={{ textAlign: 'center', mt: { xs: 2, sm: 0 } }}>
          <Typography sx={{ mt: { xs: 1.5, sm: 2 }, color: "#d5cdcd", fontSize: { xs: "0.875rem", sm: "0.95rem" }, }}>
            Already have an account?{" "}
            <Link to="/signin" style={{ color: "rgba(117, 221, 82, 1)", fontWeight: 600, textDecoration: "none", }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default GettingStarted;
