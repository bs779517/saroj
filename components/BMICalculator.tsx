import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart3, FileText, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  generate10xProReport,
  generateSmartReport,
  ReportMetric,
  WellnessSummary,
} from '../services/pdfGenerator';
import { saveToSheet } from '../services/api';

const AnimatedGauge = ({ value }: { value: number | null }) => {
  const [angle, setAngle] = useState(-90);

  useEffect(() => {
    if (value === null) {
      setAngle(-90);
      return;
    }

    // Convert BMI [15, 40] to Angle [-90, 90]
    const target = ((Math.min(Math.max(value, 15), 40) - 15) / 25) * 180 - 90;

    let startTime: number | null = null;
    let animationFrame: number;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Cubic ease out
      const easePercentage = 1 - Math.pow(1 - percentage, 3);
      setAngle(-90 + (target - -90) * easePercentage);

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <div className="relative w-64 h-32 overflow-hidden mx-auto">
      <svg viewBox="0 0 200 125" className="w-full h-full overflow-visible">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Segments */}
        <path d="M 20 100 A 80 80 0 0 1 60 30 L 70 45 A 60 60 0 0 0 40 100 Z" fill="#60a5fa" />
        <path d="M 60 30 A 80 80 0 0 1 140 30 L 130 45 A 60 60 0 0 0 70 45 Z" fill="#34d399" />
        <path d="M 140 30 A 80 80 0 0 1 180 100 L 160 100 A 60 60 0 0 0 130 45 Z" fill="#fb923c" />

        {/* Ticks */}
        {[-90, -45, 0, 45, 90].map((t, i) => {
          const rad = ((t - 90) * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={100 + 80 * Math.cos(rad)}
              y1={100 + 80 * Math.sin(rad)}
              x2={100 + 90 * Math.cos(rad)}
              y2={100 + 90 * Math.sin(rad)}
              stroke="#fff"
              strokeWidth="2"
              opacity="0.5"
            />
          );
        })}

        {/* Needle */}
        <g transform={`translate(100, 100) rotate(${angle})`} filter="url(#glow)">
          <path d="M -3 0 L 0 -85 L 3 0 Z" fill="#fff" />
          <circle cx="0" cy="0" r="6" fill="#fff" />
        </g>
      </svg>
    </div>
  );
};

interface ComputedViewMetrics extends WellnessSummary {
  bmiNumeric: number;
  catColor: string;
}

