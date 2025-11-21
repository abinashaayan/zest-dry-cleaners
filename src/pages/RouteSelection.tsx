import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button as MuiButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import LocationDialog from "../components/dialogs/LocationDialog";
import type { LocationData } from "../components/dialogs/LocationDialog";
import { GOOGLE_MAPS_API_KEY } from "../utils/config";
import { useGoogleMaps } from "../hooks/useGoogleMaps";

import "./RouteSelection.css";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface RouteAddress {
  id: string;
  address: string;
  lat?: number;
  lng?: number;
  isDestination?: boolean;
}

const RouteSelection: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Dynamic current date/time/day
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDay, setCurrentDay] = useState<string>("");

  // route addresses (dynamic - loaded from sessionStorage or empty)
  const [addresses, setAddresses] = useState<RouteAddress[]>([]);

  // selected address ID for radio buttons
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Current location (separate from addresses)
  const [currentLocation, setCurrentLocation] = useState<RouteAddress | null>(null);

  // dialog state for adding new location
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 44.8365, lng: -93.2040 });

  // Load Google Maps
  const { isLoaded, loadError } = useGoogleMaps(GOOGLE_MAPS_API_KEY);

  // Update current date/time dynamically
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January","February","March","April","May","June","July","August","September","October","November","December"
      ];
      
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const day = now.getDate();
      const year = now.getFullYear();
      
      // Set day name
      setCurrentDay(dayName);
      
      // Set date in format: "Sept 11, 2025"
      const monthAbbr: { [key: string]: string } = {
        "January": "Jan", "February": "Feb", "March": "Mar", "April": "Apr",
        "May": "May", "June": "Jun", "July": "Jul", "August": "Aug",
        "September": "Sept", "October": "Oct", "November": "Nov", "December": "Dec"
      };
      const shortMonth = monthAbbr[monthName] || monthName.substring(0, 3);
      setCurrentDate(`${shortMonth} ${day}, ${year}`);
      
      // Set time in 12-hour format: "8:00 pm"
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${hours}:${minutesStr} ${ampm}`);
    };

    // Update immediately
    updateDateTime();

    // Update every minute to keep time current
    const interval = setInterval(updateDateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Load saved addresses from sessionStorage if available
  useEffect(() => {
    const savedAddresses = sessionStorage.getItem("routeAddresses");
    const savedCurrentLocation = sessionStorage.getItem("currentLocation");
    
    if (savedAddresses) {
      try {
        const parsed = JSON.parse(savedAddresses);
        setAddresses(parsed);
        // Select first address if available
        if (parsed.length > 0 && !selectedAddressId) {
          setSelectedAddressId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error loading saved addresses:", e);
      }
    }

    // Load current location if available
    if (savedCurrentLocation) {
      try {
        const parsed = JSON.parse(savedCurrentLocation);
        setCurrentLocation(parsed);
      } catch (e) {
        console.error("Error loading current location:", e);
      }
    } else {
      // Set default current location
      setCurrentLocation({
        id: "current-loc",
        address: "2045 Lodgeville Road, Eagan...",
        lat: 44.8353,
        lng: -93.2060,
      });
    }
  }, [selectedAddressId]);

  // Initialize Google Map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || googleMapRef.current) return;
    
    const initializeMap = async () => {
      if (!mapRef.current || googleMapRef.current) return;
      
      // Ensure google.maps is available and fully loaded
      if (typeof window === 'undefined' || !window.google || !window.google.maps) {
        // Wait a bit and retry if Google Maps is still loading
        setTimeout(() => {
          if (window.google && window.google.maps && mapRef.current && !googleMapRef.current) {
            initializeMap();
          }
        }, 100);
        return;
      }

      try {
        // Import the maps library to get the Map class
        const { Map } = await window.google.maps.importLibrary('maps') as any;
        
        if (!mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: { lat: mapCenter.lat, lng: mapCenter.lng },
          zoom: 15,
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        googleMapRef.current = map;

        // Add listener for map center changes
        map.addListener("center_changed", () => {
          const center = map.getCenter();
          if (center) {
            setMapCenter({ lat: center.lat(), lng: center.lng() });
          }
        });
      } catch (error) {
        console.error("Error initializing Google Map:", error);
      }
    };

    initializeMap();
  }, [isLoaded]);

  // Update markers when addresses change
  useEffect(() => {
    if (!googleMapRef.current || !isLoaded) return;
    
    // Ensure google.maps is available
    if (typeof window === 'undefined' || !window.google || !window.google.maps) {
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers
    addresses
      .filter((a) => typeof a.lat === "number" && typeof a.lng === "number")
      .forEach((addr) => {
        const marker = new window.google.maps.Marker({
          position: { lat: addr.lat!, lng: addr.lng! },
          map: googleMapRef.current!,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#FFD700",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 3,
          },
          title: addr.address,
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="padding: 8px; font-size: 14px;">${addr.address}</div>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(googleMapRef.current!, marker);
        });

        markersRef.current.push(marker);
      });
  }, [addresses, isLoaded]);

  // Handle address selection via radio button
  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  // Geocode address to get coordinates
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    if (!isLoaded || !window.google || !window.google.maps) {
      // Fallback: use map center with small offset
      const offsetLat = (Math.random() - 0.5) * 0.01;
      const offsetLng = (Math.random() - 0.5) * 0.01;
      return { lat: mapCenter.lat + offsetLat, lng: mapCenter.lng + offsetLng };
    }

    try {
      // Import geocoding library to get Geocoder
      const { Geocoder } = await import('@googlemaps/js-api-loader').then(m => 
        m.importLibrary('geocoding')
      );
      const geocoder = new Geocoder();
      
      return new Promise((resolve) => {
        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            // Fallback: use map center with small offset
            const offsetLat = (Math.random() - 0.5) * 0.01;
            const offsetLng = (Math.random() - 0.5) * 0.01;
            resolve({ lat: mapCenter.lat + offsetLat, lng: mapCenter.lng + offsetLng });
          }
        });
      });
    } catch (error) {
      console.error('Error geocoding address:', error);
      // Fallback: use map center with small offset
      const offsetLat = (Math.random() - 0.5) * 0.01;
      const offsetLng = (Math.random() - 0.5) * 0.01;
      return { lat: mapCenter.lat + offsetLat, lng: mapCenter.lng + offsetLng };
    }
  };

  // Add new location using LocationDialog
  const handleLocationAdd = async (location: LocationData) => {
    const coords = await geocodeAddress(location.address);
    
    const newAddr: RouteAddress = {
      id: location.id,
      address: location.address,
      lat: coords?.lat,
      lng: coords?.lng,
    };
    
    const updatedAddresses = [...addresses, newAddr];
    setAddresses(updatedAddresses);
    
    // Save to sessionStorage
    sessionStorage.setItem("routeAddresses", JSON.stringify(updatedAddresses));
    
    // Select the newly added address
    setSelectedAddressId(location.id);
    
    setOpenLocationDialog(false);
  };

  // Save current location to sessionStorage when it changes
  useEffect(() => {
    if (currentLocation) {
      sessionStorage.setItem("currentLocation", JSON.stringify(currentLocation));
    }
  }, [currentLocation]);


  // Proceed action
  const handleProceed = () => {
    // Save current addresses to sessionStorage before navigating
    sessionStorage.setItem("routeAddresses", JSON.stringify(addresses));
    navigate("/location-selection");
  };

  // Recenter map
  const handleRecenter = () => {
    if (googleMapRef.current && typeof window !== 'undefined' && (window as any).google) {
      googleMapRef.current.setCenter({ lat: mapCenter.lat, lng: mapCenter.lng });
      googleMapRef.current.setZoom(15);
    }
  };

  return (
    <Box sx={{ background: "#336B3F", minHeight: "100vh" }}>
      <DashboardNavbar />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          minHeight: "calc(100vh - 80px)",
          p: { xs: 2, md: 4 },
        }}
      >
        {/* rounded white map background card */}
        <Card className="map-card" sx={{ position: "relative", overflow: "hidden" }}>
          {/* Google Map container */}
          {loadError && (
            <Box sx={{ 
              p: 2, 
              textAlign: "center", 
              color: "#336B3F",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Typography>Error loading map: {loadError}</Typography>
            </Box>
          )}
          {!isLoaded && !loadError && (
            <Box sx={{ 
              p: 2, 
              textAlign: "center", 
              color: "#336B3F",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Typography>Loading map...</Typography>
            </Box>
          )}
          <div
            ref={mapRef}
            style={{
              height: "580px",
              width: "100%",
              position: "relative",
              borderRadius: "24px",
            }}
          />
        </Card>

        {/* Center top date/time/day */}
        <Box className="center-datetime mt-5">
          <Typography className="date-text" sx={{ color: "#336B3F", fontSize: "1.5rem", fontWeight: 'bold' }}>
            {currentDay && currentDate ? `${currentDay}, ${currentDate}` : currentDate || "Loading..."}
          </Typography>
          <Typography className="time-text" sx={{ color: "#336B3F", fontSize: "1rem", mt: 0.5 }}>
            {currentTime || "Loading..."}
          </Typography>
        </Box>

        {/* Static yellow marker (design element) near center-right (keeps visual parity with Figma) */}
        <Box className="design-static-marker">
          <Box
            sx={{
              width: 64,
              height: 64,
              backgroundColor: "#FFD700",
              border: "4px solid #fff",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#336B3F",
                borderRadius: "50%",
              }}
            />
          </Box>
        </Box>

        {/* Recenter button (positioned on map) */}
        <Box className="recenter-btn">
          <IconButton
            onClick={handleRecenter}
            sx={{
              backgroundColor: "#336B3F",
              color: "#fff",
              width: 56,
              height: 56,
              "&:hover": { backgroundColor: "#2d5a35" },
            }}
          >
            {/* simple crosshair with CSS circle inside */}
            <Box sx={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid #fff" }} />
          </IconButton>
        </Box>

        {/* Address Selection Panel Card - positioned on map */}
        <Box className="address-card">
          <Card sx={{ p: 3, backgroundColor: "#336B3F", borderRadius: 3 }}>
            {/* Top Section: Radio button options (light green boxes) */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              {addresses.slice(0, 2).map((addr) => (
                <Box
                  key={addr.id}
                  onClick={() => handleAddressSelect(addr.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(201, 248, 186, 1)",
                    borderRadius: 2,
                    p: 1.5,
                    cursor: "pointer",
                    border: selectedAddressId === addr.id ? "2px solid #336B3F" : "2px solid transparent",
                  }}
                >
                  {/* Radio button indicator */}
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "2px solid #336B3F",
                      backgroundColor: selectedAddressId === addr.id ? "#336B3F" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                    }}
                  >
                    {selectedAddressId === addr.id && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#fff",
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    sx={{
                      color: "#336B3F",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      flex: 1,
                    }}
                  >
                    {addr.address}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Middle Section: Add New button (dark green bar) */}
            <Box sx={{ mb: 2 }}>
              <MuiButton
                onClick={() => setOpenLocationDialog(true)}
                fullWidth
                startIcon={<AddIcon sx={{ color: "#fff" }} />}
                sx={{
                  backgroundColor: "#336B3F",
                  color: "#fff",
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#2d5a35",
                  },
                }}
              >
                Add New
              </MuiButton>
            </Box>

            {/* Bottom Section: Current Location and Selected Destination */}
            <Box>
              {/* Current Location */}
              {currentLocation && (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    {/* White circle with dark green border and dot */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "2px solid #336B3F",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: "#336B3F",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: "rgba(201, 248, 186, 1)", fontSize: "0.95rem" }}>
                        {currentLocation.address}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(201, 248, 186, 0.8)",
                          fontSize: "0.8rem",
                          mt: 0.3,
                        }}
                      >
                        Current Location
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCurrentLocation(null);
                        sessionStorage.removeItem("currentLocation");
                      }}
                      sx={{ color: "#fff" }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Dotted line connecting to selected destination */}
                  {selectedAddressId && (
                    <Box
                      sx={{
                        width: 2,
                        height: 30,
                        backgroundColor: "rgba(201, 248, 186, 0.35)",
                        ml: 2.5,
                        mb: 1.5,
                        borderStyle: "dotted",
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Selected By Radio (Destination) */}
              {selectedAddressId && (() => {
                const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
                return selectedAddr ? (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                      {/* Dark green star icon */}
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "2px solid rgba(201, 248, 186, 1)",
                          backgroundColor: "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <StarIcon sx={{ color: "#336B3F", fontSize: 18 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: "rgba(201, 248, 186, 1)", fontSize: "0.95rem" }}>
                          {selectedAddr.address}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(201, 248, 186, 0.8)",
                            fontSize: "0.8rem",
                            mt: 0.3,
                          }}
                        >
                          Selected By Radio
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : null;
              })()}
            </Box>

            {/* Proceed */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <MuiButton
                onClick={handleProceed}
                sx={{
                  mt: 1,
                  backgroundColor: "rgba(201, 248, 186, 1)",
                  color: "#336B3F",
                  borderRadius: "20px",
                  py: 1.25,
                  fontWeight: 700,
                  textTransform: "none",
                  width: "70%",
                  "&:hover": { backgroundColor: "rgba(201, 248, 186, 0.85)" },
                }}
              >
                Proceed
              </MuiButton>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Add Location Dialog */}
      <LocationDialog
        open={openLocationDialog}
        onClose={() => setOpenLocationDialog(false)}
        onAddLocation={handleLocationAdd}
      />
    </Box>
  );
};

export default RouteSelection;
