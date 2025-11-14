import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { Container, Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import casualshirt from "../assets/casual-t-shirt- 1.png";
import Group from "../assets/Group.png";
import blanket from "../assets/blanket 1.png";
import curtains from "../assets/curtains 1.png";

import "./ServicesList.css";

interface Service {
  id: number;
  name: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  bgColor: string;
  chipBgColor: string;
  time: string;
  price: string;
}

const ServicesList: React.FC = () => {
  const navigate = useNavigate();

  const services: Service[] = [
    {
      id: 1,
      name: "Shirts",
      icon: casualshirt,
      iconBgColor: "rgba(250, 199, 199, 1)",
      bgColor: "rgba(252, 233, 233, 1)",
      iconColor: "rgba(241, 87, 87, 1)",
      chipBgColor: "rgb(247 196 196)",
      time: "45 Minutes",
      price: "$20/Item",
    },
    {
      id: 2,
      name: "Suits",
      icon: Group,
      iconBgColor: "rgba(188, 255, 201, 1)",
      bgColor: "rgba(240, 250, 242, 1)",
      iconColor: "rgba(79, 191, 103, 1)",
      chipBgColor: "rgb(198 252 210)",
      time: "45 Minutes",
      price: "$20/Item",
    },
    {
      id: 3,
      name: "Bedsheets",
      icon: blanket,
      iconBgColor: "rgba(203, 240, 251, 1)",
      bgColor: "rgba(232, 247, 252, 1)",
      iconColor: "rgba(113, 215, 244, 1)",
      chipBgColor: "rgb(190 239 253)",
      time: "45 Minutes",
      price: "$20/Item",
    },
    {
      id: 4,
      name: "Curtains",
      icon: curtains,
      iconBgColor: "rgba(255, 228, 152, 1)",
      bgColor: "rgba(255, 243, 211, 1)",
      iconColor: "rgba(199, 138, 9, 1)",
      chipBgColor: "rgb(242 226 191)",
      time: "45 Minutes",
      price: "$20/Item",
    },
  ];

  const handleServiceClick = (serviceId: number) => {
    navigate(`/services/${serviceId}`);
  };

  return (
    <div className="services-list-page">
      <DashboardNavbar />
      <main className="services-list-content">
        <Container maxWidth="xl">
          <Box className="services-list-container">
            <div className="services-list-grid">
              {services.map((service) => (
                <Box
                  key={service.id}
                  className="service-card hover-lift smooth-transition"
                  onClick={() => handleServiceClick(service.id)}
                  sx={{
                    backgroundColor: service.bgColor,
                    borderRadius: "24px",
                    padding: { xs: "20px", sm: "22px", md: "30px" },
                    cursor: "pointer",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Box
                      sx={{
                        backgroundColor: service.iconBgColor,
                        width: { xs: "60px", md: "75px" },
                        height: { xs: "60px", md: "75px" },
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img src={service.icon} alt={service.name} style={{ width: "70%", height: "auto", }} />
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'black' }}>
                      {service.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <ArrowForwardIosIcon sx={{ fontSize: "22px", color: service.iconColor, }} />
                  </Box>

                  {/* Time + Price Row */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "20px", }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: service.chipBgColor, padding: "6px 14px", borderRadius: "20px", }}>
                      <AccessTimeIcon sx={{ fontSize: "18px", color: service.iconColor, }} />
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: service.iconColor, }}>
                        {service.time}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: service.iconColor, }}>
                      {service.price}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </div>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default ServicesList;
