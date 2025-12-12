export {
  Places
};

interface Places {
    lat: number;
    lng: number;
    name: string; 
    id: number;
    count: number;
}
declare global {
  interface Window {
    setPlaces: (places: Places[]) => void;
  }
}
