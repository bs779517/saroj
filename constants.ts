import { StoreItem, Testimonial, PricingPlan, Goal, DietType, DietPlan } from './types';

export const WHATSAPP_LINK = "https://wa.me/919217225060";
export const SHEETDB_API = (import.meta as { env?: Record<string, string> }).env?.VITE_SHEETDB_API || "";

export const DIET_PLANS: Record<Goal, Record<DietType, DietPlan>> = {
  [Goal.WEIGHT_LOSS]: {
    [DietType.VEG]: {
      morningDrink: "Warm Jeera-Ajwain Water with ½ Lemon (empty stomach)",
      breakfast: "2 Besan or Moong Dal Chillas with Mint-Coriander Chutney & 5 Soaked Almonds",
      lunch: "1 Multigrain Roti, 1 Bowl Yellow Moong Dal, Lauki/Cabbage Sabzi & Cucumber Salad",
      snack: "1 Cup Green Tea + 1 Bowl Roasted Makhana with Turmeric & Black Pepper",
      dinner: "Warm Mixed Vegetable Soup + 60g Grilled Low-Fat Paneer Tikka (before 8:00 PM)",
      supplements: "Vestige Veslim Shake (Dinner option), Spirulina & Flax Oil Capsules"
    },
    [DietType.NON_VEG]: {
      morningDrink: "Lukewarm Cinnamon-Lemon Detox Water",
      breakfast: "3 Boiled Egg Whites + 1 Whole Egg Bhurji with 1 Multigrain Toast",
      lunch: "120g Grilled Lemon-Herb Chicken Breast, 1 Jowar Roti, Mix Veg & Kachumber Salad",
      snack: "Black Coffee or Green Tea + Roasted Chana (30g)",
      dinner: "Clear Chicken & Spinach Soup or 120g Steamed/Grilled Fish with Sautéed Broccoli",
      supplements: "Vestige Flax Oil (Omega-3), Spirulina & Noni Capsules"
    },
    [DietType.VEGAN]: {
      morningDrink: "Warm Methi (Fenugreek) Seed Water with Lemon",
      breakfast: "Vegetable Oats Upma with Curry Leaves, Flaxseeds & Pomegranate",
      lunch: "1 Bajra/Jowar Roti, Masoor Dal Tadka (oil-light), Bhindi/Beans Sabzi & Beetroot Salad",
      snack: "Herbal Tulsi-Ginger Tea + Handful of Roasted Peanuts & Pumpkin Seeds",
      dinner: "100g Stir-Fried Tofu with Bell Peppers, Spinach & Clear Lentil Broth",
      supplements: "Vestige Spirulina, Noni Capsules & Plant Omega Flax Oil"
    }
  },
  [Goal.MUSCLE_GAIN]: {
    [DietType.VEG]: {
      morningDrink: "Lukewarm Water + 6 Soaked Almonds, 2 Walnuts & 4 Black Raisins",
      breakfast: "Paneer-Stuffed Parathas (light ghee) with 1 Bowl Thick Curd + Banana-Peanut Smoothie",
      lunch: "1.5 Cups Rice or 2 Rotis, Thick Rajma/Chole, 100g Paneer Bhurji & Fresh Salad",
      snack: "Sprouted Moong-Chana Chaat + 1 Glass Milk or Sattu Protein Drink",
      dinner: "2 Multigrain Rotis, Mixed Tadka Dal, Soya Chunk Masala & Warm Turmeric Milk at Bedtime",
      supplements: "Vestige Spirulina, Calcium Tablets & Glucosamine (Joint Recovery)"
    },
    [DietType.NON_VEG]: {
      morningDrink: "Warm Lemon Water + 6 Soaked Almonds & 2 Dates",
      breakfast: "3 Whole Eggs Masala Omelette, 2 Whole-Wheat Toasts & 1 Banana",
      lunch: "180g Home-Style Chicken Curry (low oil), 1.5 Cups Steamed Rice, Dal & Cucumber Raita",
      snack: "2 Boiled Eggs + Sweet Potato Chaat with Lemon & Chaat Masala",
      dinner: "180g Grilled Chicken or Fish Tikka, 2 Rotis & Sautéed Green Beans",
      supplements: "Vestige Spirulina, Flax Oil Omega-3, Calcium & Glucosamine"
    },
    [DietType.VEGAN]: {
      morningDrink: "Warm Water + Soaked Almonds, Walnuts & Chia Seeds",
      breakfast: "Peanut Butter Banana Oatmeal made with Soy/Almond Milk + Hemp/Pumpkin Seeds",
      lunch: "2 Whole-Wheat Rotis, Chickpea (Chana) Masala, Soya Granules Sabzi & Quinoa/Brown Rice",
      snack: "Roasted Sattu Drink with Lemon & Pink Salt + Mixed Sprouts Bowl",
      dinner: "150g Tofu & Green Peas Curry, 1.5 Cups Brown Rice & Mixed Green Salad",
      supplements: "Vestige Spirulina, Noni Cellular Support & Flaxseed Oil"
    }
  },
  [Goal.STAY_FIT]: {
    [DietType.VEG]: {
      morningDrink: "Warm Tulsi-Ginger Water + 5 Soaked Almonds",
      breakfast: "Vegetable Poha or Upma topped with Peanuts, Sev-free Pomegranate & 1 Bowl Curd",
      lunch: "2 Phulkas, Arhar/Toor Dal with ½ tsp Desi Ghee, Seasonal Green Sabzi & Buttermilk (Chaas)",
      snack: "Seasonal Whole Fruit (Apple/Guava/Papaya) + Herbal Green Tea",
      dinner: "1 Bowl Vegetable Khichdi with Kadhi or 1 Roti with Palak Paneer",
      supplements: "Vestige Spirulina & Noni Capsules for Daily Immunity & Vitality"
    },
    [DietType.NON_VEG]: {
      morningDrink: "Warm Honey-Lemon Water + 5 Soaked Almonds",
      breakfast: "2 Poached/Boiled Eggs + Vegetable Dalia or Idli-Sambar",
      lunch: "130g Home-Cooked Fish or Chicken, 1 Roti + ½ Bowl Rice, Dal & Fresh Salad",
      snack: "1 Cup Masala Chai (low sugar) or Green Tea + Roasted Makhana",
      dinner: "1 Roti or 1 Bowl Soup + Egg Curry (2 Eggs) or Grilled Chicken Salad",
      supplements: "Vestige Spirulina, Flax Oil & Noni Wellness Capsules"
    },
    [DietType.VEGAN]: {
      morningDrink: "Warm Amla-Ginger Detox Shot with Water",
      breakfast: "2 Ragi Dosas or Idlis with Drumstick Sambar & Coconut Chutney",
      lunch: "2 Multigrain Rotis, Black Chana or Lobhia Dal, Seasonal Tori/Ghiya Sabzi & Salad",
      snack: "Tender Coconut Water + Mixed Nuts & Seeds Trail Mix",
      dinner: "Warm Millet Khichdi with Mixed Vegetables & Roasted Papad",
      supplements: "Vestige Spirulina & Noni Capsules for Holistic Balance"
    }
  }
};

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