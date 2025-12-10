import React from "react";
import { Box, Typography, Card, CardContent, Divider, IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "../ui";
import type { LocationData } from "../dialogs/LocationDialog";
import { GOOGLE_MAPS_API_KEY } from "../../utils/config";
import { useUserAddresses, type ApiAddress } from "../../hooks/useUserAddresses";
import AddIcon from '@mui/icons-material/Add';
import Loader from "../ui/Loader";

interface LocationCardProps {
  savedLocations: LocationData[];
  indianStates: Array<{ value: string; label: string }>;
  onAddLocation: () => void;
  onEditLocation?: (location: LocationData | ApiAddress) => void;
  onDeleteLocation?: (locationId: string) => void;
  refreshTrigger?: number; 
}

const LocationCard: React.FC<LocationCardProps> = ({
  savedLocations,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  refreshTrigger,
}) => {
  const { addresses, loading, deletingLocationId, handleDeleteAddress } = useUserAddresses(refreshTrigger);

  // Convert API address to LocationData format
  const formatAddress = (apiAddress: ApiAddress): string => {
    const parts = [];
    if (apiAddress.houseNumber) parts.push(apiAddress.houseNumber);
    if (apiAddress.streetName) parts.push(apiAddress.streetName);
    if (apiAddress.area) parts.push(apiAddress.area);
    if (apiAddress.city) parts.push(apiAddress.city);
    if (apiAddress.state) parts.push(apiAddress.state);
    if (apiAddress.zipCode) parts.push(apiAddress.zipCode);
    return parts.join(", ");
  };

  // Handle delete with API call
  const handleDelete = async (locationId: string, isApiAddress: boolean) => {
    if (isApiAddress) {
      try {
        await handleDeleteAddress(locationId, () => {
          if (onDeleteLocation) {
            onDeleteLocation(locationId);
          }
        });
      } catch (error) {
        // Error already handled in handleDeleteAddress
      }
    } else {
      if (onDeleteLocation) {
        onDeleteLocation(locationId);
      }
    }
  };

  const getMapUrl = (address: ApiAddress): string => {
    let center = formatAddress(address);
    if (address.currentAddress && address.currentAddress.coordinates) {
      const [longitude, latitude] = address.currentAddress.coordinates;
      center = `${latitude},${longitude}`;
    }
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
      center
    )}&zoom=15&size=400x150&markers=color:blue|label:H|${encodeURIComponent(center)}&key=${GOOGLE_MAPS_API_KEY}`;
  };

  const addressIds = new Set(addresses.map(addr => addr._id));
  const uniqueSavedLocations = savedLocations.filter(loc => !addressIds.has(loc.id));
  
  const allLocations = [
    ...addresses.map((addr) => ({
      id: addr._id,
      address: formatAddress(addr),
      zipCode: addr.zipCode,
      state: addr.state,
      apiAddress: addr, 
    })),
    ...uniqueSavedLocations,
  ];
  return (
    <Box>
      <Card sx={{ backgroundColor: "rgba(201, 248, 186, 1)", borderRadius: { xs: "12px", sm: "16px" } }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 2, sm: 0 }, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#336B3F", fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" } }}>My Locations</Typography>
            <Button
              onClick={onAddLocation}
              type="button"
              size="small"
              style={{
                backgroundColor: "#C9F8BA",
                border: "1px solid #336B3F",
                color: "#336B3F",
                borderRadius: "12px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 12px"
              }}
            >
              <AddIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
              Add New
            </Button>
          </Box>
          <Divider sx={{ backgroundColor: "rgba(143, 146, 161, 0.1)" }} />
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 2,
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "hidden",
              pr: 1,
              mt: 2,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "rgba(201, 248, 186, 0.1)",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(201, 248, 186, 0.5)",
                borderRadius: "10px",
                "&:hover": {
                  background: "rgba(201, 248, 186, 0.7)",
                },
              },
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(201, 248, 186, 0.5) rgba(201, 248, 186, 0.1)",
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <Loader />
              </Box>
            ) : allLocations.length === 0 ? (
              <Typography sx={{ color: "rgba(51, 107, 63, 0.7)", textAlign: "center", py: 4 }}>
                No locations added yet. Click "Add New" to add a location.
              </Typography>
            ) : (
              allLocations.map((location) => {
                const apiAddress = (location as any).apiAddress as ApiAddress | undefined;
                const mapUrl = apiAddress ? getMapUrl(apiAddress) : `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                  location.address
                )}&zoom=15&size=400x150&markers=color:blue|label:H|${encodeURIComponent(location.address)}&key=${GOOGLE_MAPS_API_KEY}`;

                return (
                  <Box
                    key={location.id}
                    sx={{
                      backgroundColor: "rgba(51, 107, 63, 0.1)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid rgba(51, 107, 63, 0.2)",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                      }}
                    >
                      <Box
                        component="img"
                        src={mapUrl}
                        alt={location.address}
                        sx={{
                          width: "100%",
                          height: { xs: "100px", sm: "120px", md: "140px" },
                          objectFit: "cover",
                          borderTopLeftRadius: { xs: "8px", sm: "12px" },
                          borderTopRightRadius: { xs: "8px", sm: "12px" },
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          display: "flex",
                          gap: 1,
                          backgroundColor: "rgb(223 163 163 / 90%)",
                          borderRadius: "8px",
                          padding: "4px",
                        }}
                      >
                        <IconButton
                          onClick={() => {
                            if (onEditLocation) {
                              if (apiAddress) {
                                onEditLocation(apiAddress as any);
                              } else {
                                onEditLocation(location);
                              }
                            }
                          }}
                          size="small"
                          sx={{
                            color: "#336B3F",
                            backgroundColor: "rgba(201, 248, 186, 0.8)",
                            "&:hover": {
                              backgroundColor: "rgba(201, 248, 186, 1)",
                            },
                            padding: "6px",
                          }}
                        >
                          <EditIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(location.id, !!apiAddress)}
                          size="small"
                          disabled={deletingLocationId === location.id}
                          sx={{
                            color: "#d32f2f",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            "&:hover": {
                              backgroundColor: deletingLocationId === location.id ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 0, 0, 0.1)",
                            },
                            "&:disabled": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              opacity: 0.7,
                            },
                            padding: "6px",
                            minWidth: "32px",
                            minHeight: "32px",
                          }}
                        >
                          {deletingLocationId === location.id ? (
                            <Loader size={16} color="#d32f2f" />
                          ) : (
                            <DeleteIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 1.5, sm: 2 }, p: { xs: 1.5, sm: 2 } }}>
                      <LocationOnIcon sx={{ color: "#336B3F", fontSize: { xs: 24, sm: 26, md: 28 }, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: "#336B3F", fontWeight: "bold", mb: 0.5 }}>
                          {location.address}
                        </Typography>
                        {apiAddress && (
                          <Typography variant="caption" sx={{ color: "rgba(51, 107, 63, 0.7)", fontSize: "0.75rem" }}>
                            {apiAddress.addressType} {apiAddress.isDefault && "• Default"}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LocationCard;

