export interface DietPlan {
  morningDrink: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  supplements: string;
}

export enum Goal {
  WEIGHT_LOSS = 'Weight Loss',
  MUSCLE_GAIN = 'Muscle Gain',
  STAY_FIT = 'Stay Fit',
}

export enum DietType {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg',
  VEGAN = 'Vegan',
}

export interface UserSubmission {
  date: string;
  name: string;
  phone: string;
  weight: string;
  height: string;
  goal: string;
  type?: string; // Optional because BMI calc reuses this structure but might not use Type
}

export interface StoreItem {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  image: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}