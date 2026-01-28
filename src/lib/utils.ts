// Utility function to format numbers consistently (prevents hydration errors)
export const formatCurrency = (value: number): string => {
  // Use 'en-IN' for Indian numbering system (lakhs, crores) or 'en-US' for standard
  // This ensures consistent formatting on server and client
  return value.toLocaleString('en-IN');
};

