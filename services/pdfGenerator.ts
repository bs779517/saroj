import { jsPDF } from 'jspdf';

export interface ClientProfile {
  name: string;
  age: string;
  gender: string;
  phone: string;
  weight: string;
  height: string;
}

export interface ReportMetric {
  title: string;
  value: string;
  unit: string;
  normalRange: string;
  extraInfo?: string;
  status: 'low' | 'normal' | 'high';
  percent: number;
  barType: 'standard' | 'low-is-good';
}

export interface WellnessSummary {
  bmi: string;
  category: string;
  bodyFat: string;
  muscleMass: string;
  visceral: string;
  bmr: string;
  hydration: string;
  idealWeight: string;
  weightMin: string;
  weightMax: string;
  metabolicAge: number;
  dailyCalories: number;
  dailyProteinGrams: number;
  dailyWaterLiters: string;
}

type RGB = [number, number, number];

const COLORS = {
  pageBg: [248, 250, 252] as RGB,      // #f8fafc
  white: [255, 255, 255] as RGB,       // #ffffff
  bluePrimary: [59, 130, 246] as RGB,  // #3b82f6
  blueDark: [37, 99, 235] as RGB,      // #2563eb
  blueLight: [219, 234, 254] as RGB,   // #dbeafe
  emeraldPrimary: [5, 150, 105] as RGB,// #059669
  emeraldDark: [4, 120, 87] as RGB,    // #047857
  emeraldLight: [209, 250, 229] as RGB,// #d1fae5
  slate900: [15, 23, 42] as RGB,       // #0f172a
  slate800: [30, 41, 59] as RGB,       // #1e293b
  slate600: [71, 85, 105] as RGB,      // #475569
  slate500: [100, 116, 139] as RGB,    // #64748b
  slate300: [203, 213, 225] as RGB,    // #cbd5e1
  slate200: [226, 232, 240] as RGB,    // #e2e8f0
  slate100: [241, 245, 249] as RGB,    // #f1f5f9
  green: [34, 197, 94] as RGB,         // #22c55e
  orange: [245, 158, 11] as RGB,       // #f59e0b
  orangeBadge: [249, 115, 22] as RGB,  // #f97316
  red: [220, 38, 38] as RGB,           // #dc2626
};

const sanitizeFileName = (raw: string): string => {
  const cleaned = (raw || 'Client')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'Client';
};

