import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import { Container, Box, Typography, Chip, Divider } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Button from '../components/ui/Button';
import './MyOrders.css';
import { Select } from '../components/ui';
import shirtimg from '../assets/shirt.jpg';

const statusFilter = [
    { value: "tmonth", label: "This Month" },
    { value: "lmonth", label: "Last Month" },
    { value: "alltime", label: "All Time" },
];

interface Order {
    id: number;
    service: string;
    category: string;
    date: string;
    status: 'Active' | 'Done' | 'Cancelled';
    address: string;
    image: string;
}

const MyOrders: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('This Month');

    const orders: Order[] = [
        {
            id: 1,
            service: 'Shirt',
            category: 'Iron',
            date: 'Friday, Sept 26, 2025',
            status: 'Active',
            address: '3329 Joyce Stree, PA, USA',
            image: shirtimg,
        },
        {
            id: 2,
            service: 'Suits',
            category: 'Iron',
            date: 'Friday, Sept 22, 2025',
            status: 'Done',
            address: '3329 Joyce Stree, PA, USA',
            image: shirtimg,
        },
        {
            id: 3,
            service: 'Curtains',
            category: 'Iron & Wash',
            date: 'Friday, Sept 20, 2025',
            status: 'Cancelled',
            address: '3329 Joyce Stree, PA, USA',
            image: shirtimg,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return { bg: '#2196F3', text: 'white' };
            case 'Done':
                return { bg: '#C9F8BA', text: '#336B3F' };
            case 'Cancelled':
                return { bg: '#f44336', text: 'white' };
            default:
                return { bg: '#C9F8BA', text: '#336B3F' };
        }
    };

    const handleTrackOrder = (orderId: number) => {
        navigate(`/order-details/${orderId}`);
    };

    return (
        <div className="my-orders-page">
            <DashboardNavbar />
            <main className="my-orders-content">
                <Container maxWidth="xl">
                    <Box className="filter-section animate-slide-down">
                        <Select label="Status" options={statusFilter} value={filter} onChange={(e) => setFilter(e.target.value)} variant="dark" placeholder="Select Category" />
                    </Box>
                    <Box className="orders-list">
                        {orders?.map((order, index) => {
                            const statusColors = getStatusColor(order.status);
                            return (
                                <Box
                                    key={order.id}
                                    className="order-card animate-slide-up hover-lift smooth-transition"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <Box className="order-card-content mb-3">
                                        <Box className="order-image-wrapper">
                                            <img src={order.image} alt={order.service} className="order-image" />
                                            <Chip
                                                label={order.status}
                                                sx={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    left: '8px',
                                                    backgroundColor: statusColors.bg,
                                                    color: statusColors.text,
                                                    fontWeight: 600,
                                                    fontSize: '0.75rem',
                                                    height: '24px',
                                                }}
                                            />
                                        </Box>

                                        {/* Service Details */}
                                        <Box className="order-details">
                                            <Typography variant="h4" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, color: '#fff', mb: 1 }}>
                                                Service: <strong className='fs-4 fw-bold'>{order.service}</strong>
                                            </Typography>
                                            <Typography variant='h6' sx={{ color: '#fff', mb: 2 }}>
                                                Category: <strong className='fs-4 fw-bold'>{order.category}</strong>
                                            </Typography>
                                        </Box>

                                        {/* Date and Track Button */}
                                        <Box className="order-actions">
                                            <Typography variant='h6' sx={{ color: '#fff', mb: 2, textAlign: { xs: 'left', md: 'right' } }}>
                                                {order.date}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                <Button
                                                    onClick={() => handleTrackOrder(order.id)}
                                                    variant="secondary"
                                                    size="medium"
                                                    className="hover-lift smooth-transition rounded-pill"
                                                >
                                                    Track Order
                                                    <ArrowForwardIcon sx={{ ml: 1, fontSize: '18px' }} />
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="medium"
                                                    className="hover-lift smooth-transition rounded-pill"
                                                >
                                                    <ArrowForwardIcon sx={{ ml: 1, fontSize: '18px' }} />
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ border: '1px solid rgba(0, 0, 0, 1)' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                                        <LocationOnIcon sx={{ fontSize: '18px', color: '#fff' }} />
                                        <Typography variant='h6' sx={{ color: '#fff' }}>
                                            {order.address}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Container>
            </main>
        </div>
    );
};

export default MyOrders;
