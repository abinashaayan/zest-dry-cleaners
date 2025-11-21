import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextFieldComponent from "../ui/TextField";
import { Button, Select } from "../ui";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { GOOGLE_MAPS_API_KEY } from "../../utils/config";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

export interface LocationData {
  id: string;
  address: string;
  zipCode: string;
  state: string;
}

interface LocationDialogProps {
  open: boolean;
  onClose: () => void;
  onAddLocation?: (location: LocationData) => void;
  indianStates?: Array<{ value: string; label: string }>;
}

const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  onClose,
  onAddLocation,
  indianStates = [],
}) => {
  const apiKey = GOOGLE_MAPS_API_KEY;
  const autocompleteRef = useRef<HTMLDivElement | null>(null);
  const placeAutocompleteRef = useRef<any>(null);

  const { isLoaded, loadError } = useGoogleMaps(apiKey);

  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");

  // Initialize PlaceAutocompleteElement when Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !open || !autocompleteRef.current) return;

    const initializeAutocomplete = async () => {
      if (placeAutocompleteRef.current) return;

      try {
        // Wait a bit to ensure places library is fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Ensure places library is loaded
        if (!window.google || !window.google.maps) {
          console.error('Google Maps not loaded');
          return;
        }

        // Import places library to ensure it's available
        const placesLibrary = await import('@googlemaps/js-api-loader').then(m => 
          m.importLibrary('places')
        );

        // Check if PlaceAutocompleteElement is available
        let PlaceAutocompleteElement;
        if (window.google.maps.places?.PlaceAutocompleteElement) {
          PlaceAutocompleteElement = window.google.maps.places.PlaceAutocompleteElement;
        } else if (placesLibrary?.PlaceAutocompleteElement) {
          PlaceAutocompleteElement = placesLibrary.PlaceAutocompleteElement;
        } else {
          console.error('PlaceAutocompleteElement not available');
          return;
        }

        if (!autocompleteRef.current) return;
        autocompleteRef.current.innerHTML = '';

        const placeAutocomplete = new PlaceAutocompleteElement();
        placeAutocomplete.componentRestrictions = { country: "in" };
        placeAutocomplete.fields = ["formatted_address", "address_components", "geometry"];

        // Create a wrapper div for the autocomplete
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.minHeight = '56px';
        autocompleteRef.current.appendChild(wrapper);
        
        // Attach the autocomplete element
        placeAutocomplete.attach(wrapper);

        // Style the input element after it's attached
        const styleInput = () => {
          const input = wrapper.querySelector('input');
          if (input) {
            input.style.width = '100%';
            input.style.height = '56px';
            input.style.padding = '0 14px';
            input.style.fontSize = '16px';
            input.style.borderRadius = '14px';
            input.style.border = '2px solid #336B3F';
            input.style.backgroundColor = 'transparent';
            input.style.color = '#336B3F';
            input.style.outline = 'none';
            input.style.fontFamily = 'inherit';
            input.placeholder = 'Enter address';
            return true;
          }
          return false;
        };

        // Try to style immediately, then retry if needed
        if (!styleInput()) {
          setTimeout(() => {
            if (!styleInput()) {
              setTimeout(styleInput, 200);
            }
          }, 50);
        }

        placeAutocompleteRef.current = placeAutocomplete;

        // Listen for place selection
        placeAutocomplete.addEventListener('gmp-placeselect', (event: any) => {
          const place = event.place;
          if (place) {
            handlePlaceSelected(place);
          }
        });
      } catch (error) {
        console.error('Error initializing PlaceAutocompleteElement:', error);
      }
    };

    initializeAutocomplete();

    return () => {
      if (placeAutocompleteRef.current && autocompleteRef.current) {
        try {
          placeAutocompleteRef.current = null;
          if (autocompleteRef.current) {
            autocompleteRef.current.innerHTML = '';
          }
        } catch (error) {
          console.error('Error cleaning up PlaceAutocompleteElement:', error);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, open]);

  const handlePlaceSelected = (place: any) => {
    if (place) {
      const formattedAddress = place.formatted_address || place.name || "";
      setAddress(formattedAddress);
      const addressComponents = place.address_components || [];
      const postalCode = addressComponents.find(
        (component: any) => component.types.includes("postal_code")
      );
      if (postalCode) {
        setZipCode(postalCode.long_name);
      }
      const stateComponent = addressComponents.find(
        (component: any) => component.types.includes("administrative_area_level_1")
      );
      if (stateComponent) {
        const matchedState = indianStates.find(
          (s) => s.label.toLowerCase().includes(stateComponent.long_name.toLowerCase()) ||
            stateComponent.long_name.toLowerCase().includes(s.label.toLowerCase())
        );
        setState(matchedState ? matchedState.value : stateComponent.long_name);
      }
    }
  };

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, '');
    setZipCode(zip);
    if (zip.length >= 5 && !address && isLoaded && (window as any).google && (window as any).google.maps) {
      try {
        // Import geocoding library if not already available
        const { Geocoder } = await import('@googlemaps/js-api-loader').then(m => 
          m.importLibrary('geocoding')
        );
        const geocoder = new Geocoder();
        geocoder.geocode(
          { address: zip },
          (results: any[], status: any) => {
            if (status === 'OK' && results && results.length > 0) {
              const result = results[0];
              setAddress(result.formatted_address);
              const addressComponents = result.address_components || [];
              const stateComponent = addressComponents.find(
                (component: any) => component.types.includes("administrative_area_level_1")
              );
              if (stateComponent) {
                const matchedState = indianStates.find(
                  (s) => s.label.toLowerCase().includes(stateComponent.long_name.toLowerCase()) ||
                    stateComponent.long_name.toLowerCase().includes(s.label.toLowerCase())
                );
                setState(matchedState ? matchedState.value : stateComponent.long_name);
              }
            }
          }
        );
      } catch (error) {
        console.error('Error geocoding zip code:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddLocation && address && zipCode && state) {
      const newLocation: LocationData = {
        id: `location-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        address,
        zipCode,
        state,
      };
      onAddLocation(newLocation);
    }
    setAddress("");
    setZipCode("");
    setState("");
    onClose();
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "rgba(201, 248, 186, 1)",
          borderRadius: { xs: "20px", sm: "24px", md: "28px" },
          margin: { xs: 1, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ color: "#336B3F", fontWeight: "bold", fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5, md: 3 } }}>
        Add Location
        <IconButton onClick={onClose} sx={{ position: "absolute", right: { xs: 4, sm: 8 }, top: { xs: 4, sm: 8 }, color: "#336B3F", }}>
          <CloseIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
        <Typography variant="body2" sx={{ color: "rgba(51, 107, 63, 0.7)", mb: { xs: 2, sm: 2.5, md: 3 }, fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.95rem" } }}>
          Add home & work locations
        </Typography>
        {loadError && (
          <Box sx={{ py: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#e74c3c" }}>
              Error loading maps: {loadError || 'Unknown error'}
            </Typography>
          </Box>
        )}
        {!isLoaded && !loadError && (
          <Box sx={{ py: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ color: "rgba(51, 107, 63, 0.7)" }}>
              Loading Google Maps...
            </Typography>
          </Box>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5, md: 3 } }}>
          <Box>
            {apiKey && isLoaded ? (
              <Box
                ref={autocompleteRef}
                sx={{
                  width: "100%",
                  "& input": {
                    width: "100%",
                    height: "56px",
                    padding: "0 14px",
                    fontSize: "16px",
                    borderRadius: "14px",
                    border: "2px solid #336B3F",
                    backgroundColor: "transparent",
                    color: "#336B3F",
                    outline: "none",
                    fontFamily: "inherit",
                  },
                }}
              />
            ) : (
              <TextFieldComponent
                label="Current Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                borderColor="#336B3F"
                labelColor="#336B3F"
                textColor="#336B3F"
                required
              />
            )}

          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 2 } }}>
            <Box sx={{ flex: 1 }}>
              <TextFieldComponent
                label="Zip Code"
                value={zipCode}
                onChange={handleZipCodeChange}
                borderColor="#336B3F"
                labelColor="#336B3F"
                textColor="#336B3F"
                required
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              {/* <Select
                label="State"
                options={indianStates}
                value={state}
                onChange={(e) => setState(e.target.value as string)}
                placeholder="Select State"
                variant="dialog"
                required
              /> */}
              <Box sx={{ flex: 1 }}>
                <Select
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value as string)}
                  placeholder="Select State"
                  variant="dialog"
                  required
                  options={[
                    { label: "Maharashtra", value: "Maharashtra" },
                    { label: "Uttar Pradesh", value: "Uttar Pradesh" },
                  ]}
                />
              </Box>

            </Box>
          </Box>
          <Button type="submit" variant="primary" size="large" style={{ backgroundColor: "#336B3F", color: "white", borderRadius: "12px", fontWeight: "bold", marginTop: 2, }}>
            Add Location
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;

