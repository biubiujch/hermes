export const formatNumber = (value: string | number): string => {
  try {
    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString();
  } catch (error) {
    return '0';
  }
};

export const formatCurrency = (value: string | number): string => {
  try {
    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return '$0';
    return `$${num.toLocaleString()}`;
  } catch (error) {
    return '$0';
  }
};

export const formatETH = (value: string | number): string => {
  try {
    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return '0.0000';
    return num.toFixed(4);
  } catch (error) {
    return '0.0000';
  }
}; 