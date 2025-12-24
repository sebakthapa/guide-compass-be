import axios from 'axios';

export interface LocationType {
  city?: string;
  county: string;
  state: string;
  country: string;
}

export async function getCoordinates(location: LocationType | string) {
  let searchParams: URLSearchParams | null = null;

  if (typeof location === 'string') {
    searchParams = new URLSearchParams({ q: location });
  } else {
    searchParams = new URLSearchParams(location as unknown as Record<string, string>);
  }
  const url = `https://nominatim.openstreetmap.org/search?format=json&${searchParams.toString()}`;

  try {
    const response = await axios.get(url);
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];

      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error('Location not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error.response.data);
    return null;
  }
}

export async function getDistance(location1: LocationType | string, location2: LocationType | string) {
  const [cord1, cord2] = await Promise.all([getCoordinates(location1), getCoordinates(location2)]);

  if (!cord1 || !cord2) {
    return null;
  }

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const [lat1, lat2] = [cord1.latitude, cord2.latitude];
  const [lon1, lon2] = [cord1.longitude, cord2.longitude];

  const R = 6371000; // Earth's radius in meters
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