const formatReportDate = (): string => {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusColor = (status: 'low' | 'normal' | 'high'): RGB => {
  if (status === 'normal') return COLORS.green;
  if (status === 'low') return COLORS.orangeBadge;
  return COLORS.red;
};

/**
 * Draws a 3-segment rounded gauge bar with crisp white dividers and a circular indicator dot.
 * Uses pure RGB vector primitives—zero DOM or CSS color parsing.
 */
const drawSegmentedGauge = (
  pdf: jsPDF,
  barX: number,
  barY: number,
  barW: number,
  barH: number,
  percent: number,
  barType: 'standard' | 'low-is-good'
) => {
  const gap = 1.0;
  const segW = (barW - gap * 2) / 3;
  const r = barH / 2;

  const segColors: [RGB, RGB, RGB] =
    barType === 'standard'
      ? [COLORS.orange, COLORS.green, COLORS.red]
      : [COLORS.green, COLORS.orange, COLORS.red];

  // Segment 1 (rounded left, flat right)
  pdf.setFillColor(...segColors[0]);
  pdf.roundedRect(barX, barY, segW, barH, r, r, 'F');
  pdf.rect(barX + segW - r, barY, r, barH, 'F');

  // Segment 2 (flat middle)
  const seg2X = barX + segW + gap;
  pdf.setFillColor(...segColors[1]);
  pdf.rect(seg2X, barY, segW, barH, 'F');

  // Segment 3 (flat left, rounded right)
  const seg3X = seg2X + segW + gap;
  pdf.setFillColor(...segColors[2]);
  pdf.roundedRect(seg3X, barY, segW, barH, r, r, 'F');
  pdf.rect(seg3X, barY, r, barH, 'F');

  // Indicator dot with white halo ring
  const clamped = Math.min(Math.max(percent, 4), 96);
  const dotX = barX + (clamped / 100) * barW;
  const dotY = barY + barH / 2;

  pdf.setFillColor(...COLORS.white);
  pdf.setDrawColor(...COLORS.slate300);
  pdf.setLineWidth(0.25);
  pdf.circle(dotX, dotY, 2.9, 'FD');

  pdf.setFillColor(...COLORS.bluePrimary);
  pdf.circle(dotX, dotY, 1.85, 'F');
};

/**
 * Generates the 2-column, 10-card clinical Body Composition Analysis Report (10xPro Report)
 * matching the exact card layout, status pills, normal ranges, and 3-segment gauges.
 */
export const generate10xProReport = (client: ClientProfile, metrics: ReportMetric[]): void => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;

  // Full page background
  pdf.setFillColor(...COLORS.pageBg);
  pdf.rect(0, 0, pageW, pageH, 'F');

  // Top Header Banner (#3b82f6)
  pdf.setFillColor(...COLORS.bluePrimary);
  pdf.rect(0, 0, pageW, 24, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(...COLORS.white);
  pdf.text('SAROJ FITNESS GUIDE', 12, 11.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10.5);
  pdf.setTextColor(...COLORS.blueLight);
  pdf.text('Body Composition Analysis Report', 12, 18.5);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.text(formatReportDate(), pageW - 12, 11.2, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.text(`Gender: ${client.gender || 'Male'}`, pageW - 12, 18.2, { align: 'right' });

  // Client Details Strip (#2563eb)
  pdf.setFillColor(...COLORS.blueDark);
  pdf.rect(0, 24, pageW, 10, 'F');

  const displayName = (client.name || 'Client').trim().slice(0, 28);
  const displayAge = client.age || '30';
  const displayHeight = client.height || '--';
  const displayWeight = client.weight ? Number(client.weight).toFixed(2) : '--';

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(...COLORS.white);
  pdf.text(`Client: ${displayName}`, 12, 30.4);

  pdf.setFont('helvetica', 'normal');
  pdf.text(`Age: ${displayAge} yrs`, 86, 30.4);
  pdf.text(`Height: ${displayHeight} cm`, 132, 30.4);
  pdf.text(`Weight: ${displayWeight} kg`, pageW - 12, 30.4, { align: 'right' });

  // 2 Columns x 5 Rows of Clinical Metric Cards
  const marginX = 12;
  const gapX = 6;
  const cardW = (pageW - marginX * 2 - gapX) / 2; // 90mm
  const startY = 40;
  const cardH = 44;
  const gapY = 4.5;

  metrics.slice(0, 10).forEach((m, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = marginX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    const cx = x + cardW / 2;

    // Subtle elevation shadow
    pdf.setFillColor(...COLORS.slate200);
    pdf.roundedRect(x + 0.5, y + 0.6, cardW, cardH, 4.5, 4.5, 'F');

    // Card surface
    pdf.setFillColor(...COLORS.white);
    pdf.setDrawColor(...COLORS.slate200);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(x, y, cardW, cardH, 4.5, 4.5, 'FD');

    // Metric Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.slate800);
    pdf.text(m.title, cx, y + 7.5, { align: 'center' });

    // Status Value Pill Badge
    const pillW = 46;
    const pillH = 11;
    const pillX = cx - pillW / 2;
    const pillY = y + 10.2;
    const badgeRgb = getStatusColor(m.status);

    pdf.setFillColor(...badgeRgb);
    pdf.roundedRect(pillX, pillY, pillW, pillH, 3.5, 3.5, 'F');

    const valueLabel = m.unit ? `${m.value} ${m.unit}` : m.value;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12.5);
    pdf.setTextColor(...COLORS.white);
    pdf.text(valueLabel, cx, pillY + 7.4, { align: 'center' });

    // Normal Reference Range
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...COLORS.slate500);
    pdf.text(`Normal : ${m.normalRange}`, cx, y + 26.8, { align: 'center' });

    // 3-Segment Horizontal Gauge Bar
    const barW = 74;
    const barH = 3.2;
    const barX = cx - barW / 2;
    const barY = y + 30.8;
    drawSegmentedGauge(pdf, barX, barY, barW, barH, m.percent, m.barType);

    // Extra Info underneath bar (e.g. Ideal weight / Metabolic Age)
    if (m.extraInfo) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...COLORS.slate500);
      pdf.text(m.extraInfo, cx, y + 39.8, { align: 'center' });
    }
  });

  // Bottom Footer Banner (#3b82f6)
  pdf.setFillColor(...COLORS.bluePrimary);
  pdf.rect(0, 285, pageW, 12, 'F');

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(...COLORS.blueLight);
  pdf.text(
    'Saroj Fitness & Ayurveda Guide   |   Coach Saroj   |   +91 92172 25060   |   saroj.shila60@gmail.com',
    pageW / 2,
    292.2,
    { align: 'center' }
  );

  pdf.save(`${sanitizeFileName(client.name)}_BodyAnalysis.pdf`);
};

