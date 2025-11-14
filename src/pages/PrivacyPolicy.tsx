import React from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#336B3F", display: "flex", alignItems: "center", justifyContent: "center", p: 2, }}>
            <Container maxWidth="xl">
                <Paper elevation={0} sx={{ borderRadius: "30px", p: { xs: 3, sm: 5 }, backgroundColor: "#C9F8BA", color: "#144b21", }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography sx={{ color: "rgba(51,107,63,0.7)", fontSize: "1.1rem", }}>
                            Last Updated: Jan 2025
                        </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#336B3F", mb: 1, textAlign: "center", fontSize: { xs: "1.8rem", sm: "2.4rem" }, }}>
                        Privacy Policy
                    </Typography>

                    <Typography sx={{ mb: 3, lineHeight: 1.7, fontSize: "1.05rem" }}>
                        Welcome to <a href="https://www.zestdrycleaners.com/about">Zest Dry Cleaners</a>. Your privacy is extremely
                        important to us. This Privacy Policy explains how we collect, use,
                        and protect your information when you use our website, mobile app,
                        and associated services.
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                        1. Information We Collect
                    </Typography>
                    <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
                        We may collect personal information such as:
                        <br />• Name & Contact Details
                        <br />• Pickup & Delivery Address
                        <br />• Payment Information
                        <br />• Order History & Preferences
                        <br />• Images of garments (when uploaded for special instructions)
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                        2. How We Use Your Information
                    </Typography>
                    <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
                        Zest Dry Cleaners uses your information to:
                        <br />• Process orders & manage deliveries
                        <br />• Provide garment care recommendations
                        <br />• Improve customer experience
                        <br />• Send updates, promotions, and service alerts
                        <br />• Ensure operational and safety standards
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                        3. Third-Party Sharing
                    </Typography>
                    <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
                        We never sell your data. We may share limited information only with:
                        <br />• Delivery partners
                        <br />• Payment gateways
                        <br />• Service vendors who assist with laundry operations
                        All partners follow strict privacy and data-safety standards.
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                        4. Data Security
                    </Typography>
                    <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
                        Your information is protected using industry-standard encryption,
                        secure servers, and restricted access protocols. We continuously
                        update our systems to ensure your data stays safe.
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                        5. Your Rights
                    </Typography>
                    <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
                        You may request to:
                        <br />• Access your stored information
                        <br />• Update or correct your personal details
                        <br />• Delete your account & associated data
                        <br />• Opt out of promotional emails anytime
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
                        6. Contact Us
                    </Typography>
                    <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
                        For questions regarding this Privacy Policy, you can reach us at:
                        <br />
                        <strong>Email:</strong> support@zestdrycleaners.com
                        <br />
                        <strong>Phone:</strong> +91 98765 43210
                    </Typography>

                    <Typography sx={{ textAlign: "center", mt: 4, color: "#336B3F", }}>
                        <Link to="/" style={{ color: "#336B3F", textDecoration: "underline", fontWeight: 600, }}>
                            Back to Home
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default PrivacyPolicy;
