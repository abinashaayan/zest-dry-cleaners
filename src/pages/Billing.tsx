import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import PaymentMethodDialog from "../components/dialogs/PaymentMethodDialog";
import type { CardData } from "../components/dialogs/PaymentMethodDialog";
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MyLocation from "@mui/icons-material/MyLocation";
import AddLocation from "@mui/icons-material/AddLocation";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { GOOGLE_MAPS_API_KEY } from "../utils/config";
import { bookPickup, getCart } from "../utils/auth";
import { getCookie } from "../utils/cookies";
import { showSuccessToast } from "../utils/toast";
import Loader from "../components/ui/Loader";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries: any[] = ["places"];

interface CartItem {
  categoryId: {
    _id: string;
    categoryName: string;
    profileImage?: string;
    pricePerPiece?: number;
    estimatedDeliveryTime?: string;
  };
  quantity: number;
  _id: string;
}

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [promoCode, setPromoCode] = useState("A9CCXJP");
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [savedCards, setSavedCards] = useState<CardData[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceCharge] = useState(2);
  const [promoDiscount] = useState(20);
  const [addresses, setAddresses] = useState<Array<{
    id: string;
    address: string;
    icon: string;
    lat?: number;
    lng?: number;
  }>>([
    { id: "1", address: "2045 Lodgeville Street, Eagan", icon: "circle" },
    { id: "2", address: "3329 Joyce Stree, PA, USA", icon: "star" },
  ]);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const currentLocationFromHook = useCurrentLocation();
  const [currentLocation, setCurrentLocation] = useState<string>(currentLocationFromHook);
  const currentLocationAutocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);
  const currentLocationInputRef = React.useRef<HTMLInputElement>(null);

  const { isLoaded: isMapsLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const { isLoaded } = useGoogleMaps(GOOGLE_MAPS_API_KEY);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const googleMapRef = React.useRef<any>(null);

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        if (data && data.cart && data.cart.selectedCategories) {
          setCartItems(data.cart.selectedCategories);
          setTotalAmount(data.totalAmount || 0);
        }
      } catch (err) {
        console.error("Error fetching cart data:", err);
        showSuccessToast("Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    // Load addresses from sessionStorage if available
    const routeAddresses = sessionStorage.getItem("routeAddresses");
    const savedSelectedAddressId = sessionStorage.getItem("selectedAddressId");
    
    if (routeAddresses) {
      try {
        const parsed = JSON.parse(routeAddresses);
        if (parsed && parsed.length > 0) {
          // Format addresses for display
          const formattedAddresses = parsed.map((addr: any, index: number) => ({
            id: addr.id,
            address: addr.address,
            icon: index === 0 ? "star" : "circle",
            lat: addr.lat,
            lng: addr.lng,
          }));
          setAddresses(formattedAddresses);
          
          // Set selected address if available
          if (savedSelectedAddressId) {
            setSelectedAddressId(savedSelectedAddressId);
          } else if (formattedAddresses.length > 0) {
            setSelectedAddressId(formattedAddresses[0].id);
          }
        }
      } catch (e) {
        console.error("Error parsing route addresses:", e);
      }
    }
  }, []);

  // Sync currentLocation state with hook value when it changes
  useEffect(() => {
    if (currentLocationFromHook && currentLocationFromHook !== 'Loading...') {
      setCurrentLocation(currentLocationFromHook);
    }
  }, [currentLocationFromHook]);

  // Calculate distance when current location or selected address changes
  useEffect(() => {
    if (currentLocation && selectedAddressId && isLoaded && window.google) {
      calculateDistance();
    }
  }, [currentLocation, selectedAddressId, isLoaded]);

  const calculateDistance = () => {
    if (!window.google || !window.google.maps || !selectedAddressId) return;

    const selectedAddr = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddr || !selectedAddr.lat || !selectedAddr.lng) return;

    // Geocode current location
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: currentLocation }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const currentLocationLat = results[0].geometry.location.lat();
        const currentLocationLng = results[0].geometry.location.lng();

        // Calculate distance using Haversine formula
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (currentLocationLat * Math.PI) / 180;
        const φ2 = (selectedAddr.lat! * Math.PI) / 180;
        const Δφ = ((selectedAddr.lat! - currentLocationLat) * Math.PI) / 180;
        const Δλ = ((selectedAddr.lng! - currentLocationLng) * Math.PI) / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distanceInMeters = R * c;
        
        if (distanceInMeters < 1000) {
          setDistance(`${Math.round(distanceInMeters)}m`);
        } else {
          setDistance(`${(distanceInMeters / 1000).toFixed(1)}km`);
        }
      } else {
        // Fallback: use distance service
        const service = new window.google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
          {
            origins: [currentLocation],
            destinations: [{ lat: selectedAddr.lat!, lng: selectedAddr.lng! }],
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === 'OK' && response && response.rows[0] && response.rows[0].elements[0]) {
              const distanceText = response.rows[0].elements[0].distance.text;
              setDistance(distanceText);
            }
          }
        );
      }
    });
  };

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || googleMapRef.current) return;

    const initializeMap = async () => {
      if (!mapRef.current || googleMapRef.current) return;

      if (typeof window === 'undefined' || !window.google || !window.google.maps) {
        setTimeout(() => {
          if (window.google && window.google.maps && mapRef.current && !googleMapRef.current) {
            initializeMap();
          }
        }, 100);
        return;
      }

      try {
        // Use traditional Google Maps API constructor
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 44.8365, lng: -93.2040 },
          zoom: 15,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f5f5f5" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#616161" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
          disableDefaultUI: true,
        });

        googleMapRef.current = map;
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();
  }, [isLoaded]);

  // Update map markers when addresses or selected address changes
  useEffect(() => {
    if (!googleMapRef.current || !isLoaded || !window.google || !window.google.maps) return;

    // Clear existing markers
    if ((googleMapRef.current as any).markers) {
      (googleMapRef.current as any).markers.forEach((marker: any) => marker.setMap(null));
    }
    (googleMapRef.current as any).markers = [];

    // Add marker for selected address
    if (selectedAddressId) {
      const selectedAddr = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddr && selectedAddr.lat && selectedAddr.lng) {
        const marker = new window.google.maps.Marker({
          position: { lat: selectedAddr.lat, lng: selectedAddr.lng },
          map: googleMapRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#FFD700",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 3,
          },
          title: selectedAddr.address,
        });
        (googleMapRef.current as any).markers.push(marker);
        
        // Center map on selected address
        googleMapRef.current.setCenter({ lat: selectedAddr.lat, lng: selectedAddr.lng });
      }
    }

    // Add marker for current location if available
    if (currentLocation && currentLocation !== "Loading...") {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: currentLocation }, (results, status) => {
        if (status === 'OK' && results && results[0] && googleMapRef.current) {
          const location = results[0].geometry.location;
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat(), lng: location.lng() },
            map: googleMapRef.current,
            icon: {
              path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
              fillColor: "#2196F3",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
              scale: 1.5,
              anchor: new window.google.maps.Point(12, 20),
            },
            title: currentLocation,
          });
          if (!(googleMapRef.current as any).markers) {
            (googleMapRef.current as any).markers = [];
          }
          (googleMapRef.current as any).markers.push(marker);
        }
      });
    }
  }, [selectedAddressId, addresses, currentLocation, isLoaded]);

  // Calculate subtotal from cart items
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.categoryId.pricePerPiece || 0) * item.quantity,
    0
  );
  
  // Use API totalAmount if available, otherwise calculate
  const calculatedSubtotal = totalAmount > 0 ? totalAmount : subtotal;
  const total = calculatedSubtotal + serviceCharge - promoDiscount;

  const handleRemovePromo = () => {
    setPromoCode("");
  };

  const handleContinue = async () => {
    try {
      // Get data from sessionStorage
      const userId = getCookie("loggedinId");
      const selectedAddressId = sessionStorage.getItem("selectedAddressId");
      const selectedDate = sessionStorage.getItem("selectedDate");
      const selectedTime = sessionStorage.getItem("selectedTime");

      if (!userId || !selectedAddressId || !selectedDate || !selectedTime) {
        showSuccessToast("Please complete all steps before proceeding");
        return;
      }

      // Format date (convert ISO string to YYYY-MM-DD)
      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toISOString().split('T')[0];

      if (paymentMethod === "online") {
        setOpenPaymentDialog(true);
      } else {
        // Book pickup for cash payment
        setIsBooking(true);
        try {
          await bookPickup({
            userId,
            pickupAddressId: selectedAddressId,
            deliveryAddressId: selectedAddressId, // Using same address for both
            scheduledPickupDate: formattedDate,
            scheduledPickupTimeSlot: selectedTime,
          });
          showSuccessToast("Order booked successfully!");
          navigate("/order-confirmation");
        } catch (error: any) {
          console.error("Error booking pickup:", error);
          showSuccessToast(error.message || "Failed to book order");
        } finally {
          setIsBooking(false);
        }
      }
    } catch (error: any) {
      console.error("Error in handleContinue:", error);
      showSuccessToast("An error occurred. Please try again.");
    }
  };

  const handlePaymentComplete = async (card?: CardData) => {
    if (card) {
      setSavedCards([...savedCards, card]);
    }
    setOpenPaymentDialog(false);
    
    // Book pickup after payment
    try {
      const userId = getCookie("loggedinId");
      const selectedAddressId = sessionStorage.getItem("selectedAddressId");
      const selectedDate = sessionStorage.getItem("selectedDate");
      const selectedTime = sessionStorage.getItem("selectedTime");

      if (!userId || !selectedAddressId || !selectedDate || !selectedTime) {
        showSuccessToast("Please complete all steps before proceeding");
        return;
      }

      // Format date
      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toISOString().split('T')[0];

      setIsBooking(true);
      try {
        await bookPickup({
          userId,
          pickupAddressId: selectedAddressId,
          deliveryAddressId: selectedAddressId,
          scheduledPickupDate: formattedDate,
          scheduledPickupTimeSlot: selectedTime,
        });
        showSuccessToast("Order booked successfully!");
        navigate("/order-confirmation");
      } catch (error: any) {
        console.error("Error booking pickup:", error);
        showSuccessToast(error.message || "Failed to book order");
      } finally {
        setIsBooking(false);
      }
    } catch (error: any) {
      console.error("Error in handlePaymentComplete:", error);
      showSuccessToast("An error occurred. Please try again.");
    }
  };

  const handleAddCard = (card: CardData) => {
    setSavedCards([...savedCards, card]);
  };

  return (
    <Box sx={{ background: "#336B3F", minHeight: "100vh" }}>
      <DashboardNavbar />

      <Box
        sx={{
          display: "flex",
          gap: 3,
          p: { xs: 2, md: 4 },
          pt: { xs: 10, md: 12 },
          maxWidth: "1400px",
          mx: "auto",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {/* Left Card - Billings */}
        <Card
          sx={{
            flex: 1,
            p: 4,
            background: "rgb(81, 157, 98)",
            borderRadius: 5,
            color: "#fff",
            border: "1px solid white",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              mb: 4,
              color: "#fff",
            }}
          >
            Billings
          </Typography>

          {/* Cart Items */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Loader />
            </Box>
          ) : cartItems.length === 0 ? (
            <Typography variant="h6" sx={{ color: "#fff", textAlign: "center", py: 4 }}>
              No items in cart
            </Typography>
          ) : (
            cartItems.map((item) => {
              const itemTotal = (item.categoryId.pricePerPiece || 0) * item.quantity;
              return (
                <Box
                  key={item._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h5" sx={{ color: "#fff", fontWeight: 'bold' }}>
                      {item.categoryId.categoryName}
                    </Typography>
                    {item.quantity > 1 && (
                      <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.85rem" }}>
                        Qty: {item.quantity}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="h5" sx={{ color: "#fff", fontWeight: 'bold' }}>
                    ${itemTotal.toFixed(2)}
                  </Typography>
                </Box>
              );
            })
          )}

          {/* Service Charge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 'bold' }}>
              Service Charge
            </Typography>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 'bold' }}>
              ${serviceCharge}
            </Typography>
          </Box>

          {/* Promo Code */}
          {promoCode && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h5" sx={{ color: "#fff", fontWeight: 'bold' }}>
                    Promo Code
                  </Typography>
                  <TextField
                    value={promoCode}
                    size="small"
                    disabled
                    sx={{
                      backgroundColor: "rgba(201, 248, 186, 1)",
                      color: "rgba(51, 107, 63, 1)",
                      borderRadius: 1,
                      width: "120px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                        "& input": {
                          color: "#336B3F",
                          fontSize: "0.9rem",
                          py: 0.5,
                          px: 1,
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={handleRemovePromo}
                          sx={{ color: "#336B3F", p: 0.5 }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 'bold' }}>
                  -${promoDiscount}
                </Typography>
              </Box>
            </>
          )}

          {/* Total */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, mb: 4, pt: 3, borderTop: "1px solid rgba(255, 255, 255, 0.2)", }}>
            <Typography sx={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, }}>
              Total
            </Typography>
            <Typography sx={{ color: "rgba(117, 221, 82, 1)", fontSize: "1.8rem", fontWeight: 700, }}>
              ${total}
            </Typography>
          </Box>

          {/* Payment Methods */}
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", sm: "row" }, mt: 2 }}>
            <Box
              onClick={() => setPaymentMethod("online")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                flex: 1,
              }}
            >
              {paymentMethod === "online" ? (
                <CheckCircleIcon sx={{ color: "rgba(201, 248, 186, 1)", fontSize: 28, mb: 0.5, }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ color: "#fff", fontSize: 28, mb: 0.5, }} />
              )}
              <Box sx={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5, }}>
                <CreditCardIcon sx={{ color: "#fff", fontSize: 40, }} />
              </Box>
              <Typography sx={{ color: "#fff", fontSize: "0.9rem", fontWeight: 500, }}>
                Online Payment
              </Typography>
            </Box>

            {/* Cash */}
            <Box
              onClick={() => setPaymentMethod("cash")}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                flex: 1,
              }}
            >
              {paymentMethod === "cash" ? (
                <CheckCircleIcon sx={{ color: "rgba(201, 248, 186, 1)", fontSize: 28, mb: 0.5, }} />
              ) : (
                <RadioButtonUncheckedIcon sx={{ color: "#fff", fontSize: 28, mb: 0.5, }} />
              )}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 0.5,
                }}
              >
                <AccountBalanceWalletIcon sx={{ color: "#fff", fontSize: 40, }} />
              </Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Cash
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Right Card - Map and Addresses */}
        <Card
          sx={{
            flex: 1,
            p: 3,
            background: "#336B3F",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            border: "1px solid white",
          }}
        >
          {/* Map */}
          <Box
            sx={{
              width: "100%",
              height: 300,
              borderRadius: 2,
              mb: 3,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            <div
              ref={mapRef}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
              }}
            />

            {/* Distance Badge */}
            {distance && (
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
                  zIndex: 1000,
                }}
              >
                {distance}
              </Box>
            )}
          </Box>

          {/* Address Selection with Radio Buttons */}
          <Box sx={{ mb: 2 }}>
            <RadioGroup
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {addresses.map((addr) => (
                <FormControlLabel
                  key={addr.id}
                  value={addr.id}
                  control={
                    <Radio
                      sx={{
                        color: "rgba(201, 248, 186, 1)",
                        "&.Mui-checked": { color: "rgba(201, 248, 186, 1)" },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: "0.95rem",
                        fontWeight: 400,
                      }}
                    >
                      {addr.address}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </Box>

          {/* Divider */}
          <Divider sx={{ height: "2px", background: "#FFFFFF", my: 1.5 }} />

          {/* Current Location */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1, mb: 2 }}>
            <MyLocation sx={{ fontSize: 24, color: "rgba(201,248,186,1)" }} />
            {isMapsLoaded ? (
              <Box sx={{ position: "relative", flex: 1 }}>
                <Autocomplete
                  onLoad={(ref) => {
                    currentLocationAutocompleteRef.current = ref;
                  }}
                  onPlaceChanged={() => {
                    if (currentLocationAutocompleteRef.current) {
                      const place = currentLocationAutocompleteRef.current.getPlace();
                      if (place) {
                        const addressValue = place.formatted_address || place.name || "";
                        setCurrentLocation(addressValue);
                      }
                    }
                  }}
                >
                  <input
                    ref={currentLocationInputRef}
                    type="text"
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="Type or choose current location"
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "rgba(201,248,186,1)",
                      fontSize: "0.9rem",
                      width: "100%",
                    }}
                  />
                </Autocomplete>

                <style>{`
                  .pac-container {
                    z-index: 1400 !important;
                    border-radius: 14px;
                    margin-top: 4px;
                  }
                  .pac-item {
                    padding: 10px;
                    cursor: pointer;
                  }
                  .pac-item:hover {
                    background-color: #f5f5f5;
                  }
                `}</style>
              </Box>
            ) : (
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="Loading location autocomplete..."
                disabled
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "rgba(201,248,186,0.6)",
                  fontSize: "0.9rem",
                  width: "100%",
                  cursor: "not-allowed",
                }}
              />
            )}
            {currentLocation && currentLocation !== "Loading..." && (
              <IconButton
                size="small"
                onClick={() => setCurrentLocation("")}
                sx={{ color: "rgba(255,255,255,0.85)", "&:hover": { color: "#fff" } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Selected Address Display */}
          <Box sx={{ mb: 2, color: "rgba(201, 248, 186, 1)", fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AddLocation sx={{ fontSize: '24px' }} />
              {selectedAddressId ? addresses.find((a) => a.id === selectedAddressId)?.address : "No address selected"}
            </Typography>
          </Box>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            fullWidth
            disabled={isBooking}
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
                backgroundColor: "rgba(201, 248, 186, 0.6)",
                color: "#336B3F",
              },
            }}
          >
            {isBooking ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Loader size={20} color="#336B3F" />
                Booking...
              </Box>
            ) : (
              "Continue"
            )}
          </Button>
        </Card>
      </Box>

      {/* Payment Method Dialog */}
      <PaymentMethodDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        onAddCard={handleAddCard}
        onPaymentComplete={handlePaymentComplete}
      />
    </Box>
  );
};

export default Billing;