/**
 * Generates a concise 1-page Executive Wellness Summary (Smart Report) featuring BMI analysis,
 * current-vs-ideal weight delta, daily macro/water targets, and Ayurvedic supplement protocol.
 */
export const generateSmartReport = (
  client: ClientProfile,
  summary: WellnessSummary,
  metrics: ReportMetric[]
): void => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;

  // Background
  pdf.setFillColor(...COLORS.pageBg);
  pdf.rect(0, 0, pageW, pageH, 'F');

  // Emerald Executive Header
  pdf.setFillColor(...COLORS.emeraldPrimary);
  pdf.rect(0, 0, pageW, 24, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(17.5);
  pdf.setTextColor(...COLORS.white);
  pdf.text('SAROJ FITNESS & AYURVEDA GUIDE', 12, 11.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.emeraldLight);
  pdf.text('Smart Wellness Summary & Personalized Ayurvedic Action Plan', 12, 18.5);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.text(formatReportDate(), pageW - 12, 11.2, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.text(`Gender: ${client.gender || 'Male'}`, pageW - 12, 18.2, { align: 'right' });

  // Client Strip
  pdf.setFillColor(...COLORS.emeraldDark);
  pdf.rect(0, 24, pageW, 10, 'F');

  const displayName = (client.name || 'Client').trim().slice(0, 26);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(...COLORS.white);
  pdf.text(`Client: ${displayName}`, 12, 30.4);

  pdf.setFont('helvetica', 'normal');
  pdf.text(`Age: ${client.age || '30'} yrs`, 80, 30.4);
  pdf.text(`Height: ${client.height || '--'} cm`, 122, 30.4);
  pdf.text(
    `Phone: ${client.phone ? client.phone.slice(0, 15) : '+91 --'}`,
    pageW - 12,
    30.4,
    { align: 'right' }
  );

  // Row 1: Two Executive Highlight Cards (BMI Score vs Weight Target Delta)
  const cardY = 40;
  const halfW = 90;
  const heroH = 46;

  // Card A: BMI Status & Metabolic Age
  pdf.setFillColor(...COLORS.white);
  pdf.setDrawColor(...COLORS.slate200);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(12, cardY, halfW, heroH, 4, 4, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(...COLORS.slate500);
  pdf.text('BODY MASS INDEX (BMI)', 18, cardY + 8);

  pdf.setFontSize(24);
  pdf.setTextColor(...COLORS.slate900);
  pdf.text(summary.bmi, 18, cardY + 21);

  const bmiVal = parseFloat(summary.bmi);
  const bmiStatus: 'low' | 'normal' | 'high' =
    bmiVal < 18.5 ? 'low' : bmiVal <= 24.9 ? 'normal' : 'high';
  pdf.setFillColor(...getStatusColor(bmiStatus));
  pdf.roundedRect(52, cardY + 12.5, 42, 9.5, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.white);
  pdf.text(summary.category.toUpperCase(), 73, cardY + 18.8, { align: 'center' });

  const bmiPercent = Math.min(Math.max(((bmiVal - 15) / 20) * 100, 5), 95);
  drawSegmentedGauge(pdf, 18, cardY + 28, 78, 3.2, bmiPercent, 'standard');

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(...COLORS.slate600);
  pdf.text(
    `Healthy BMI: 18.5 - 24.9   |   Metabolic Age: ${summary.metabolicAge} yrs`,
    18,
    cardY + 39.5
  );

  // Card B: Current vs Ideal Weight Delta
  pdf.setFillColor(...COLORS.white);
  pdf.setDrawColor(...COLORS.slate200);
  pdf.roundedRect(108, cardY, halfW, heroH, 4, 4, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(...COLORS.slate500);
  pdf.text('WEIGHT & GOAL ALIGNMENT', 114, cardY + 8);

  const curW = parseFloat(client.weight) || 0;
  const idealW = parseFloat(summary.idealWeight) || curW;
  const diff = curW - idealW;
  const deltaText =
    Math.abs(diff) <= 2
      ? 'Within Optimal Ideal Weight Zone'
      : diff > 0
      ? `Recommended Fat Loss: -${diff.toFixed(1)} Kg`
      : `Recommended Lean Gain: +${Math.abs(diff).toFixed(1)} Kg`;

  pdf.setFontSize(13);
  pdf.setTextColor(...COLORS.slate900);
  pdf.text(`Current: ${curW.toFixed(1)} Kg`, 114, cardY + 18.5);
  pdf.setTextColor(...COLORS.emeraldPrimary);
  pdf.text(`Ideal: ${idealW.toFixed(1)} Kg`, 158, cardY + 18.5);

  pdf.setFillColor(...COLORS.slate100);
  pdf.roundedRect(114, cardY + 23.5, 78, 10, 2.5, 2.5, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...COLORS.slate800);
  pdf.text(deltaText, 153, cardY + 29.8, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(...COLORS.slate600);
  pdf.text(
    `Healthy Range: ${summary.weightMin} to ${summary.weightMax} Kg`,
    114,
    cardY + 39.5
  );

  // Row 2: 4 Daily Nutrition & Metabolic Target Cards
  const targetY = 92;
  const boxGap = 4;
  const boxW = (186 - boxGap * 3) / 4; // 43.5mm
  const boxH = 26;

  const dailyTargets = [
    { label: 'DAILY CALORIES', value: `${summary.dailyCalories} kcal`, sub: 'Goal-Adjusted Intake' },
    { label: 'RESTING BMR', value: `${summary.bmr} kcal`, sub: 'Baseline Burn' },
    { label: 'PROTEIN TARGET', value: `${summary.dailyProteinGrams} g/day`, sub: 'Lean Muscle Support' },
    { label: 'WATER INTAKE', value: `${summary.dailyWaterLiters} L/day`, sub: 'Hydration Goal' },
  ];

  dailyTargets.forEach((item, idx) => {
    const bx = 12 + idx * (boxW + boxGap);
    pdf.setFillColor(...COLORS.white);
    pdf.setDrawColor(...COLORS.slate200);
    pdf.roundedRect(bx, targetY, boxW, boxH, 3.5, 3.5, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.slate500);
    pdf.text(item.label, bx + boxW / 2, targetY + 7, { align: 'center' });

    pdf.setFontSize(13);
    pdf.setTextColor(...COLORS.emeraldDark);
    pdf.text(item.value, bx + boxW / 2, targetY + 15.8, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.slate500);
    pdf.text(item.sub, bx + boxW / 2, targetY + 22, { align: 'center' });
  });

  // Row 3: Compact Clinical Composition Snapshot Table
  const tableY = 124;
  pdf.setFillColor(...COLORS.white);
  pdf.setDrawColor(...COLORS.slate200);
  pdf.roundedRect(12, tableY, 186, 76, 4, 4, 'FD');

  pdf.setFillColor(...COLORS.slate100);
  pdf.roundedRect(12, tableY, 186, 10, 4, 4, 'F');
  pdf.rect(12, tableY + 6, 186, 4, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...COLORS.slate800);
  pdf.text('BIOMETRIC PARAMETER', 18, tableY + 6.6);
  pdf.text('MEASURED', 86, tableY + 6.6);
  pdf.text('NORMAL RANGE', 124, tableY + 6.6);
  pdf.text('STATUS', 180, tableY + 6.6, { align: 'center' });

  const tableRows = metrics.filter((m) =>
    ['Fat', 'Muscle Mass', 'Skeletal Muscle', 'Visceral Fat', 'Hydration', 'Bone Mass', 'Protein'].includes(
      m.title
    )
  );

  tableRows.slice(0, 7).forEach((row, idx) => {
    const ry = tableY + 16.5 + idx * 8.8;
    if (idx > 0) {
      pdf.setDrawColor(...COLORS.slate200);
      pdf.setLineWidth(0.2);
      pdf.line(16, ry - 5.5, 194, ry - 5.5);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.slate800);
    pdf.text(row.title, 18, ry);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...COLORS.slate900);
    pdf.text(row.unit ? `${row.value} ${row.unit}` : row.value, 86, ry);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...COLORS.slate600);
    pdf.text(row.normalRange, 124, ry);

    const pillRgb = getStatusColor(row.status);
    const statusLabel =
      row.status === 'normal' ? 'OPTIMAL' : row.status === 'low' ? 'LOW / WATCH' : 'HIGH FOCUS';
    pdf.setFillColor(...pillRgb);
    pdf.roundedRect(166, ry - 4.2, 28, 5.8, 2, 2, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...COLORS.white);
    pdf.text(statusLabel, 180, ry - 0.3, { align: 'center' });
  });

  // Row 4: Coach Saroj's Personalized Ayurvedic & Lifestyle Protocol
  const planY = 206;
  pdf.setFillColor(...COLORS.white);
  pdf.setDrawColor(...COLORS.slate200);
  pdf.roundedRect(12, planY, 186, 73, 4, 4, 'FD');

  pdf.setFillColor(...COLORS.emeraldPrimary);
  pdf.roundedRect(12, planY, 186, 10, 4, 4, 'F');
  pdf.rect(12, planY + 6, 186, 4, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.5);
  pdf.setTextColor(...COLORS.white);
  pdf.text("COACH SAROJ'S PERSONALIZED AYURVEDIC & SUPPLEMENT PROTOCOL", 18, planY + 6.6);

  const recommendations: string[] =
    bmiVal >= 25
      ? [
          '1. Morning Metabolism Ritual: Start your day with warm Jeera-Ajwain lemon water before breakfast.',
          `2. Calorie & Protein Discipline: Aim for ~${summary.dailyCalories} kcal/day with ${summary.dailyProteinGrams}g protein (moong dal, paneer, sprouts, tofu/lean protein).`,
          '3. Smart Dinner Habit: Finish light dinner 2.5 hours before sleep or replace with Vestige Veslim Shake.',
          '4. Movement Prescription: 35-45 mins brisk walk + 12 rounds Surya Namaskar & Kapalbhati Pranayama.',
          '5. Recommended Supplements: Vestige Veslim Shake, Flax Oil (Omega-3 for visceral fat) & Spirulina.',
        ]
      : bmiVal < 18.5
      ? [
          '1. Morning Nourishment: Begin with lukewarm water + 6 soaked almonds, 2 walnuts & 2 dates.',
          `2. Nutrient-Dense Surplus: Target ~${summary.dailyCalories} kcal/day and ${summary.dailyProteinGrams}g protein across 5 balanced meals.`,
          '3. Digestive Agni Support: Add 1 tsp cow ghee to lunch dal/roti and drink spiced buttermilk post-lunch.',
          '4. Strength & Yoga Routine: 30 mins progressive bodyweight/resistance work + Bhujangasana & Vajrasana.',
          '5. Recommended Supplements: Vestige Spirulina, Noni Capsules (nutrient absorption) & Calcium.',
        ]
      : [
          '1. Daily Dosha Balance: Start mornings with warm Tulsi-Ginger water and 5 soaked almonds.',
          `2. Balanced Maintenance: Sustain ~${summary.dailyCalories} kcal/day, ${summary.dailyProteinGrams}g protein, and ${summary.dailyWaterLiters}L water daily.`,
          '3. Mindful Meal Timing: Keep lunch your main meal (1-2 PM) and dinner light before 8:00 PM.',
          '4. Holistic Fitness: 40 mins daily mix of Yoga flow, core mobility, strength training & Anulom Vilom.',
          '5. Recommended Supplements: Vestige Spirulina, Flax Oil Omega-3 & Noni Capsules for cellular vitality.',
        ];

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.8);
  pdf.setTextColor(...COLORS.slate800);

  let cursorY = planY + 17.5;
  recommendations.forEach((line) => {
    const wrapped = pdf.splitTextToSize(line, 174) as string[];
    pdf.text(wrapped, 18, cursorY);
    cursorY += wrapped.length * 4.8 + 4.2;
  });

  // Footer
  pdf.setFillColor(...COLORS.emeraldPrimary);
  pdf.rect(0, 285, pageW, 12, 'F');

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(...COLORS.emeraldLight);
  pdf.text(
    'Consultation & Custom Diet Plans on WhatsApp: +91 92172 25060   |   Coach Saroj   |   Saroj Fitness & Ayurveda Guide',
    pageW / 2,
    292.2,
    { align: 'center' }
  );

  pdf.save(`${sanitizeFileName(client.name)}_SmartReport.pdf`);
};
