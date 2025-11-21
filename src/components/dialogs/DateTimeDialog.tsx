import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface DateTimeDialogProps {
  open: boolean;
  onClose: () => void;
  onContinue: (date: Date, time: string, instructions: string) => void;
}

const DateTimeDialog: React.FC<DateTimeDialogProps> = ({
  open,
  onClose,
  onContinue,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 11)); // September 11, 2025
  const [selectedTime, setSelectedTime] = useState("");
  const [instructions, setInstructions] = useState("");

  const timeSlots = [
    "07:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    if (day) {
      setSelectedDate(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          day
        )
      );
    }
  };

  const handleContinue = () => {
    if (selectedTime) {
      onContinue(selectedDate, selectedTime, instructions);
      onClose();
    }
  };

  const days = getDaysInMonth(selectedDate);
  const currentMonth = monthNames[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();
  const selectedDay = selectedDate.getDate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          backgroundColor: "#336B3F",
          borderRadius: 3,
          margin: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Select Date & Time
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
          {/* Calendar Section */}
          <Box sx={{ flex: 1, p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <IconButton
                onClick={handlePreviousMonth}
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(201, 248, 186, 0.2)",
                  "&:hover": { backgroundColor: "rgba(201, 248, 186, 0.3)" },
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {currentMonth}, {currentYear}
              </Typography>
              <IconButton
                onClick={handleNextMonth}
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(201, 248, 186, 0.2)",
                  "&:hover": { backgroundColor: "rgba(201, 248, 186, 0.3)" },
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Days of Week */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 1,
                mb: 1,
              }}
            >
              {daysOfWeek.map((day) => (
                <Typography
                  key={day}
                  sx={{
                    textAlign: "center",
                    fontSize: "0.9rem",
                    color: "rgba(201, 248, 186, 1)",
                    fontWeight: 500,
                  }}
                >
                  {day}
                </Typography>
              ))}
            </Box>

            {/* Calendar Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 1,
              }}
            >
              {days.map((day, index) => (
                <Box
                  key={index}
                  onClick={() => handleDateClick(day || 0)}
                  sx={{
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    cursor: day ? "pointer" : "default",
                    backgroundColor:
                      day === selectedDay
                        ? "rgba(201, 248, 186, 1)"
                        : "transparent",
                    color:
                      day === selectedDay
                        ? "#336B3F"
                        : index < 7
                        ? "rgba(201, 248, 186, 0.8)"
                        : "#fff",
                    fontWeight: day === selectedDay ? 600 : 400,
                    "&:hover": day
                      ? {
                          backgroundColor: "rgba(201, 248, 186, 0.5)",
                        }
                      : {},
                  }}
                >
                  {day}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Time Selection Section */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 500,
                color: "rgba(201, 248, 186, 1)",
                mb: 2,
              }}
            >
              Pick time
            </Typography>

            {/* Time Slots Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1.5,
                mb: 3,
              }}
            >
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  sx={{
                    border: "1px solid #fff",
                    borderRadius: "20px",
                    color: "#fff",
                    textTransform: "none",
                    py: 1,
                    backgroundColor:
                      selectedTime === time
                        ? "rgba(201, 248, 186, 0.3)"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(201, 248, 186, 0.2)",
                    },
                  }}
                >
                  {time}
                </Button>
              ))}
            </Box>

            {/* Special Instructions */}
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                color: "rgba(201, 248, 186, 1)",
                mb: 1,
              }}
            >
              Special Instruction
            </Typography>
            <TextField
              multiline
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Add any special instructions..."
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  "& fieldset": {
                    backgroundColor: "rgba(201, 248, 186, 0.1)"
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(201, 248, 186, 1)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(201, 248, 186, 1)",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#336B3F",
                },
              }}
            />

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!selectedTime}
              fullWidth
              sx={{
                backgroundColor: "rgba(201, 248, 186, 1)",
                color: "#336B3F",
                borderRadius: "20px",
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "rgba(201, 248, 186, 0.8)",
                },
                "&:disabled": {
                  backgroundColor: "rgba(201, 248, 186, 0.3)",
                  color: "rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DateTimeDialog;

