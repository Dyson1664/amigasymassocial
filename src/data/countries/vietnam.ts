import vietnamHero from "@/assets/vn/vietnam-hero.webp";
import vnBasketBoat from "@/assets/vn/vn-basketboat.webp";
import haLongBayCruise2 from "@/assets/vn/ha long bay ruise-2.jpg";
import vnBikeRide from "@/assets/vn/vn-bike-ride.webp";
import vnHalongBay from "@/assets/vn/vn-halongbay.webp";
import vnHanoi1 from "@/assets/vn/vn-hanoi1.webp";
import vnHanoi2 from "@/assets/vn/vn-Hanoi2.webp";
import vnHanoiTrainStreet from "@/assets/vn/train street.webp";
import vnHoian from "@/assets/vn/vn-hoian.webp";
import vnLanternDesktop from "@/assets/vn/vn-lantern-desktop.webp";
import vnLantern2 from "@/assets/vn/vn-lantern2.webp";
import releasingLanterns from "@/assets/vn/releasing lanters.jpg";
import sallyLanterns from "@/assets/vn/sally-lanterns.jpg";
import yMasFlag2 from "@/assets/vn/y-mas-flag2.jpg";
import hoiAnMoments3 from "@/assets/vn/hoi-an-moments-3.jpg";
import day7HoiAnImage from "@/assets/vn/day 7 hoi an image.jpg";
import haLongBay2 from "@/assets/vn/ha-long-bay-2.jpg";
import vietnamVideo from "@/assets/vn/vietnam-video.mp4";
import hanoiHotel2 from "@/assets/vn/hotels/hanoi-hotel-2.webp";
import hanoiHotel3 from "@/assets/vn/hotels/hanoi-hotel-3.png";
import cruiseRoom1 from "@/assets/vn/hotels/cruise-room.webp";
import cruiseRoom2 from "@/assets/vn/hotels/cruise-room-2.webp";
import cruise3 from "@/assets/vn/hotels/cruise-3.webp";
import hoiAnHotel1 from "@/assets/vn/hotels/hoi an-hotel.webp";
import hoiAnHotel2 from "@/assets/vn/hotels/hoi-an-hotel2.jpg";
import { Home, Zap, Plane, Users, UtensilsCrossed } from "lucide-react";

