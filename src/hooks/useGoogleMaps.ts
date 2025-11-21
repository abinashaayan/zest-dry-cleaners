import { useEffect, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export const useGoogleMaps = (apiKey: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if ((window as any).google && (window as any).google.maps) {
      setIsLoaded(true);
      return;
    }

    if (!apiKey) {
      setLoadError('Google Maps API key is not set');
      return;
    }

    // Ensure options are set with the API key (in case main.tsx hasn't run yet)
    try {
      setOptions({
        apiKey: apiKey,
        version: 'weekly',
      });
    } catch (e) {
      // Options might already be set, which is fine
      console.log('setOptions already called or error:', e);
    }

    // Load the required libraries
    const loadMaps = async () => {
      try {
        // Import maps library first - this will load the base script with the API key
        await importLibrary('maps');
        
        // Wait a moment for the script to fully initialize
        let retries = 0;
        while (retries < 10 && (!(window as any).google || !(window as any).google.maps)) {
          await new Promise(resolve => setTimeout(resolve, 100));
          retries++;
        }
        
        if (!(window as any).google || !(window as any).google.maps) {
          throw new Error('Google Maps script failed to load');
        }
        
        // Then load other required libraries
        const [places, geocoding] = await Promise.all([
          importLibrary('places'),
          importLibrary('geocoding'),
        ]);

        // Ensure Geocoder is available
        if (!(window as any).google?.maps?.Geocoder && geocoding) {
          (window as any).google.maps.Geocoder = geocoding.Geocoder;
        }
        
        setIsLoaded(true);
      } catch (error: any) {
        console.error('Error loading Google Maps libraries:', error);
        const errorMessage = error?.message || 'Failed to load Google Maps';
        setLoadError(errorMessage);
        
        // Provide helpful error message
        if (errorMessage.includes('ApiProjectMapError') || errorMessage.includes('NoApiKeys') || errorMessage.includes('api-project-map-error')) {
          console.error('=== Google Maps API Key Error ===');
          console.error('Please verify the following in Google Cloud Console:');
          console.error('1. API Key is correct:', apiKey.substring(0, 15) + '...');
          console.error('2. Maps JavaScript API is ENABLED');
          console.error('3. Places API is ENABLED');
          console.error('4. Geocoding API is ENABLED');
          console.error('5. API key restrictions allow:');
          console.error('   - HTTP referrers: http://localhost:* and your domain');
          console.error('   - OR no restrictions (for development)');
          console.error('6. Billing is enabled for the Google Cloud project');
          console.error('================================');
        }
      }
    };

    loadMaps();
  }, [apiKey]);

  return { isLoaded, loadError };
};

