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
    <Box sx={{ minHeight: "100vh", backgroundColor: "#336B3F", display: "flex", alignItems: "center", justifyContent: "center", p: 2, }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ borderRadius: "30px", p: { xs: 3, sm: 5 }, backgroundColor: "#C9F8BA", textAlign: "center", }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#336B3F", mb: 1, fontSize: { xs: "1.8rem", sm: "2.4rem" }, }}>
            Getting Started
          </Typography>

          <Typography sx={{ color: "rgba(51,107,63,0.7)", mb: 4, fontSize: "1.1rem", fontWeight: 400, }}>
            Seems you are new here, Let’s set up your profile.
          </Typography>

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextFieldComponent label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <TextFieldComponent label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <TextFieldComponent label="Current Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 3, }}>
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#336B3F", mt: 1, }}>
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
                label="By creating an account, you agree to our Terms and Conditions"
              />
            </Box>

            <Button onClick={() => navigate('/signin')} type="submit" variant="primary" size="large" className="w-full">
              Submit
            </Button>
          </Box>
        </Paper>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ mt: 1, color: "#d5cdcd", fontSize: "0.95rem", }}>
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
