import { useState, useEffect, useCallback } from 'react';
import { getUserAddresses, deleteUserAddress } from '../utils/auth';
import { getCookie } from '../utils/cookies';
import { showSuccessToast } from '../utils/toast';

export interface ApiAddress {
  _id: string;
  userId: string;
  addressType: string;
  zipCode: string;
  houseNumber: string;
  streetName: string;
  area: string;
  landmark?: string;
  city: string;
  state: string;
  isDefault: boolean;
  currentAddress?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: string;
  updatedAt: string;
}

export const useUserAddresses = (refreshTrigger?: number) => {
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);
  const userId = getCookie("loggedinId");

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserAddresses(userId);
        if (response.data && response.data.addresses) {
          setAddresses(response.data.addresses);
        }
      } catch (error: any) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId, refreshTrigger]);

  // Common delete function
  const handleDeleteAddress = useCallback(async (addressId: string, onSuccess?: () => void) => {
    setDeletingLocationId(addressId);
    try {
      await deleteUserAddress(addressId);
      showSuccessToast("Address deleted successfully!");
      
      // Refresh addresses
      if (userId) {
        const response = await getUserAddresses(userId);
        if (response.data && response.data.addresses) {
          setAddresses(response.data.addresses);
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting address:", error);
      showSuccessToast(error.message || "Failed to delete address");
      throw error;
    } finally {
      setDeletingLocationId(null);
    }
  }, [userId]);

  return { 
    addresses, 
    loading, 
    deletingLocationId,
    handleDeleteAddress 
  };
};

