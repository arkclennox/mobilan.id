// Haversine formula to calculate distance between two coordinates
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateFuelCost(
  distance: number,
  fuelEfficiency: number,
  fuelPrice: number
): {
  fuelNeeded: number;
  totalCost: number;
  estimatedTime: number;
} {
  const fuelNeeded = distance / fuelEfficiency;
  const totalCost = fuelNeeded * fuelPrice;
  const estimatedTime = distance / 60; // Assuming average speed of 60 km/h
  
  return {
    fuelNeeded: Math.round(fuelNeeded * 10) / 10,
    totalCost: Math.round(totalCost),
    estimatedTime: Math.round(estimatedTime * 10) / 10,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0) {
    return `${minutes} menit`;
  } else if (minutes === 0) {
    return `${wholeHours} jam`;
  } else {
    return `${wholeHours} jam ${minutes} menit`;
  }
}