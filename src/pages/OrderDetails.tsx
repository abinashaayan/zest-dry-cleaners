import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import {
  Container,
  Box,
  Typography,
  Rating,
  TextField,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '../components/ui/Button';
import './OrderDetails.css';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(4.5);
  const [feedback, setFeedback] = useState('');

  // In a real app, you'd fetch order details based on id
  const order = {
    id: 1,
    service: 'Shirt',
    category: 'Iron',
    date: 'Friday, Sept 26, 2025',
    pickupDate: 'Sunday, 21st September',
    deliveryDate: 'Tuesday, 23rd September',
    image: 'https://via.placeholder.com/300/FFC7C7/FFFFFF?text=Shirts',
    items: [
      { name: 'Iron', price: '$20' },
      { name: 'Service Charge', price: '$2' },
      { name: 'Promo Code', price: '-$20' },
    ],
    total: '$22',
  };

  const handleSubmitFeedback = () => {
    console.log('Rating:', rating, 'Feedback:', feedback);
    // Handle feedback submission
  };

  return (
    <div className="order-details-page">
      <DashboardNavbar />
      <main className="order-details-content">
        <Container maxWidth="xl">
          {/* Service Details Section */}
          <Box className="service-details-section animate-slide-up">
            <Box className="service-details-content-wrapper">
              <Box className="service-info">
                <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, color: '#336B3F', mb: 1 }}>
                  Service: <strong>{order.service}</strong>
                </Typography>
                <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.25rem' }, fontWeight: 600, color: '#336B3F', mb: 2 }}>
                  Category: <strong>{order.category}</strong>
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, color: '#336B3F', mb: 3 }}>
                  {order.date}
                </Typography>
                <Button
                  variant="secondary"
                  size="medium"
                  className="hover-lift smooth-transition"
                  sx={{ minWidth: '150px' }}
                >
                  Track Order
                  <ArrowForwardIcon sx={{ ml: 1, fontSize: '18px' }} />
                </Button>
              </Box>
              <Box className="service-image-card">
                <img src={order.image} alt={order.service} className="service-detail-image" />
              </Box>
            </Box>
          </Box>

          {/* Pickup & Delivery Section */}
          <Box className="pickup-delivery-section animate-slide-up animate-delay-1">
            <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700, color: 'white', mb: 2 }}>
              Pickup & Delivery
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>
              Pickup Date: {order.pickupDate}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, color: 'rgba(255, 255, 255, 0.8)' }}>
              Delivery Date: {order.deliveryDate}
            </Typography>
          </Box>

          {/* Billings Section */}
          <Box className="billings-section animate-slide-up animate-delay-2">
            <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700, color: '#336B3F', mb: 3 }}>
              Billings
            </Typography>
            <Box className="billing-items">
              {order.items.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, color: '#336B3F' }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, color: '#336B3F', fontWeight: 600 }}>
                    {item.price}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 3, borderTop: '2px solid #336B3F' }}>
                <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#336B3F' }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700, color: '#336B3F' }}>
                  {order.total}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Ratings Section */}
          <Box className="ratings-section animate-slide-up animate-delay-3">
            <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700, color: 'white', mb: 2 }}>
              Ratings
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Rating
                value={rating}
                precision={0.5}
                onChange={(event, newValue) => setRating(newValue)}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#FFC107',
                  },
                  '& .MuiRating-iconEmpty': {
                    color: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              />
              <Typography sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, color: 'white' }}>
                {rating} (Stars)
              </Typography>
            </Box>
            <TextField
              label="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback..."
              multiline
              rows={4}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              }}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handleSubmitFeedback}
                variant="secondary"
                size="medium"
                className="hover-lift smooth-transition"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default OrderDetails;

