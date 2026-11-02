import { StoreItem, Testimonial, PricingPlan } from './types';

export const WHATSAPP_LINK = "https://wa.me/919217225060";
export const SHEETDB_API = "/api/save-data";

export const STORE_ITEMS: StoreItem[] = [
  { id: 1, name: "Vestige Spirulina", price: "₹415", description: "Superfood for immunity.", image: "https://picsum.photos/200/200?random=1" },
  { id: 2, name: "Flax Oil Capsules", price: "₹605", description: "Rich in Omega-3.", image: "https://picsum.photos/200/200?random=2" },
  { id: 3, name: "Veslim Shake", price: "₹1650", description: "Meal replacement.", image: "https://picsum.photos/200/200?random=3" },
  { id: 4, name: "Noni Capsules", price: "₹585", description: "Cellular health.", image: "https://picsum.photos/200/200?random=4" },
  { id: 5, name: "Calcium Tablets", price: "₹270", description: "Bone strength.", image: "https://picsum.photos/200/200?random=5" },
  { id: 6, name: "Glucosamine", price: "₹950", description: "Joint support.", image: "https://picsum.photos/200/200?random=6" },
];

export const PLANS: PricingPlan[] = [
  {
    id: 1,
    name: "Yoga Basic",
    price: "₹999/mo",
    features: ["Daily Live Zoom", "Morning/Evening Batches", "Joint Pain Relief", "Basic Diet Tips"],
    isPopular: false
  },
  {
    id: 2,
    name: "Weight Loss Pro",
    price: "₹2499/mo",
    features: ["Custom Diet Plan", "Home Workouts", "No Starvation", "Weekly Tracking", "Supplement Guide"],
    isPopular: true
  },
  {
    id: 3,
    name: "Personal Training",
    price: "₹4999/mo",
    features: ["1-on-1 Training", "Athlete Drills", "Injury Rehab", "24/7 Support", "Advanced Nutrition"],
    isPopular: false
  },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Priya Sharma", rating: 5, text: "Lost 10kgs in 3 months! The diet plan was easy to follow and very effective.", image: "https://picsum.photos/100/100?random=10" },
  { id: 2, name: "Rahul Verma", rating: 5, text: "Coach Saroj understands body types perfectly. My joint pain is gone thanks to the Yoga classes.", image: "https://picsum.photos/100/100?random=11" },
  { id: 3, name: "Sunita Reddy", rating: 5, text: "The Spirulina and Flax Oil supplements suggested really boosted my energy levels.", image: "https://picsum.photos/100/100?random=12" },
];