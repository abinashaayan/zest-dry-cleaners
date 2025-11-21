import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import HomeIcon from "@mui/icons-material/Home";

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [promoCode, setPromoCode] = useState("A9CCXJP");
  const [items, setItems] = useState([
    { id: 1, name: "Iron", price: 20 },
  ]);
  const [serviceCharge] = useState(2);
  const [promoDiscount] = useState(20);
  const [selectedAddress, setSelectedAddress] = useState("2045 Lodgeville Street, Eagan");
  const [addresses, setAddresses] = useState([
    { id: "1", address: "2045 Lodgeville Street, Eagan", isSelected: true },
    { id: "2", address: "3329 Joyce Stree, PA, USA", isSelected: false },
  ]);

  useEffect(() => {
    const destination = sessionStorage.getItem("selectedDestination");
    if (destination) {
      setSelectedAddress(destination);
    }
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + serviceCharge - promoDiscount;

  const handleAddressSelect = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isSelected: addr.id === id,
      }))
    );
    const selected = addresses.find((addr) => addr.id === id);
    if (selected) {
      setSelectedAddress(selected.address);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
  };

  const handleContinue = () => {
    // Store billing information and proceed to order confirmation
    navigate("/order-confirmation");
  };

  return (
    <Box sx={{ background: "#336B3F", minHeight: "100vh" }}>
      <DashboardNavbar />

      <div className="container py-5 mt-5">
        <div className="row g-4">
          {/* Left Side - Billing */}
          <div className="col-md-6">
            <Card
              sx={{
                p: 4,
                background: "rgba(201, 248, 186, 0.37)",
                borderRadius: 3,
                color: "#fff",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  mb: 3,
                  color: "#336B3F",
                }}
              >
                Billings
              </Typography>

              {/* Bill Details */}
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: "#336B3F", fontSize: "1rem" }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ color: "#336B3F", fontSize: "1rem" }}>
                    ${item.price}
                  </Typography>
                </Box>
              ))}

              {/* Service Charge */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: "#336B3F", fontSize: "1rem" }}>
                  Service Charge
                </Typography>
                <Typography sx={{ color: "#336B3F", fontSize: "1rem" }}>
                  ${serviceCharge}
                </Typography>
              </Box>

              {/* Promo Code */}
              {promoCode && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                    backgroundColor: "rgba(201, 248, 186, 1)",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                >
                  <Typography sx={{ color: "#336B3F", fontSize: "0.9rem" }}>
                    Promo Code {promoCode}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleRemovePromo}
                    sx={{ color: "#336B3F" }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}

              {promoCode && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography sx={{ color: "#336B3F", fontSize: "1rem" }}>
                    Discount
                  </Typography>
                  <Typography sx={{ color: "#336B3F", fontSize: "1rem" }}>
                    -${promoDiscount}
                  </Typography>
                </Box>
              )}

              {/* Total */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 3,
                  mb: 3,
                  pt: 2,
                  borderTop: "2px solid rgba(51, 107, 63, 0.3)",
                }}
              >
                <Typography
                  sx={{
                    color: "#336B3F",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                  }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(201, 248, 186, 1)",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                  }}
                >
                  ${total}
                </Typography>
              </Box>

              {/* Payment Methods */}
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  mb: 2,
                  color: "#336B3F",
                }}
              >
                Payment Method
              </Typography>

              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <FormControlLabel
                    value="online"
                    control={
                      <Radio
                        sx={{
                          color: "#336B3F",
                          "&.Mui-checked": {
                            color: "#336B3F",
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor:
                              paymentMethod === "online"
                                ? "#336B3F"
                                : "transparent",
                            border: "2px solid #336B3F",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                          }}
                        >
                          {paymentMethod === "online" && (
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                              }}
                            >
                              ✓
                            </Typography>
                          )}
                        </Box>
                        <CreditCardIcon
                          sx={{
                            color:
                              paymentMethod === "online"
                                ? "#336B3F"
                                : "rgba(51, 107, 63, 0.5)",
                            fontSize: 32,
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#336B3F",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                          }}
                        >
                          Online Payment
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />

                  <FormControlLabel
                    value="cash"
                    control={
                      <Radio
                        sx={{
                          color: "#336B3F",
                          "&.Mui-checked": {
                            color: "#336B3F",
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor:
                              paymentMethod === "cash"
                                ? "#336B3F"
                                : "transparent",
                            border: "2px solid #336B3F",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 0.5,
                          }}
                        >
                          {paymentMethod === "cash" && (
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: "1.2rem",
                                fontWeight: 600,
                              }}
                            >
                              ✓
                            </Typography>
                          )}
                        </Box>
                        <AccountBalanceWalletIcon
                          sx={{
                            color:
                              paymentMethod === "cash"
                                ? "#336B3F"
                                : "rgba(51, 107, 63, 0.5)",
                            fontSize: 32,
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#336B3F",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                          }}
                        >
                          Cash
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </Box>
              </RadioGroup>
            </Card>
          </div>

          {/* Right Side - Location & Map */}
          <div className="col-md-6">
            <Card
              sx={{
                p: 3,
                background: "rgba(201, 248, 186, 0.37)",
                borderRadius: 3,
                height: "100%",
              }}
            >
              {/* Map */}
              <Box
                sx={{
                  width: "100%",
                  height: 250,
                  backgroundColor: "#e8f5e9",
                  borderRadius: 2,
                  mb: 3,
                  position: "relative",
                  overflow: "hidden",
                  border: "2px solid rgba(51, 107, 63, 0.2)",
                }}
              >
                {/* Simplified map pattern */}
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent 25px, rgba(51, 107, 63, 0.1) 25px, rgba(51, 107, 63, 0.1) 26px),
                      repeating-linear-gradient(90deg, transparent, transparent 25px, rgba(51, 107, 63, 0.1) 25px, rgba(51, 107, 63, 0.1) 26px)
                    `,
                    position: "relative",
                  }}
                >
                  {/* Yellow Location Pin */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "20%",
                      right: "30%",
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#FFD700",
                        border: "3px solid #fff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "#336B3F",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Blue Home Icon */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "30%",
                      left: "40%",
                      zIndex: 2,
                    }}
                  >
                    <HomeIcon
                      sx={{
                        fontSize: 32,
                        color: "#2196F3",
                      }}
                    />
                  </Box>

                  {/* Distance Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "#336B3F",
                      color: "#fff",
                      borderRadius: "20px",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    847m
                  </Box>
                </Box>
              </Box>

              {/* Address List */}
              <Box sx={{ mb: 3 }}>
                {addresses.map((addr, index) => (
                  <Box key={addr.id}>
                    <Box
                      onClick={() => handleAddressSelect(addr.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                        cursor: "pointer",
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: addr.isSelected
                          ? "rgba(201, 248, 186, 0.5)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(201, 248, 186, 0.3)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "2px solid #336B3F",
                          backgroundColor: addr.isSelected
                            ? "#336B3F"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        {addr.isSelected ? (
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              backgroundColor: "rgba(201, 248, 186, 1)",
                            }}
                          />
                        ) : (
                          <StarIcon
                            sx={{
                              color: "#336B3F",
                              fontSize: 18,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          color: "#336B3F",
                          fontSize: "0.95rem",
                          fontWeight: addr.isSelected ? 600 : 400,
                        }}
                      >
                        {addr.address}
                      </Typography>
                    </Box>
                    {index < addresses.length - 1 && (
                      <Box
                        sx={{
                          width: 2,
                          height: 20,
                          backgroundColor: "rgba(51, 107, 63, 0.3)",
                          ml: 2.5,
                          mb: 1,
                          borderStyle: "dotted",
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
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
                }}
              >
                Continue
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Billing;

