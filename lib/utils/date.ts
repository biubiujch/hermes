export const formatTime = (date: Date | null): string => {
  if (!date) return 'Never';
  
  try {
    return date.toLocaleTimeString();
  } catch (error) {
    return 'Unknown';
  }
}; 