const BMICalculator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<ComputedViewMetrics | null>(null);
  const [reportMetrics, setReportMetrics] = useState<ReportMetric[] | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [downloadingType, setDownloadingType] = useState<'10x' | 'smart' | null>(null);
  const [pdfFeedback, setPdfFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [inputs, setInputs] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    weight: '',
    height: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (validationError) setValidationError(null);
  };

  const calculateMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setPdfFeedback(null);

    const w = parseFloat(inputs.weight);
    const heightCm = parseFloat(inputs.height);
    const a = parseInt(inputs.age, 10) || 30;

    if (!Number.isFinite(w) || w < 20 || w > 300 || !Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) {
      setValidationError('Please enter a valid weight (20–300 kg) and height (100–250 cm).');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const h = heightCm / 100;
    const bmi = w / (h * h);
    const isMale = inputs.gender === 'Male';

    // Clinical BMI-referenced ideal & healthy weight range
    const idealWeight = (isMale ? 22.0 : 21.5) * h * h;
    const wMin = 18.5 * h * h;
    const wMax = 24.9 * h * h;

    // Body fat % (Deurenberg formula clamped to physiological bounds)
    const rawBodyFat = isMale ? 1.2 * bmi + 0.23 * a - 16.2 : 1.2 * bmi + 0.23 * a - 5.4;
    const bodyFat = Math.max(5, Math.min(55, rawBodyFat));
    const bfMin = isMale ? 8 : 20;
    const bfMax = isMale ? 19 : 30;

    // Fat-free mass, bone mass & total muscle mass (matching clinical BIA analyzers)
    const leanBodyMass = Math.max(w * 0.45, w * (1 - bodyFat / 100));
    const boneMass = Math.max(1.6, Math.min(4.5, leanBodyMass * 0.05));
    const bmMin = isMale ? 2.4 : 1.8;
    const bmMax = isMale ? 3.4 : 2.8;

    const muscleMass = Math.max(20, leanBodyMass - boneMass);
    const mmMin = idealWeight * (isMale ? 0.69 : 0.60);
    const mmMax = idealWeight * (isMale ? 0.82 : 0.72);

    const skeletalMuscle = Math.max(18, Math.min(55, ((leanBodyMass * (isMale ? 0.54 : 0.48)) / w) * 100));
    const smMin = isMale ? 33.4 : 28.0;
    const smMax = isMale ? 39.3 : 34.0;

    const hydration = Math.max(38, Math.min(72, ((leanBodyMass * 0.722) / w) * 100));
    const hMin = isMale ? 50 : 45;
    const hMax = isMale ? 65 : 60;

    const visceral = Math.max(
      1,
      Math.min(30, (bmi - 18.5) * 0.85 + Math.max(0, a - 20) * 0.08 + (isMale ? 2.2 : 1.2))
    );

    const protein = Math.max(10, Math.min(25, ((leanBodyMass * 0.27) / w) * 100));
    const pMin = isMale ? 16 : 14;
    const pMax = isMale ? 20 : 18;

    const bmrVal = isMale
      ? 10 * w + 6.25 * heightCm - 5 * a + 5
      : 10 * w + 6.25 * heightCm - 5 * a - 161;
    const bmrMin = Math.round(idealWeight * 21);
    const bmrMax = Math.round(idealWeight * 28);

    const metabolicAge = Math.max(
      18,
      Math.round(a + (bmi > 24.9 ? (bmi - 24.9) * 1.1 : bmi < 18.5 ? 2 : -2))
    );

    const getPercent = (val: number, min: number, max: number) => {
      if (val < min) {
        const ratio = Math.max(0, val / min);
        return 8 + ratio * 24;
      } else if (val <= max) {
        const ratio = (val - min) / Math.max(0.01, max - min);
        return 34 + ratio * 32;
      } else {
        const overflow = val - max;
        const ratio = Math.min(1, overflow / Math.max(1, max * 0.45));
        return 68 + ratio * 26;
      }
    };

    const getPercentLG = (val: number, maxGood: number, maxWarn: number) => {
      if (val <= maxGood) return Math.max(6, (val / maxGood) * 32);
      if (val <= maxWarn) return 34 + ((val - maxGood) / (maxWarn - maxGood)) * 32;
      return 68 + Math.min(1, (val - maxWarn) / 10) * 26;
    };

    const getStatus = (val: number, min: number, max: number): 'low' | 'normal' | 'high' => {
      if (val < min) return 'low';
      if (val > max) return 'high';
      return 'normal';
    };

    const getStatusLG = (val: number, maxGood: number): 'low' | 'normal' | 'high' => {
      if (val <= maxGood) return 'normal';
      if (val <= maxGood * 1.4) return 'low';
      return 'high';
    };

    const computedReports: ReportMetric[] = [
      {
        title: 'Weight',
        value: w.toFixed(2),
        unit: 'Kg',
        normalRange: `${wMin.toFixed(1)} to ${wMax.toFixed(1)} Kg`,
        extraInfo: `Ideal weight : ${idealWeight.toFixed(2)} Kg`,
        status: getStatus(w, wMin, wMax),
        percent: getPercent(w, wMin, wMax),
        barType: 'standard',
      },
      {
        title: 'BMI',
        value: bmi.toFixed(2),
        unit: '',
        normalRange: '18.5 to 24.9',
        status: getStatus(bmi, 18.5, 24.9),
        percent: getPercent(bmi, 18.5, 24.9),
        barType: 'standard',
      },
      {
        title: 'Fat',
        value: bodyFat.toFixed(2),
        unit: '%',
        normalRange: `${bfMin} to ${bfMax}%`,
        status: getStatus(bodyFat, bfMin, bfMax),
        percent: getPercent(bodyFat, bfMin, bfMax),
        barType: 'standard',
      },
      {
        title: 'Muscle Mass',
        value: muscleMass.toFixed(2),
        unit: 'Kg',
        normalRange: `${mmMin.toFixed(1)} to ${mmMax.toFixed(1)} Kg`,
        status: getStatus(muscleMass, mmMin, mmMax),
        percent: getPercent(muscleMass, mmMin, mmMax),
        barType: 'standard',
      },
      {
        title: 'Skeletal Muscle',
        value: skeletalMuscle.toFixed(2),
        unit: '%',
        normalRange: `${smMin.toFixed(1)} to ${smMax.toFixed(1)}%`,
        status: getStatus(skeletalMuscle, smMin, smMax),
        percent: getPercent(skeletalMuscle, smMin, smMax),
        barType: 'standard',
      },
      {
        title: 'Bone Mass',
        value: boneMass.toFixed(2),
        unit: 'Kg',
        normalRange: `${bmMin.toFixed(1)} to ${bmMax.toFixed(1)} Kg`,
        status: getStatus(boneMass, bmMin, bmMax),
        percent: getPercent(boneMass, bmMin, bmMax),
        barType: 'standard',
      },
      {
        title: 'Hydration',
        value: hydration.toFixed(2),
        unit: '%',
        normalRange: `${hMin} to ${hMax}%`,
        status: getStatus(hydration, hMin, hMax),
        percent: getPercent(hydration, hMin, hMax),
        barType: 'standard',
      },
      {
        title: 'Visceral Fat',
        value: visceral.toFixed(2),
        unit: '',
        normalRange: '01 to 10',
        status: getStatusLG(visceral, 10),
        percent: getPercentLG(visceral, 10, 15),
        barType: 'low-is-good',
      },
      {
        title: 'Protein',
        value: protein.toFixed(2),
        unit: '%',
        normalRange: `${pMin} to ${pMax}%`,
        status: getStatus(protein, pMin, pMax),
        percent: getPercent(protein, pMin, pMax),
        barType: 'standard',
      },
      {
        title: 'BMR',
        value: Math.round(bmrVal).toString(),
        unit: 'kcal',
        normalRange: `${bmrMin} to ${bmrMax} kcal`,
        extraInfo: `Metabolic Age : ${metabolicAge} yrs`,
        status: getStatus(bmrVal, bmrMin, bmrMax),
        percent: getPercent(bmrVal, bmrMin, bmrMax),
        barType: 'standard',
      },
    ];

    setReportMetrics(computedReports);

    const category =
      bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    const catColor =
      bmi < 18.5
        ? 'text-blue-400'
        : bmi < 25
        ? 'text-emerald-400'
        : bmi < 30
        ? 'text-orange-400'
        : 'text-red-400';

    const tdee = bmrVal * 1.375;
    const dailyCalories = Math.max(
      1200,
      Math.round(bmi >= 25 ? tdee - 400 : bmi < 18.5 ? tdee + 300 : tdee)
    );
    const dailyProteinGrams = Math.round(Math.max(48, idealWeight * (bmi >= 25 ? 1.3 : 1.2)));
    const dailyWaterLiters = Math.max(2.2, Math.min(4.5, w * 0.035)).toFixed(1);

    setMetrics({
      bmiNumeric: bmi,
      bmi: bmi.toFixed(1),
      bodyFat: bodyFat.toFixed(1),
      muscleMass: muscleMass.toFixed(1),
      category,
      catColor,
      hydration: hydration.toFixed(1),
      bmr: Math.round(bmrVal).toString(),
      visceral: visceral.toFixed(1),
      idealWeight: idealWeight.toFixed(1),
      weightMin: wMin.toFixed(1),
      weightMax: wMax.toFixed(1),
      metabolicAge,
      dailyCalories,
      dailyProteinGrams,
      dailyWaterLiters,
    });

    // Save lead non-blockingly
    saveToSheet({
      date: new Date().toLocaleDateString('en-IN'),
      name: inputs.name,
      phone: inputs.phone,
      weight: inputs.weight,
      height: inputs.height,
      goal: `BMI Analysis (${category})`,
    });

    confetti({ particleCount: 50, spread: 60, colors: ['#10b981', '#3b82f6'] });
    setLoading(false);
  };

  const downloadPDF = async (type: '10x' | 'smart') => {
    if (!metrics || !reportMetrics) return;

    setDownloadingType(type);
    setPdfFeedback(null);

    try {
      await new Promise((r) => setTimeout(r, 80));

      if (type === '10x') {
        generate10xProReport(inputs, reportMetrics);
        setPdfFeedback({
          type: 'success',
          message: '10xPro Body Composition PDF downloaded successfully!',
        });
      } else {
        generateSmartReport(inputs, metrics, reportMetrics);
        setPdfFeedback({
          type: 'success',
          message: 'Smart Executive Wellness PDF downloaded successfully!',
        });
      }
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setPdfFeedback({
        type: 'error',
        message: 'Could not generate the PDF report. Please check your inputs and try again.',
      });
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <section id="bmicalculator" className="py-24 relative w-full overflow-hidden bg-slate-900/50">
      <div className="absolute top-1/2 left-1/2 w-full h-[500px] bg-purple-500/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex glass-premium px-4 py-2 rounded-full mb-4 items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-semibold text-sm">Advanced Analytics</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Body <span className="gradient-text">Composition Status</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-xl">
            <form onSubmit={calculateMetrics} className="space-y-5">
              {validationError && (
                <div className="flex items-center gap-2.5 rounded-xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  required
                  value={inputs.name}
                  placeholder="Name"
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500"
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="age"
                  required
                  min={10}
                  max={100}
                  value={inputs.age}
                  placeholder="Age"
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500 tabular-nums"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  name="gender"
                  value={inputs.gender}
                  className="bg-[#1a1a2e] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500"
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={inputs.phone}
                  placeholder="Phone"
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500 tabular-nums"
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <input
                  type="number"
                  name="weight"
                  step="0.01"
                  required
                  value={inputs.weight}
                  placeholder="Weight (kg)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-purple-500 tabular-nums"
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="height"
                  step="0.1"
                  required
                  value={inputs.height}
                  placeholder="Height (cm)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-purple-500 tabular-nums"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-gradient-to-r from-purple-600 to-violet-600 font-bold py-4 rounded-xl transition-transform hover:scale-[1.02] mt-4 shadow-lg shadow-purple-500/25 disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? 'Analyzing...' : 'Calculate Composition'}
              </button>
            </form>
          </div>

          <div className="flex flex-col items-center glass-premium rounded-3xl p-8 border border-white/10 min-h-[400px]">
            <AnimatedGauge value={metrics?.bmiNumeric ?? null} />

            {metrics ? (
              <div className="w-full animate-fade-in-up mt-6">
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-1">
                    Your BMI
                  </p>
                  <div className="flex items-end justify-center gap-2">
                    <span className="text-6xl font-black text-white tabular-nums">
                      {metrics.bmi}
                    </span>
                  </div>
                  <p className={`text-xl font-bold mt-2 ${metrics.catColor}`}>
                    {metrics.category}
                  </p>
                  <p className="text-xs text-white/50 mt-1 tabular-nums">
                    Ideal Weight: {metrics.idealWeight} kg &bull; Metabolic Age: {metrics.metabolicAge} yrs
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-400">Body Fat</p>
                    <p className="text-white font-bold tabular-nums">{metrics.bodyFat}%</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-400">Muscle Mass</p>
                    <p className="text-white font-bold tabular-nums">{metrics.muscleMass} kg</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-400">Visceral Fat</p>
                    <p className="text-white font-bold tabular-nums">{metrics.visceral}</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-400">BMR</p>
                    <p className="text-white font-bold tabular-nums">{metrics.bmr} kcal</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={downloadingType !== null}
                    onClick={() => downloadPDF('10x')}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-[1.02] transition-transform text-sm font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-60 whitespace-nowrap cursor-pointer"
                  >
                    {downloadingType === '10x' ? (
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    ) : (
                      <BarChart3 className="w-4 h-4 shrink-0" />
                    )}
                    <span>
                      {downloadingType === '10x' ? 'Generating PDF...' : '10xPro Report'}
                    </span>
                    <Download className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  </button>

                  <button
                    type="button"
                    disabled={downloadingType !== null}
                    onClick={() => downloadPDF('smart')}
                    className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white hover:scale-[1.02] transition-transform text-sm font-semibold shadow-lg shadow-emerald-600/20 disabled:opacity-60 whitespace-nowrap cursor-pointer"
                  >
                    {downloadingType === 'smart' ? (
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 shrink-0" />
                    )}
                    <span>
                      {downloadingType === 'smart' ? 'Generating PDF...' : 'Smart Report'}
                    </span>
                    <Download className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  </button>
                </div>

                {pdfFeedback && (
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium ${
                      pdfFeedback.type === 'success'
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200'
                        : 'bg-red-500/15 border border-red-500/30 text-red-200'
                    }`}
                  >
                    {pdfFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{pdfFeedback.message}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-white/50 w-full mt-8">
                <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                <p>Enter your details to generate report</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;