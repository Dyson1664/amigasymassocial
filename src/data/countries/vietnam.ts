import vietnamHero from "@/assets/vn/vietnam-hero.webp";
import blueberryMobileHero from "@/assets/vn/blueberry.webp";
import blueberriesDesktopImage from "@/assets/vn/blueberries.webp";
import vnBasketBoat from "@/assets/vn/vn-basketboat.webp";
import vnBoatCruise from "@/assets/vn/boat_cruise.webp";
import vnBikeRide from "@/assets/vn/vn-bike-ride.webp";
import vnFarwell from "@/assets/vn/vn-farwell.webp";
import halongBayDay3 from "@/assets/vn/halongbay.webp";
import vnHalongBay from "@/assets/vn/vn-halongbay.webp";
import vnHanoi1 from "@/assets/vn/vn-hanoi1.webp";
import vnHanoi2 from "@/assets/vn/vn-Hanoi2.webp";
import vnHanoiTrainStreet from "@/assets/vn/train street.webp";
import vnHoian from "@/assets/vn/vn-hoian.webp";
import vnHoiAnDay4 from "@/assets/vn/vn-hoian-day4.webp";
import vnLanternDesktop from "@/assets/vn/vn-lantern-desktop.webp";
import vnLantern2 from "@/assets/vn/vn-lantern2.webp";
import vietnamVideo from "@/assets/vn/vietnam-video.mp4";
import hanoiHotel from "@/assets/vn/Hanoi_hotel.webp";
import cruiseHotel from "@/assets/vn/Cruise_hotel.webp";
import hoiAnHotel1 from "@/assets/vn/hoi_an_hotel_1.webp";
import hoiAnHotel2 from "@/assets/vn/Hoi_an_hotel_2.webp";
import { Home, Zap, Plane, Users, UtensilsCrossed } from "lucide-react";

