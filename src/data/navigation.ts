// Static navigation data extracted from components for better performance

export interface NavigationTrip {
  title: string;
  duration: string;
  location: string;
  link: string;
}

export interface NavigationDestination {
  city: string;
  country: string;
  description: string;
  link: string;
}

// Extract trips data to module level - prevents recreation on every render
export const NAVIGATION_TRIPS: readonly NavigationTrip[] = [
  { title: "Best of Vietnam", duration: "8 Days", location: "Vietnam", link: "/vietnam-itinerary" },
] as const;

// Extract destinations data to module level
export const NAVIGATION_DESTINATIONS: readonly NavigationDestination[] = [
  { city: "Vietnam", country: "Asia", description: "Hanoi, Ha Long Bay & Hoi An", link: "/vietnam-itinerary" },
] as const;
