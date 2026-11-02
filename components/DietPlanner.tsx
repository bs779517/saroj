import React, { useState } from 'react';
import { Sparkles, Sun, Coffee, UtensilsCrossed, Moon, RotateCcw, Pill, Droplets, Flame } from 'lucide-react';
import { DietType, Goal, DietPlan } from '../types';
import { DIET_PLANS } from '../constants';
import { saveToSheet } from '../services/api';
import confetti from 'canvas-confetti';

interface GeneratedPlanResult extends DietPlan {
  targetCalories: number;
  waterLiters: string;
}

const DietPlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlanResult | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    weight: '',
    height: '',
    goal: Goal.WEIGHT_LOSS,
    type: DietType.VEG,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedPlan(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Persist lead gracefully without firing 404 requests to non-existent endpoints
    saveToSheet({
      date: new Date().toLocaleDateString('en-IN'),
      name: formData.name,
      phone: formData.phone,
      weight: formData.weight,
      height: formData.height,
      goal: formData.goal,
      type: formData.type,
    });

    const w = parseFloat(formData.weight) || 70;
    const h = parseFloat(formData.height) || 170;
    const bmrEstimate = 10 * w + 6.25 * h - 5 * 30 + 5;
    const maintenanceCalories = bmrEstimate * 1.375;

    const goalAdjustment =
      formData.goal === Goal.WEIGHT_LOSS
        ? -400
        : formData.goal === Goal.MUSCLE_GAIN
        ? 320
        : 0;

    const targetCalories = Math.max(1200, Math.round(maintenanceCalories + goalAdjustment));
    const waterLiters = Math.max(2.2, Math.min(4.5, w * 0.035)).toFixed(1);

    const planGroup = DIET_PLANS[formData.goal] || DIET_PLANS[Goal.WEIGHT_LOSS];
    const basePlan = planGroup[formData.type] || planGroup[DietType.VEG];

    setGeneratedPlan({
      ...basePlan,
      targetCalories,
      waterLiters,
    });
    setLoading(false);

    confetti({
      particleCount: 70,
      spread: 70,
      colors: ['#10b981', '#ffffff'],
    });
  };

  return (
    <section id="tools" className="py-24 relative w-full overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex glass-premium px-4 py-2 rounded-full mb-4 items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-semibold text-sm">Personalized Nutrition</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Smart <span className="gradient-text">Diet Planner</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-xl">
            <div className="w-14 h-14 rounded-xl mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 placeholder-white/30"
                    placeholder="Your Name"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 placeholder-white/30 tabular-nums"
                    placeholder="+91..."
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    step="0.1"
                    min={20}
                    max={300}
                    required
                    value={formData.weight}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 placeholder-white/30 tabular-nums"
                    placeholder="70"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    step="0.1"
                    min={100}
                    max={250}
                    required
                    value={formData.height}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 placeholder-white/30 tabular-nums"
                    placeholder="170"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    className="w-full bg-[#1a1a2e] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                    onChange={handleInputChange}
                  >
                    {Object.values(Goal).map((g) => (
                      <option key={g} value={g} className="bg-[#1a1a2e]">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">Diet Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    className="w-full bg-[#1a1a2e] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                    onChange={handleInputChange}
                  >
                    {Object.values(DietType).map((t) => (
                      <option key={t} value={t} className="bg-[#1a1a2e]">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-emerald-600 btn-glow font-bold rounded-xl text-lg px-5 py-4 text-center transition-all disabled:opacity-50 flex justify-center items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                {loading ? (
                  <RotateCcw className="animate-spin w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {loading ? 'Analyzing Profile...' : 'Generate Meal Plan'}
              </button>
            </form>
          </div>

          {/* Result Area */}
          <div className="h-full">
            {!generatedPlan ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] glass-card rounded-2xl p-8 text-white/60 border-dashed border border-white/20 transition-all">
                <UtensilsCrossed
                  className={`w-16 h-16 mb-4 ${
                    loading ? 'animate-bounce text-emerald-400' : 'opacity-30'
                  }`}
                />
                <p className={loading ? 'text-emerald-400 animate-pulse' : ''}>
                  {loading
                    ? 'Crafting your personalized menu...'
                    : 'Your custom plan will appear here'}
                </p>
              </div>
            ) : (
              <div className="glass-premium rounded-2xl p-8 border border-emerald-500/30 animate-fade-in-up h-full flex flex-col">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Your Custom Plan
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {formData.goal}
                    </span>
                    <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {formData.type}
                    </span>
                  </div>
                </div>

                {/* Daily Calorie & Hydration Targets */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="glass-card px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-xs text-white/60">Daily Target</p>
                      <p className="text-sm font-bold text-white tabular-nums">
                        ~{generatedPlan.targetCalories} kcal
                      </p>
                    </div>
                  </div>
                  <div className="glass-card px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <p className="text-xs text-white/60">Hydration Goal</p>
                      <p className="text-sm font-bold text-white tabular-nums">
                        {generatedPlan.waterLiters} Liters/day
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5 flex-1 overflow-y-auto no-scrollbar pr-1 mb-6">
                  {[
                    {
                      label: 'Morning Drink',
                      icon: Sun,
                      color: 'text-yellow-400',
                      val: generatedPlan.morningDrink,
                    },
                    {
                      label: 'Breakfast',
                      icon: Coffee,
                      color: 'text-orange-400',
                      val: generatedPlan.breakfast,
                    },
                    {
                      label: 'Lunch',
                      icon: UtensilsCrossed,
                      color: 'text-green-400',
                      val: generatedPlan.lunch,
                    },
                    {
                      label: 'Evening Snack',
                      icon: Coffee,
                      color: 'text-teal-400',
                      val: generatedPlan.snack,
                    },
                    {
                      label: 'Dinner',
                      icon: Moon,
                      color: 'text-indigo-400',
                      val: generatedPlan.dinner,
                    },
                    {
                      label: 'Ayurvedic Supplements',
                      icon: Pill,
                      color: 'text-emerald-400',
                      val: generatedPlan.supplements,
                    },
                  ].map((meal, i) => (
                    <div
                      key={i}
                      className="flex items-start glass-card p-4 rounded-xl border border-white/5"
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${meal.color} mr-4`}
                      >
                        <meal.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-xs mb-1 uppercase tracking-wider opacity-80">
                          {meal.label}
                        </h4>
                        <p className="text-white/90 text-sm leading-relaxed">{meal.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setGeneratedPlan(null)}
                  className="w-full text-white/80 bg-white/5 hover:bg-white/10 font-semibold rounded-xl text-md px-5 py-3 transition-colors border border-white/10 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Reset Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DietPlanner;