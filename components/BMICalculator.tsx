import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, BarChart3, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const AnimatedGauge = ({ value }: { value: number | null }) => {
  const [angle, setAngle] = useState(-90);
  
  useEffect(() => {
    if (value === null) return;
    
    // Convert BMI [15, 40] to Angle [-90, 90]
    let target = ((Math.min(Math.max(value, 15), 40) - 15) / 25) * 180 - 90;
    
    let startTime: number | null = null;
    let animationFrame: number;
    const duration = 1500;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Cubic ease out
      const easePercentage = 1 - Math.pow(1 - percentage, 3);
      setAngle(-90 + (target - (-90)) * easePercentage);
      
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
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Segments */}
        <path d="M 20 100 A 80 80 0 0 1 60 30 L 70 45 A 60 60 0 0 0 40 100 Z" fill="#60a5fa" />
        <path d="M 60 30 A 80 80 0 0 1 140 30 L 130 45 A 60 60 0 0 0 70 45 Z" fill="#34d399" />
        <path d="M 140 30 A 80 80 0 0 1 180 100 L 160 100 A 60 60 0 0 0 130 45 Z" fill="#fb923c" />
        
        {/* Ticks */}
        {[-90, -45, 0, 45, 90].map((t, i) => {
          const rad = (t - 90) * Math.PI / 180;
          return <line key={i} x1={100 + 80 * Math.cos(rad)} y1={100 + 80 * Math.sin(rad)} x2={100 + 90 * Math.cos(rad)} y2={100 + 90 * Math.sin(rad)} stroke="#fff" strokeWidth="2" opacity="0.5"/>
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

type ReportMetric = {
  title: string;
  value: string;
  unit: string;
  normalRange: string;
  extraInfo?: string;
  status: 'low' | 'normal' | 'high';
  percent: number;
  barType: 'standard' | 'low-is-good';
};

const BMICalculator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [reportMetrics, setReportMetrics] = useState<ReportMetric[] | null>(null);
  const [inputs, setInputs] = useState({
    name: '', age: '', gender: 'Male', phone: '', weight: '', height: ''
  });
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const w = parseFloat(inputs.weight);
    const h = parseFloat(inputs.height) / 100;
    const a = parseInt(inputs.age) || 30;

    if (w > 0 && h > 0) {
      await new Promise(r => setTimeout(r, 800));
      
      const bmi = (w / (h * h));
      const isMale = inputs.gender === 'Male';
      
      const IW = isMale ? (parseFloat(inputs.height) - 100) : (parseFloat(inputs.height) - 105);
      const wMin = IW * 0.9;
      const wMax = IW * 1.1;
      
      const bodyFat = isMale ? (1.2 * bmi + 0.23 * a - 16.2) : (1.2 * bmi + 0.23 * a - 5.4);
      const bfMin = isMale ? 8 : 20;
      const bfMax = isMale ? 19 : 30;
      
      const leanBodyMass = w - (w * bodyFat / 100);
      const muscleMass = leanBodyMass * 0.7;
      const mmMin = isMale ? 44.0 : 30.0;
      const mmMax = isMale ? 52.4 : 40.0;
      
      const skeletalMuscle = (muscleMass / w) * 100;
      const smMin = isMale ? 33.4 : 28.0;
      const smMax = isMale ? 39.3 : 34.0;
      
      const boneMass = w * 0.04;
      const bmMin = isMale ? 2.4 : 1.8;
      const bmMax = isMale ? 3.4 : 2.8;
      
      const hydration = (leanBodyMass * 0.73 * 100) / w;
      const hMin = 50;
      const hMax = 65;
      
      const visceral = Math.max(1, (bmi - 18) / 1.5);
      
      const protein = (leanBodyMass * 0.28 / w) * 100;
      
      const bmrVal = isMale ? 10 * w + 6.25 * h * 100 - 5 * a + 5 : 10 * w + 6.25 * h * 100 - 5 * a - 161;

      const getPercent = (val: number, min: number, max: number) => {
        if (val < min) {
          const ratio = Math.max(0, val / min);
          return 10 + ratio * 20;
        } else if (val <= max) {
          const ratio = (val - min) / (max - min);
          return 33.33 + ratio * 33.33;
        } else {
          const overflow = val - max;
          const ratio = Math.min(1, overflow / (max * 0.5));
          return 66.66 + ratio * 25; 
        }
      };
      
      const getPercentLG = (val: number, maxGood: number, maxWarn: number) => {
          if (val <= maxGood) return (val / maxGood) * 33.33;
          if (val <= maxWarn) return 33.33 + ((val - maxGood) / (maxWarn - maxGood)) * 33.33;
          return 66.66 + Math.min(1, (val - maxWarn) / 10) * 25;
      };
      
      const getStatus = (val: number, min: number, max: number) => {
          if (val < min) return 'low';
          if (val > max) return 'high';
          return 'normal';
      };
      
      const getStatusLG = (val: number, maxGood: number) => {
          if (val <= maxGood) return 'normal';
          if (val <= maxGood * 1.5) return 'low'; 
          return 'high';
      };

      const computedReports: ReportMetric[] = [
        {
            title: 'Weight', value: w.toFixed(0), unit: 'Kg', 
            normalRange: `${wMin.toFixed(0)} to ${wMax.toFixed(0)} Kg`,
            extraInfo: `Ideal weight : ${IW.toFixed(0)} Kg`,
            status: getStatus(w, wMin, wMax), percent: getPercent(w, wMin, wMax), barType: 'standard'
        },
        {
            title: 'BMI', value: bmi.toFixed(1), unit: '', 
            normalRange: `18.5 to 24.9`,
            status: getStatus(bmi, 18.5, 24.9), percent: getPercent(bmi, 18.5, 24.9), barType: 'standard'
        },
        {
            title: 'Fat', value: bodyFat.toFixed(1), unit: '%', 
            normalRange: `${bfMin} to ${bfMax} %`,
            status: getStatus(bodyFat, bfMin, bfMax), percent: getPercent(bodyFat, bfMin, bfMax), barType: 'standard'
        },
        {
            title: 'Muscle Mass', value: muscleMass.toFixed(1), unit: 'Kg', 
            normalRange: `${mmMin.toFixed(1)} to ${mmMax.toFixed(1)} Kg`,
            status: getStatus(muscleMass, mmMin, mmMax), percent: getPercent(muscleMass, mmMin, mmMax), barType: 'standard'
        },
        {
            title: 'Skeletal Muscle', value: skeletalMuscle.toFixed(1), unit: '%', 
            normalRange: `${smMin.toFixed(1)} to ${smMax.toFixed(1)} %`,
            status: getStatus(skeletalMuscle, smMin, smMax), percent: getPercent(skeletalMuscle, smMin, smMax), barType: 'standard'
        },
        {
            title: 'Bone Mass', value: boneMass.toFixed(1), unit: 'Kg', 
            normalRange: `${bmMin.toFixed(1)} to ${bmMax.toFixed(1)} Kg`,
            status: getStatus(boneMass, bmMin, bmMax), percent: getPercent(boneMass, bmMin, bmMax), barType: 'standard'
        },
        {
            title: 'Hydration', value: hydration.toFixed(1), unit: '%', 
            normalRange: `${hMin.toFixed(0)} to ${hMax.toFixed(0)} %`,
            status: getStatus(hydration, hMin, hMax), percent: getPercent(hydration, hMin, hMax), barType: 'standard'
        },
        {
            title: 'Visceral Fat', value: visceral.toFixed(0), unit: '', 
            normalRange: `1 to 10`,
            status: getStatusLG(visceral, 10), percent: getPercentLG(visceral, 10, 15), barType: 'low-is-good'
        },
        {
            title: 'Protein', value: protein.toFixed(1), unit: '%', 
            normalRange: `10 to 25 %`,
            status: getStatus(protein, 10, 25), percent: getPercent(protein, 10, 25), barType: 'standard'
        },
        {
            title: 'BMR', value: bmrVal.toFixed(0), unit: 'kcal', 
            normalRange: `1200 to 2500 kcal`,
            extraInfo: `Metabolic Age : ${a + (bmi > 25 ? 5 : 0)} yrs`,
            status: getStatus(bmrVal, 1200, 2500), percent: getPercent(bmrVal, 1200, 2500), barType: 'standard'
        }
      ];
      
      setReportMetrics(computedReports);

      const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
      const catColor = bmi < 18.5 ? 'text-blue-400' : bmi < 25 ? 'text-emerald-400' : bmi < 30 ? 'text-orange-400' : 'text-red-400';

      setMetrics({
        bmi: bmi.toFixed(1), bodyFat: bodyFat.toFixed(1), muscleMass: muscleMass.toFixed(1), category, catColor,
        hydration: '55.2', bmr: (isMale ? 10 * w + 6.25 * parseFloat(inputs.height) - 5 * a + 5 : 10 * w + 6.25 * parseFloat(inputs.height) - 5 * a - 161).toFixed(0), visceral: visceral.toFixed(1)
      });

      confetti({ particleCount: 50, spread: 60, colors: ['#10b981', '#3b82f6'] });
    }
    setLoading(false);
  };

  const downloadPDF = async (type: '10x' | 'smart') => {
    if (!reportRef.current || !metrics) return;
    
    // Temporarily show
    reportRef.current.style.left = '0';
    reportRef.current.style.zIndex = '50';
    try {
      // Allow DOM to update and render before capturing
      await new Promise(r => setTimeout(r, 150));
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SarojFit_${type}_Report_${inputs.name || 'Client'}.pdf`);
    } catch(err) {
      console.error(err);
    }
    // Hide again
    reportRef.current.style.left = '-9999px';
    reportRef.current.style.zIndex = '-1';
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
                   <div className="grid grid-cols-2 gap-4">
                     <input type="text" name="name" required placeholder="Name" className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500" onChange={handleChange} />
                     <input type="number" name="age" required placeholder="Age" className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500" onChange={handleChange} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <select name="gender" className="bg-[#1a1a2e] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500" onChange={handleChange}>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                     </select>
                     <input type="tel" name="phone" required placeholder="Phone" className="bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-1 focus:ring-purple-500" onChange={handleChange} />
                   </div>
                   <div className="flex gap-4">
                       <input type="number" name="weight" step="0.1" required placeholder="Weight (kg)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-purple-500" onChange={handleChange} />
                       <input type="number" name="height" required placeholder="Height (cm)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-purple-500" onChange={handleChange} />
                   </div>
                   <button type="submit" disabled={loading} className="w-full text-white bg-gradient-to-r from-purple-600 to-violet-600 font-bold py-4 rounded-xl transition-transform hover:scale-[1.02] mt-4 shadow-lg shadow-purple-500/25">
                       {loading ? 'Analyzing...' : 'Calculate Composition'}
                   </button>
               </form>
            </div>

            <div className="flex flex-col items-center glass-premium rounded-3xl p-8 border border-white/10 min-h-[400px]">
                <AnimatedGauge value={metrics?.bmi || null} />
                
                {metrics ? (
                    <div className="w-full animate-fade-in-up mt-6">
                        <div className="text-center mb-6">
                            <p className="text-gray-400 text-sm uppercase tracking-widest font-semibold mb-1">Your BMI</p>
                            <div className="flex items-end justify-center gap-2">
                              <span className="text-6xl font-black text-white tabular-nums">{metrics.bmi}</span>
                            </div>
                            <p className={`text-xl font-bold mt-2 ${metrics.catColor}`}>
                                {metrics.category}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="glass-card p-3 rounded-lg text-center">
                              <p className="text-xs text-gray-400">Body Fat</p>
                              <p className="text-white font-bold">{metrics.bodyFat}%</p>
                            </div>
                            <div className="glass-card p-3 rounded-lg text-center">
                              <p className="text-xs text-gray-400">Muscle Mass</p>
                              <p className="text-white font-bold">{metrics.muscleMass}kg</p>
                            </div>
                            <div className="glass-card p-3 rounded-lg text-center">
                              <p className="text-xs text-gray-400">Visceral Fat</p>
                              <p className="text-white font-bold">{metrics.visceral}</p>
                            </div>
                            <div className="glass-card p-3 rounded-lg text-center">
                              <p className="text-xs text-gray-400">BMR</p>
                              <p className="text-white font-bold">{metrics.bmr} kcal</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                           <button onClick={() => downloadPDF('10x')} className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-105 transition-transform text-sm font-semibold">
                              <BarChart3 className="w-5 h-5 mb-1" />
                              10xPro Report
                           </button>
                           <button onClick={() => downloadPDF('smart')} className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 text-white hover:scale-105 transition-transform text-sm font-semibold">
                              <FileText className="w-5 h-5 mb-1" />
                              Smart Report
                           </button>
                        </div>
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

      {/* Hidden PDF Template Container */}
      <div ref={reportRef} className="fixed top-0 bg-[#f8fafc] text-slate-800" style={{ width: '800px', left: '-9999px', zIndex: -1 }}>
        {reportMetrics && (
          <div className="w-full bg-[#f8fafc] font-sans min-h-[1131px] flex flex-col relative pb-16">
            
            {/* Header Box 1 */}
            <div className="bg-[#3b82f6] px-10 py-8 w-full flex justify-between items-end text-white">
                <div>
                    <h1 className="text-3xl font-bold tracking-wide mb-2 uppercase text-white">SAROJ FITNESS GUIDE</h1>
                    <p className="text-base text-blue-100">Body Composition Analysis Report</p>
                </div>
                <div className="text-right text-sm text-blue-100 space-y-2">
                    <p>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p>Gender: {inputs.gender}</p>
                </div>
            </div>

            {/* Header Box 2 */}
            <div className="bg-[#2563eb] px-10 py-4 w-full flex justify-between items-center text-white text-sm font-medium">
                <div className="lowercase font-bold min-w-[120px]">{inputs.name || 'client'}</div>
                <div>Age: {inputs.age || 30} yrs</div>
                <div>Height: {inputs.height} cm</div>
                <div>Weight: {inputs.weight} kg</div>
            </div>

            {/* Grid Array */}
            <div className="px-10 mt-12 grid grid-cols-2 gap-x-8 gap-y-8 relative z-10 mx-auto w-full flex-1">
               {reportMetrics.map((m, i) => {
                  let badgeColor = 'bg-[#4ade80]'; // Green default
                  if (m.status === 'low') badgeColor = 'bg-[#f97316]'; // Orange
                  if (m.status === 'high') badgeColor = 'bg-[#ef4444]'; // Red
                  
                  return (
                    <div key={i} className="bg-white rounded-[24px] border border-gray-200 p-6 flex flex-col items-center">
                      <h4 className="text-gray-900 font-bold mb-4 text-[17px]">{m.title}</h4>
                      <div className={`${badgeColor} text-white px-10 py-3 rounded-2xl font-bold text-3xl mb-4 text-center min-w-[200px]`}>
                         {m.value} {m.unit}
                      </div>
                      <p className="text-gray-500 text-[13px] mb-1 text-center">Normal : {m.normalRange}</p>
                      {m.extraInfo ? (
                         <p className="text-gray-500 text-[13px] text-center mb-2">{m.extraInfo}</p>
                      ) : <div className="h-[20px] mb-2"></div>}
        
                      {/* Gauge */}
                      <div className="w-[85%] relative h-[12px] mt-4 mb-3">
                         <div className="absolute inset-0 flex rounded-full overflow-hidden">
                            {m.barType === 'standard' ? (
                               <>
                                 <div className="h-full bg-[#f97316]" style={{width: '33.33%'}}></div>
                                 <div className="h-full bg-[#4ade80]" style={{width: '33.33%'}} ></div>
                                 <div className="h-full bg-[#ef4444]" style={{width: '33.33%'}}></div>
                               </>
                            ) : (
                               <>
                                 <div className="h-full bg-[#4ade80]" style={{width: '33.33%'}}></div>
                                 <div className="h-full bg-[#f97316]" style={{width: '33.33%'}}></div>
                                 <div className="h-full bg-[#ef4444]" style={{width: '33.33%'}}></div>
                               </>
                            )}
                         </div>
                         {/* Separators */}
                         <div className="absolute inset-0 flex">
                            <div className="h-full border-r-[4px] border-white" style={{width: '33.33%'}}></div>
                            <div className="h-full border-r-[4px] border-white" style={{width: '33.33%'}}></div>
                         </div>
                         {/* Indicator Dot */}
                         <div 
                            className="absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] bg-[#3b82f6] rounded-full border-[4px] border-white shadow-sm" 
                            style={{ left: `calc(${Math.min(Math.max(m.percent, 0), 100)}% - 11px)` }}>
                         </div>
                      </div>
                    </div>
                  )
               })}
            </div>

            {/* Footer Box */}
            <div className="bg-[#3b82f6] p-5 text-center text-blue-100 text-[13px] mt-auto w-full absolute bottom-0">
                Saroj Fitness Guide &nbsp;|&nbsp; Coach Saroj &nbsp;|&nbsp; +91 92172 25060 &nbsp;|&nbsp; sarojfitness@gmail.com
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BMICalculator;