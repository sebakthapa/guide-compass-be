import axios from 'axios';

export async function getCoordinates(
  location: { city?: string; county: string; state: string; country: string } | string
) {
  let searchParams: URLSearchParams | null = null;

  if (typeof location === 'string') {
    searchParams = new URLSearchParams({ q: location });
  } else {
    searchParams = new URLSearchParams(location);
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
    return null;
  }
}
