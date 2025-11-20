import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextFieldComponent from "../ui/TextField";
import { Button } from "../ui";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    console.log({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    // Close dialog after submission
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "rgba(201, 248, 186, 1)",
          borderRadius: { xs: "20px", sm: "24px", md: "28px" },
          margin: { xs: 1, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ color: "#336B3F", fontWeight: "bold", fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5, md: 3 } }}>
        Change Password
        <IconButton onClick={onClose} sx={{ position: "absolute", right: { xs: 4, sm: 8 }, top: { xs: 4, sm: 8 }, color: "#336B3F", }}>
          <CloseIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
        <Typography variant="body2" sx={{ color: "rgba(51, 107, 63, 0.7)", mb: { xs: 2, sm: 2.5, md: 3 }, fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.95rem" } }}>
          Please note changing password will required again login to the app.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
          <TextFieldComponent
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            type="password"
            showPassword={showCurrentPassword}
            toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
            borderColor="#336B3F"
            labelColor="#336B3F"
            textColor="#336B3F"
            required
          />
          <TextFieldComponent
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            showPassword={showNewPassword}
            toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
            borderColor="#336B3F"
            labelColor="#336B3F"
            textColor="#336B3F"
            required
          />
          <TextFieldComponent
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            showPassword={showConfirmPassword}
            toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            borderColor="#336B3F"
            labelColor="#336B3F"
            textColor="#336B3F"
            required
          />
          <Button type="submit" variant="primary" size="large" style={{ backgroundColor: "#336B3F", color: "white", borderRadius: "12px", fontWeight: "bold", marginTop: 2, }}>
            Save Password
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;

