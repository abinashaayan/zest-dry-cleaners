import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const TermsAndConditions: React.FC = () => {
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
            Terms & Conditions
          </Typography>
          <Typography sx={{ mb: 3, lineHeight: 1.7, fontSize: "1.05rem" }}>
            These Terms & Conditions govern your use of Zest Dry Cleaners’
            services, website, and mobile application. By placing an order or
            accessing our platform, you agree to the terms listed below.
          </Typography>

          {/* Section 1 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            1. Service Overview
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            Zest Dry Cleaners provides dry cleaning, laundry, ironing, and
            garment care services. We aim to deliver high-quality cleaning while
            ensuring timely pickup and delivery.
          </Typography>

          {/* Section 2 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            2. Order Placement
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            • Orders can be placed through our website, app, or customer care.
            • Prices may vary based on fabric, stain intensity, or special
            treatment requests.
            • Any changes to an order must be informed before processing begins.
          </Typography>

          {/* Section 3 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            3. Pickup & Delivery
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            • Pickup and delivery timings are subject to location and workload.
            • Customers must ensure garments are collected promptly.
            • If delivery attempts fail repeatedly, additional charges may apply.
          </Typography>

          {/* Section 4 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            4. Garment Inspection
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            • Zest Dry Cleaners inspects all garments and may refuse items
            unsuitable for cleaning.
            • Pre-existing damage, weak fabric, or color fading will be noted
            before processing.
            • We are not responsible for deterioration caused by age or misuse.
          </Typography>

          {/* Section 5 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            5. Damage & Loss Policy
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            • While rare, if a garment is damaged due to our process, liability
            is limited to **5x the cleaning cost** of that item.
            • In case of loss, compensation will be based on the garment’s
            depreciated value.
            • Claims must be filed within 48 hours of delivery.
          </Typography>

          {/* Section 6 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            6. Payment Terms
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            • Payments can be made online or upon delivery.
            • All prices include taxes unless specified.
            • Unpaid dues may result in service suspension.
          </Typography>

          {/* Section 7 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            7. User Responsibilities
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            • Users must provide accurate contact details and addresses.
            • Any harmful items left in pockets (pens, blades, coins, USBs)
            are customer responsibility.
            • Incorrect information may delay service.
          </Typography>

          {/* Section 8 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            8. Prohibited Items
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            The following items will not be accepted:
            • Hazardous or combustible materials
            • Items with severe mold or contamination
            • Garments requiring specialized industrial cleaning
          </Typography>

          {/* Section 9 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            9. Cancellation & Refunds
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            • Orders can be cancelled before processing begins.
            • If processing has started, cancellation is not possible.
            • Refunds (if applicable) will be issued within 5–7 business days.
          </Typography>

          {/* Section 10 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            10. Updates to Terms
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
            Zest Dry Cleaners may update these Terms occasionally. Changes become
            effective once posted on our website or app.
          </Typography>

          {/* Section 11 */}
          <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
            11. Contact Us
          </Typography>
          <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
            For any questions about these Terms & Conditions, contact us at:
            <br />
            <strong>Email:</strong> support@zestdrycleaners.com
            <br />
            <strong>Phone:</strong> +91 98765 43210
          </Typography>

          {/* Back Link */}
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

export default TermsAndConditions;
