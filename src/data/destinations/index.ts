import vietnamHeroImage from "@/assets/vn/vietnam-hero.webp";

import { vietnamData } from "@/data/countries/vietnam";
import { DestinationData, ItineraryData } from "@/data/types";

export type { Trip, DestinationData, ItineraryData } from "@/data/types";

export const destinationsData: Record<string, DestinationData> = {
  vietnam: {
    country: "Vietnam",
    heroImage: vietnamHeroImage,
    heroSubtitle: "Explore Hanoi, Ha Long Bay, and lantern-lit Hoi An on an 8-day escape",
    trips: [
      {
        id: "vietnam-emerald-escape",
        slug: "vietnam",
        title: "Best of Vietnam",
        duration: "8 days",
        description: "Journey through Hanoi, Ha Long Bay, and Hoi An with culture, scenery, food, and nightlife",
        image: vietnamHeroImage,
        price: "$1,795",
        route: "/vietnam-itinerary"
      }
    ],
    itinerary: vietnamData
  }
};
