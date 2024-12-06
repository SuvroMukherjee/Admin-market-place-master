export const distanceCategories = [
    { text: "Within City", range: "upto 100 Km", distance: 100, default: true },
    { text: "Nearby Cities or Districts", range: "upto 300 Km", distance: 300, default: false },
    { text: "Within State", range: "upto 600 Km", distance: 600, default: false },
    { text: "Inter-State (Nearby States)", range: "upto 1000 Km", distance: 1000, default: false },
    { text: "With in India (Across States)", range: "Above 6000 Km", distance: Infinity, default: false }
  ];