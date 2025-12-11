export {
  Places
};

interface Places {
    lat: number;
    lng: number;
    label: { name: string; id: number };
    link: string;
    count: number;
}
declare global {
  interface Window {
    setPlaces: (places: Places[]) => void;
  }
}