export const vietnamData = {
  id: "vietnam-emerald-escape",
  slug: "vietnam",
  title: "Best of Vietnam",
  subtitle: "An 8-day Vietnam journey through Hanoi, Ha Long Bay, and Hoi An, blending culture, scenery, food, and nightlife.",
  location: "Vietnam",
  duration: "8 days",
  price: "$1,795",
  priceOriginal: "$1,895",
  priceNote: "First 6 people save $100 USD",
  ctaLabel: "Reserve Now $500",
  startDate: "April 10th",
  heroImage: vietnamHero,
  mobileHeroImage: blueberryMobileHero,
  desktopHeroVideo: vietnamVideo,
  desktopHeroPosterImage: vietnamHero,
  desktopTopMiddleImage: vnHalongBay,
  desktopTopRightImage: vnLanternDesktop,
  desktopBottomLeftImage: blueberryMobileHero,
  desktopBottomMiddleImage: vnHoian,
  desktopBottomMiddleObjectPosition: "50% 50%",
  desktopBottomRightImage: blueberriesDesktopImage,
  desktopBottomRightObjectPosition: "50% 70%",
  hideSummary: true,
  route: ["Hanoi", "Ha Long Bay", "Hoi An"],
  tags: [
    { emoji: "🚀", label: "Adventure" },
    { emoji: "🪭", label: "Culture" },
    { emoji: "🧳", label: "Solo" },
    { emoji: "🏖️", label: "Beach" },
  ],
  aboutDescription: [
    "Join Oonagh in Vietnam for an unforgettable 8-day adventure through some of the country's most iconic destinations: Hanoi, Ha Long Bay, and Hoi An. We'll dive into the energy of Hanoi, cruise through the emerald waters of Ha Long Bay, and soak up the lantern-lit charm of Hoi An, blending culture, scenery, food, and group experiences along the way.",
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
      title: "Skylark Boutique hotel",
      description: "A comfortable Hanoi base for exploring the Old Quarter, Train Street, and the capital's food and nightlife.",
      images: [hanoiHotel],
    },
    {
      title: "Ha Long Bay overnight cruise",
      description: "Wake up on the water surrounded by limestone karsts during the Ha Long Bay overnight cruise.",
      images: [cruiseHotel],
    },
    {
      title: "Thanh Binh Riverside",
      description: "A riverside Hoi An stay close to the lantern-lit old town, cafes, boutiques, and evening atmosphere.",
      images: [hoiAnHotel1, hoiAnHotel2],
    },
  ],
  whatsIncludedHighlights: [
    {
      icon: Home,
      title: "7 NIGHTS<br />ACCOMM",
      description: "Accommodation details to be added as the itinerary is completed.",
    },
    {
      icon: Zap,
      title: "8 DAYS OF<br />VIETNAM",
      description: "Ha Long Bay overnight cruise, kayaking, cooking class, Train Street, Hoi An lanterns, and more.",
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
      description: "7 breakfasts, 3 lunches, and 1 dinner on the Ha Long Bay overnight cruise.",
    },
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival in Hanoi",
      location: "Hanoi, Vietnam",
      heroImage: vnHanoi1,
      description:
        "Welcome to Hanoi, the vibrant and historic heart of Vietnam. Upon arrival, enjoy a private airport transfer to your hotel and time to refresh after your journey. In the evening, we gather for a welcome dinner (not included), a perfect opportunity to meet your fellow travelers and enjoy your first taste of authentic Vietnamese cuisine. Following dinner, a brief orientation will outline the exciting week ahead and officially begin our Vietnam adventure.",
      highlights: "Airport pick up",
      accommodation: { name: "Skylark Boutique hotel or similar" },
      transportation: {
        mode: "Car",
        from: "Hanoi Airport",
        to: "Hotel in Hanoi",
        duration: "45 mins",
      },
    },
    {
      day: 2,
      title: "Ha Long Bay Overnight Cruise",
      location: "Ha Long Bay, Vietnam",
      heroImage: vnBoatCruise,
      description:
        "This morning, we depart Hanoi for the breathtaking Ha Long Bay, famous for its emerald waters and towering limestone karsts. Board your overnight cruise and settle into your cabin before enjoying lunch as we sail deeper into the bay. The afternoon includes kayaking and cave exploring. As the sun sets over the dramatic landscape, we enjoy a beautifully prepared Vietnamese dinner on board, a truly unforgettable setting.",
      meals: "Lunch, Dinner",
      highlights: "Kayaking, cave exploring, Overnight Cruise",
      accommodation: { name: "Ha Long Bay overnight cruise or similar" },
    },
    {
      day: 3,
      title: "Ha Long Bay to Hanoi",
      location: "Ha Long Bay / Hanoi, Vietnam",
      heroImage: halongBayDay3,
      description:
        "Wake up to a peaceful sunrise over the bay and enjoy breakfast onboard. We visit floating oyster farms before cruising back to port. After a final lunch onboard, we transfer back to Hanoi. The evening is free to relax or join an optional group dinner.",
      meals: "Breakfast, Lunch",
      highlights: "Floating oyster farms",
      accommodation: { name: "Skylark Boutique hotel or similar" },
    },
    {
      day: 4,
      title: "Hanoi Culture & Nightlife Experience",
      location: "Hanoi, Vietnam",
      heroImage: vnHanoiTrainStreet,
      description:
        "Today we dive into the energy and culture of Hanoi. We begin with a guided walking street tour through the Old Quarter, exploring hidden alleyways, local markets, and vibrant street life. Along the way, we stop for a traditional egg coffee demonstration, learning how this iconic Vietnamese drink is made and tasting it for ourselves. Next, we visit the famous Train Street, where trains pass just inches from homes and cafes, a truly unique and unforgettable experience. As the evening sets in, we explore Hanoi's buzzing nightlife, with plenty of options for food, drinks, and lively atmosphere.",
      highlights: "Walking tour, egg coffee experience, Train Street visit",
      accommodation: { name: "Skylark Boutique hotel or similar" },
    },
    {
      day: 5,
      title: "Hanoi to Hoi An",
      location: "Hoi An, Vietnam",
      heroImage: vnHoiAnDay4,
      description:
        "We head to the airport and fly to another vibrant city, the enchanting lantern-filled town of Hoi An. Bursting with charm and color, this magical Old Town feels like stepping into a storybook. After check-in and a little time to refresh, we dive straight into the atmosphere, wandering glowing lantern-lit streets, exploring cute boutiques, stopping at lively riverside cafes, and soaking up the buzzing energy. As night falls, we head out for dinner followed by a fun evening releasing floating lanterns on the river and embracing Hoi An's playful, romantic, and electric vibe.",
      highlights: "Releasing floating lanterns",
      accommodation: { name: "Thanh Binh Riverside or similar" },
    },
    {
      day: 6,
      title: "Hoi An Countryside & Culinary Experience",
      location: "Hoi An, Vietnam",
      heroImage: vnBikeRide,
      description:
        "After breakfast, enjoy a scenic bicycle ride through rice fields and rural villages surrounding Hoi An. Next, experience an exciting basket boat ride through coconut groves, followed by a local cooking demonstration. We then enjoy lunch before a free afternoon for shopping, tailor visits, or relaxation. Optional evening dinner and nightlife available.",
      meals: "Lunch",
      highlights: "Bicycle tour, basket boating, cooking demonstration",
      accommodation: { name: "Thanh Binh Riverside or similar" },
    },
    {
      day: 7,
      title: "Free Day in Hoi An",
      location: "Hoi An, Vietnam",
      heroImage: vnHoian,
      description:
        "Today is yours to enjoy at leisure. Relax at the beach, visit tailor shops, join a lantern-making workshop, unwind at a spa, or spend more time exploring Hoi An's lantern-lit streets at your own pace.",
      highlights: "Free day",
      accommodation: { name: "Thanh Binh Riverside or similar" },
    },
    {
      day: 8,
      title: "Departure",
      location: "Vietnam",
      heroImage: vnFarwell,
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
        { text: "Private airport pick-up and airport drop-off" },
        { text: "All ground transportation throughout the trip" },
        { text: "Domestic flight from Hanoi to Hoi An" },
      ],
    },
    {
      title: "Meals Included",
      items: [
        { text: "7 breakfasts" },
        { text: "3 lunches" },
        { text: "1 dinner (Ha Long Bay cruise)" },
      ],
    },
    {
      title: "Hanoi and Ha Long Bay",
      items: [
        { text: "Ha Long Bay overnight cruise" },
        { text: "Kayaking experience in Ha Long Bay" },
        { text: "Cave exploration in Ha Long Bay" },
        { text: "Visit to floating oyster farms" },
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
        { text: "Cooking class" },
        { text: "Guided cultural and local experiences" },
      ],
    },
  ],
  paymentPlanDescription:
    "Secure your place with a $500 non-refundable deposit and pay the remaining balance in four installments.",
  paymentPlans: [
    {
      title: "Early Bird Price",
      price: "$1,795",
      featured: true,
      payments: [
        { label: "Deposit at booking", amount: "$500" },
        { label: "Payment 1 due October 15, 2026", amount: "$324" },
        { label: "Payment 2 due November 15, 2026", amount: "$324" },
        { label: "Payment 3 due January 15, 2027", amount: "$324" },
        { label: "Final payment due February 15, 2027", amount: "$323" },
      ],
      note: "Single room: add the $395 supplement to payment 1, making that payment $719 and the trip total $2,190.",
    },
    {
      title: "Standard Price",
      price: "$1,895",
      payments: [
        { label: "Deposit at booking", amount: "$500" },
        { label: "Payment 1 due October 15, 2026", amount: "$349" },
        { label: "Payment 2 due November 15, 2026", amount: "$349" },
        { label: "Payment 3 due January 15, 2027", amount: "$349" },
        { label: "Final payment due February 15, 2027", amount: "$348" },
      ],
      note: "Single room: add the $395 supplement to payment 1, making that payment $744 and the trip total $2,290.",
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
      answer: "For U.S. passport holders, yes, but it is a simple online e-visa process. Your passport should be valid for at least six months beyond your planned stay and have at least one blank visa page. E-visas are usually processed within three to five working days, but we recommend applying well before travel and printing your approved e-visa for arrival. For many other passport holders, Vietnam's entry process is also straightforward, but requirements vary by nationality, so please check the rules for your passport before booking flights.",
    },
  ],
};









