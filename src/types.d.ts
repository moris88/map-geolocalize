export {};
declare global {
  interface Window {
    setPlaces: (places: {
        lat: number;
        lng: number;
        label: string;
        link: string;
        name: string;
    }[]) => void;
  }
}