export const vietnamData = {
  id: "vietnam-emerald-escape",
  slug: "vietnam",
  title: "Best of Vietnam",
  mobileTitle: "Amigas Y Mas Social",
  mobileTitleKicker: "Best Of Vietnam",
  desktopTitleKicker: "Amigas Y Mas Social",
  subtitle: "An 8-day Vietnam journey through Hanoi, Ha Long Bay, and Hoi An, blending culture, scenery, food, and nightlife.",
  location: "Vietnam",
  duration: "8 days",
  price: "$1,800",
  priceOriginal: "$1,950",
  priceNote: "Only 3 early-bird spots available — save $150 USD",
  mobilePriceNote: "3 early-bird spots",
  ctaLabel: "Reserve Now $400",
  startDate: "February 25th, 2027",
  heroImage: vietnamHero,
  mobileHeroImage: haLongBay2,
  desktopHeroVideo: vietnamVideo,
  desktopHeroPosterImage: vietnamHero,
  desktopTopMiddleImage: yMasFlag2,
  desktopTopRightImage: vnLanternDesktop,
  desktopBottomLeftImage: vnBasketBoat,
  desktopBottomMiddleImage: sallyLanterns,
  desktopBottomMiddleObjectPosition: "50% 50%",
  desktopBottomRightImage: hoiAnMoments3,
  desktopBottomRightObjectPosition: "50% 50%",
  hideSummary: true,
  route: ["Hanoi", "Ha Long Bay", "Hoi An"],
  tags: [
    { emoji: "🚀", label: "Adventure" },
    { emoji: "🪭", label: "Culture" },
    { emoji: "🧳", label: "Solo" },
  ],
  aboutDescription: [
    "Join Amigas Y Mas Social in Vietnam for an unforgettable 8-day adventure through some of the country's most iconic destinations: Hanoi, Ha Long Bay, and Hoi An. We'll dive into the energy of Hanoi, cruise through the emerald waters of Ha Long Bay, and soak up the lantern-lit charm of Hoi An, blending culture, scenery, food, and group experiences along the way.",
    "Expect limestone cliffs, hidden bays, kayaking, rice fields, basket boats, local cooking, free time, nightlife, and plenty of moments to explore at your own pace. This trip is the perfect mix of bucket-list highlights and relaxed group travel, designed for anyone who wants to experience the best of Vietnam without overthinking the planning.",
  ],
  aboutImages: [vietnamHero, vietnamHero],
  highlights: [
    {
      title: "Ha Long Bay Cruise",
      description: "Sail through Ha Long Bay on an overnight cruise surrounded by emerald water and limestone karsts.",
      image: vnHalongBay,
    },
    {
      title: "Hoi An",
      description: "Explore lantern-lit streets, riverside cafes, and the charm of Hoi An's old town.",
      image: vnHoian,
    },
    {
      title: "Countryside Ride",
      description: "Cycle through rice fields and village roads before hands-on local food experiences.",
      image: vnBikeRide,
    },
  ],
  accommodations: [
    {
      title: "Golden Silk Boutique Hotel",
      description: "A stylish 4-star stay in the heart of Hanoi's Old Quarter, just a five-minute walk from Hoan Kiem Lake and perfectly placed for vibrant streets, local cafes, markets, and the city's incredible food scene.",
      images: [hanoiHotel3, hanoiHotel2],
    },
    {
      title: "Ha Long Bay overnight cruise",
      description: "Relax in an elegant private cabin as you sail through Ha Long Bay, with beautiful views, candlelit dining, and sunrise over the limestone karsts.",
      images: [cruiseRoom1, cruiseRoom2, cruise3],
    },
    {
      title: "Le Pavillon Hoi An Gallery Hotel & Spa",
      description: "Unwind in this stylish 4-star Hoi An hotel, with inviting rooms and a relaxing spa setting within easy reach of the lantern-lit Old Town.",
      images: [hoiAnHotel1, hoiAnHotel2],
    },
  ],
  whatsIncludedHighlights: [
    {
      icon: Home,
      title: "7 NIGHTS<br />ACCOMM",
      description: "6 nights in carefully selected 4-star hotels and 1 night aboard a Ha Long Bay cruise.",
    },
    {
      icon: Zap,
      title: "8 DAYS OF<br />VIETNAM",
      description: "Ha Long Bay overnight cruise, kayaking, cooking demonstration, Train Street, Hoi An lanterns, and more.",
      link: {
        text: "Explore the itinerary",
        url: "#itinerary",
      },
    },
    {
      icon: Plane,
      title: "AIRPORT PICKUP<br />& DROP-OFF",
      description: "Includes private airport pickup on arrival in Hanoi and airport drop-off on departure.",
    },
    {
      icon: Users,
      title: "LOCAL<br />GUIDE",
      description: "English-speaking local guides share hidden gems and authentic cultural experiences, with 24/7 support throughout the trip.",
    },
    {
      icon: UtensilsCrossed,
      title: "LOCAL<br />CUISINE",
      description: "7 breakfasts, 3 lunches, and 3 dinners, including welcome and farewell dinners.",
    },
  ],
  itinerary: [
    {
      day: 1,
      date: "Feb 25th",
      title: "Arrival in Hanoi",
      location: "Hanoi, Vietnam",
      heroImage: vnHanoi1,
      description:
        "Welcome to Hanoi, the vibrant and historic heart of Vietnam. Upon arrival, enjoy a private airport transfer to your hotel and time to refresh after your journey. In the evening, we gather for an included welcome dinner, a perfect opportunity to meet your fellow travelers and enjoy your first taste of authentic Vietnamese cuisine. Following dinner, a brief orientation will outline the exciting week ahead and officially begin our Vietnam adventure.",
      meals: "Dinner",
      highlights: "Airport pick up, welcome dinner",
      accommodation: { name: "Golden Silk Boutique Hotel or similar" },
      transportation: {
        mode: "Car",
        from: "Hanoi Airport",
        to: "Hotel in Hanoi",
        duration: "35 mins",
      },
    },
    {
      day: 2,
      date: "Feb 26th",
      title: "Ha Long Bay Overnight Cruise",
      location: "Ha Long Bay, Vietnam",
      heroImage: haLongBay2,
      description:
        "This morning, depart Hanoi for the breathtaking Ha Long Bay. Board your overnight cruise and enjoy lunch as you sail through emerald waters and towering limestone karsts. Spend the afternoon kayaking and swimming at Tra Bau, followed by a sunset party, Vietnamese cooking class, and candlelit dinner on board.",
      meals: "Lunch, Dinner",
      highlights: "Kayaking, swimming at Tra Bau, sunset party, Vietnamese cooking class",
      accommodation: { name: "Ha Long Bay overnight cruise" },
    },
    {
      day: 3,
      date: "Feb 27th",
      title: "Ha Long Bay to Hanoi",
      location: "Ha Long Bay / Hanoi, Vietnam",
      heroImage: haLongBayCruise2,
      description:
        "Wake early to enjoy the sunrise over Ha Long Bay, before visiting the Dark & Light Cave by bamboo boat. After a final lunch onboard, we transfer back to Hanoi. The evening is free to relax or join an optional group dinner.",
      meals: "Breakfast, Lunch",
      highlights: "Ha Long Bay sunrise, Dark & Light Cave by bamboo boat",
      accommodation: { name: "Golden Silk Boutique Hotel or similar" },
    },
    {
      day: 4,
      date: "Feb 28th",
      title: "Hanoi Culture & Nightlife Experience",
      location: "Hanoi, Vietnam",
      heroImage: vnHanoiTrainStreet,
      description:
        "Today we dive into the energy and culture of Hanoi. We begin with a guided walking street tour through the Old Quarter, exploring hidden alleyways, local markets, and vibrant street life. Along the way, we stop for a traditional egg coffee demonstration, learning how this iconic Vietnamese drink is made and tasting it for ourselves. Next, we visit the famous Train Street, where trains pass just inches from homes and cafes, a truly unique and unforgettable experience. As the evening sets in, we explore Hanoi's buzzing nightlife, with plenty of options for food, drinks, and lively atmosphere.",
      highlights: "Hanoi Old Town, walking tour, egg coffee experience, Train Street visit",
      accommodation: { name: "Golden Silk Boutique Hotel or similar" },
    },
    {
      day: 5,
      date: "March 1st",
      title: "Hanoi to Hoi An",
      location: "Hoi An, Vietnam",
      heroImage: releasingLanterns,
      description:
        "We head to the airport and fly to another vibrant city, the enchanting lantern-filled town of Hoi An. Bursting with charm and color, this magical Old Town feels like stepping into a storybook. After check-in and a little time to refresh, we dive straight into the atmosphere, wandering glowing lantern-lit streets, exploring cute boutiques, stopping at lively riverside cafes, and soaking up the buzzing energy. As night falls, we head out for dinner before releasing floating lanterns together on the river and embracing Hoi An's playful, romantic, and electric atmosphere.",
      highlights: "Releasing floating lanterns",
      accommodation: { name: "Le Pavillon Hoi An Gallery Hotel & Spa or similar" },
    },
    {
      day: 6,
      date: "March 2nd",
      title: "Hoi An Countryside & Culinary Experience",
      location: "Hoi An, Vietnam",
      heroImage: vnBikeRide,
      description:
        "After breakfast, enjoy a scenic bicycle ride through rice fields and rural villages surrounding Hoi An. Next, experience an exciting basket boat ride through coconut groves, followed by a local cooking demonstration. We then enjoy lunch before a free afternoon for shopping, tailor visits, or relaxation. Optional evening dinner and nightlife available.",
      meals: "Lunch",
      highlights: "Bicycle tour, basket boating, cooking demonstration",
      accommodation: { name: "Le Pavillon Hoi An Gallery Hotel & Spa or similar" },
    },
    {
      day: 7,
      date: "March 3rd",
      title: "Free Day & Farewell Dinner in Hoi An",
      location: "Hoi An, Vietnam",
      heroImage: day7HoiAnImage,
      description:
        "Today is yours to enjoy at leisure. Relax at the beach, visit tailor shops, join a lantern-making workshop, unwind at a spa, or spend more time exploring Hoi An's lantern-lit streets at your own pace. In the evening, we come together for an included farewell dinner to celebrate our final night and the memories made along the way.",
      meals: "Dinner",
      highlights: "Free day, farewell dinner",
      accommodation: { name: "Le Pavillon Hoi An Gallery Hotel & Spa or similar" },
    },
    {
      day: 8,
      date: "March 4th",
      title: "Departure",
      location: "Vietnam",
      heroImage: yMasFlag2,
      description:
        "After breakfast, transfer to the airport for your onward journey. You leave Vietnam with unforgettable memories, new friendships, and a deeper connection to this beautiful country.",
      meals: "Breakfast",
      highlights: "Airport transfer, departure",
    },
  ],
  summary: {
    duration: "8 Days",
    activities: "Cruise, Culture & Food",
    areas: "Hanoi, Ha Long Bay & Hoi An",
    type: "Culture & Adventure",
  },
  included: [
    {
      title: "Private Transport & Transfers",
      items: [
        { text: "Private airport pick-up in Hanoi" },
        { text: "Private airport drop-off at Da Nang International Airport (DAD)" },
        { text: "All ground transportation throughout the trip" },
        { text: "Domestic flight from Hanoi to Da Nang" },
      ],
    },
    {
      title: "Meals Included",
      items: [
        { text: "7 breakfasts" },
        { text: "3 lunches" },
        { text: "3 dinners (welcome dinner, Ha Long Bay cruise, and farewell dinner)" },
      ],
    },
    {
      title: "Hanoi and Ha Long Bay",
      items: [
        { text: "Ha Long Bay overnight cruise" },
        { text: "Kayaking experience in Ha Long Bay" },
        { text: "Cave exploration in Ha Long Bay" },
        { text: "Hanoi Old Quarter walking tour" },
        { text: "Egg coffee experience" },
        { text: "Train Street visit" },
      ],
    },
    {
      title: "Hoi An Activities",
      items: [
        { text: "Countryside bicycle tour through rice fields and villages" },
        { text: "Basket boat ride through coconut groves" },
        { text: "Cooking demonstration" },
        { text: "Floating lantern release on the river" },
        { text: "Guided cultural and local experiences" },
      ],
    },
  ],
  paymentPlanDescription:
    "Secure your place with a $400 non-refundable deposit and pay the remaining balance in two installments.",
  paymentPlans: [
    {
      title: "Early Bird Price — First 3 Spots",
      price: "$1,800",
      featured: true,
      payments: [
        { label: "Deposit at booking", amount: "$400" },
        { label: "Payment 1 due October 15, 2026", amount: "$700" },
        { label: "Final payment due December 15, 2026", amount: "$700" },
      ],
      note: "Single room: add the $465 supplement to payment 1, making that payment $1,165 and the trip total $2,265.",
    },
    {
      title: "Regular Price",
      price: "$1,950",
      payments: [
        { label: "Deposit at booking", amount: "$400" },
        { label: "Payment 1 due October 15, 2026", amount: "$775" },
        { label: "Final payment due December 15, 2026", amount: "$775" },
      ],
      note: "Single room: add the $465 supplement to payment 1, making that payment $1,240 and the trip total $2,415.",
    },
  ],
  faqs: [
    {
      question: "Which airports should I fly into and out of?",
      answer: "Fly into Noi Bai International Airport (HAN) in Hanoi and fly out of Da Nang International Airport (DAD).",
    },
    {
      question: "What is the local currency?",
      answer: "The local currency is the Vietnamese dong (VND).",
    },
    {
      question: "Do I need a visa for Vietnam?",
      answer: "Most visitors will need to obtain a visa or e-visa before travelling to Vietnam. Citizens of certain countries are eligible for visa-free stays, depending on nationality and length of stay. For U.S. travellers, getting the required e-visa is a simple, straightforward online process completed before arrival. Always check the latest entry requirements before booking.",
      emphasis: "For U.S. travellers, getting the required e-visa is a simple, straightforward online process completed before arrival.",
    },
  ],
};









