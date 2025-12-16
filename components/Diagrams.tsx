
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowDown } from 'lucide-react';
import { Latex } from './Math';

// --- HELPER: VIRIDIS COLORMAP ---
const getViridisColor = (t: number) => {
    // t: 0 (Purple/Aggressive/-2.5) -> 1 (Yellow/Conservative/-0.35)
    // Viridis approx
    const c1 = [68, 1, 84];    // Purple
    const c2 = [33, 145, 140]; // Teal
    const c3 = [253, 231, 37]; // Yellow
    
    let r, g, b;
    if (t < 0.5) {
        const n = t * 2;
        r = c1[0] + (c2[0] - c1[0]) * n;
        g = c1[1] + (c2[1] - c1[1]) * n;
        b = c1[2] + (c2[2] - c1[2]) * n;
    } else {
        const n = (t - 0.5) * 2;
        r = c2[0] + (c3[0] - c2[0]) * n;
        g = c2[1] + (c3[1] - c2[1]) * n;
        b = c2[2] + (c3[2] - c2[2]) * n;
    }
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

// --- STOMA THUMB COMPONENT ---
const StomaThumb = ({ t, color }: { t: number, color: string }) => {
    // t: 0 (Aggressive, Left) -> 1 (Conservative, Right)
    // Aperture: t=0 -> Open (Large Gap), t=1 -> Closed (Small Gap/Line)
    // We visually simulate guard cells closing.
    
    const aperture = Math.max(0.1, 1 - (t * 0.95)); // 1.0 down to 0.05
    const w = 3 + (aperture * 5); // Half-width of the inner gap control point

    return (
        <svg width="40" height="40" viewBox="0 0 32 32" className="overflow-visible filter drop-shadow-lg transition-transform duration-75 hover:scale-110">
             {/* Left Guard Cell */}
             <path 
                d={`M 16 4 C 9 4 5 10 5 16 C 5 22 9 28 16 28 C 14 28 ${16-w} 22 ${16-w} 16 C ${16-w} 10 14 4 16 4 Z`}
                fill={color} stroke="white" strokeWidth="1.5"
             />
             {/* Right Guard Cell */}
             <path 
                d={`M 16 4 C 23 4 27 10 27 16 C 27 22 23 28 16 28 C 18 28 ${16+w} 22 ${16+w} 16 C ${16+w} 10 18 4 16 4 Z`}
                fill={color} stroke="white" strokeWidth="1.5"
             />
        </svg>
    );
};

// --- DERIVATION BOARD ---
export const DerivationBoard: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-stone-200 overflow-hidden relative font-serif">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-earth-olive via-nobel-gold to-earth-sand"></div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
            <BookOpen size={24} />
        </div>
        <div>
            <h3 className="font-serif text-2xl text-stone-900">Mathematical Framework</h3>
            <p className="text-xs text-stone-500 font-sans tracking-wider uppercase">Dimensional Analysis & Optimality (Figure 1)</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Constitutive Laws */}
        <div className="space-y-4">
           <div className="border-l-2 border-earth-olive pl-4 h-full">
               <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-500 mb-2">1. Eco-physiological Model</h4>
               <p className="text-sm text-stone-600 mb-4 font-light leading-snug">
                   Defining conductance responses to water potential (<Latex>{"\\psi"}</Latex>).
               </p>
               <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 space-y-4 shadow-sm">
                  <div className="border-b border-stone-200 pb-2">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Xylem Vulnerability</p>
                    <Latex className="text-sm text-stone-800">{`K_p(\\psi_L) \\propto (1 - \\frac{\\psi_L}{2\\psi_{x,50}})`}</Latex>
                  </div>
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Stomatal Closure</p>
                    <Latex className="text-sm text-stone-800">{`g_c(\\psi_L) \\propto (1 - \\frac{\\psi_L}{2\\psi_{g,50}})`}</Latex>
                  </div>
               </div>
           </div>
        </div>

        {/* Column 2: Buckingham Pi Groups */}
        <div className="space-y-4">
            <div className="border-l-2 border-nobel-gold pl-4 h-full">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-500 mb-2">2. Buckingham <Latex>{"\\Pi"}</Latex> Theorem</h4>
                <p className="text-sm text-stone-600 mb-4 font-light leading-snug">
                   Reducing complexity into four non-dimensional groups describing trade-offs.
                </p>
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 space-y-3 shadow-sm">
                     <div className="grid grid-cols-1 gap-2">
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-700 shadow-sm"><Latex>{"\\Pi_R"}</Latex></div>
                             <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Hydraulic Risk Tolerance</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-700 shadow-sm"><Latex>{"\\Pi_F"}</Latex></div>
                             <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Plant Water Flux Control</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-700 shadow-sm"><Latex>{"\\Pi_T"}</Latex></div>
                             <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Soil-Root Transport</span>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-sm font-bold text-stone-700 shadow-sm"><Latex>{"\\Pi_S"}</Latex></div>
                             <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">Soil Suitability</span>
                         </div>
                     </div>
                </div>
            </div>
        </div>

        {/* Column 3: The Function */}
        <div className="space-y-4">
            <div className="border-l-2 border-earth-clay pl-4 h-full">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-500 mb-2">3. Ecohydrological Strategy</h4>
                <p className="text-sm text-stone-600 mb-4 font-light leading-snug">
                    Expressing transpiration (<Latex>{"T/E_0"}</Latex>) as a function of soil moisture (<Latex>{"s"}</Latex>) and traits (<Latex>{"\\Pi"}</Latex>).
                </p>
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 space-y-4 shadow-sm h-full flex flex-col justify-center items-center">
                    <div className="text-center p-3 bg-white rounded border border-stone-200 shadow-sm w-full">
                        <Latex className="text-lg">{`\\frac{T}{E_0} = f(s, \\Pi_R, \\Pi_F, \\Pi_T, \\Pi_S)`}</Latex>
                    </div>
                    <div className="text-center">
                        <ArrowDown className="mx-auto text-stone-400 mb-2" size={16} />
                        <Latex className="text-sm text-stone-600">{`\\approx \\beta(s, f_{ww}(\\Pi), s^*(\\Pi), s_w(\\Pi))`}</Latex>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

// --- SPAC CONCEPTUAL DIAGRAM ---
export const SPACDiagram: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 min-h-[400px] md:min-h-[500px] flex flex-col relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
        {/* Background gradient for atmosphere to soil */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-stone-100/80 pointer-events-none" />

        <div className="relative z-10 text-center mb-2">
             <div className="w-12 h-12 bg-earth-olive text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Latex>{"\\Psi"}</Latex>
             </div>
             <h3 className="font-serif text-xl text-stone-800">Continuum Model</h3>
             <p className="text-xs text-stone-500 uppercase tracking-widest">Potential-driven transport</p>
        </div>

        <div className="flex-1 relative z-10 flex items-center justify-center p-4">
            <svg viewBox="0 0 300 420" className="w-full h-full max-w-sm overflow-visible font-sans">
                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L6,3 z" fill="#4682B4" />
                    </marker>
                    <linearGradient id="stemGradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#5D4037" />
                        <stop offset="50%" stopColor="#8D6E63" />
                        <stop offset="100%" stopColor="#5D4037" />
                    </linearGradient>
                    <style>
                        {`
                            @keyframes flowUp {
                                to { stroke-dashoffset: -20; }
                            }
                        `}
                    </style>
                </defs>

                {/* --- ATMOSPHERE (Top) --- */}
                <g transform="translate(150, 40)">
                    <text x="0" y="-20" textAnchor="middle" className="text-[10px] font-bold fill-sky-500 tracking-[0.2em] uppercase">Atmosphere</text>
                    <rect x="-60" y="-12" width="120" height="24" rx="12" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />
                    <foreignObject x="-60" y="-12" width="120" height="24">
                        <div className="flex items-center justify-center w-full h-full">
                            <span className="text-[10px] text-sky-700 font-mono"><Latex>{"\\psi_{atm} \\ll -100"}</Latex></span>
                        </div>
                    </foreignObject>
                </g>

                {/* Flux Arrow Left */}
                <path 
                    d="M 80 360 L 80 60" 
                    stroke="#4682B4" 
                    strokeWidth="1.5" 
                    strokeDasharray="4,4" 
                    markerEnd="url(#arrow)" 
                    opacity="0.6" 
                    style={{ animation: 'flowUp 1s linear infinite' }}
                />
                <text x="75" y="210" textAnchor="end" className="text-[10px] fill-sky-600 italic font-serif" transform="rotate(-90, 75, 210)">Transpiration Flux (T)</text>

                {/* --- PLANT STRUCTURE --- */}
                
                {/* Stem */}
                <rect x="146" y="100" width="8" height="210" rx="2" fill="url(#stemGradient)" />

                {/* Water Flow Animation (Droplets) */}
                 <g transform="translate(150, 310)">
                    {[0, 1, 2, 3, 4].map(i => (
                         <circle key={i} r="1.5" fill="#BAE6FD" opacity="0.8">
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                from="0 0"
                                to="0 -210"
                                dur="2.5s"
                                begin={`${i * 0.5}s`}
                                repeatCount="indefinite"
                            />
                            <animate
                                attributeName="opacity"
                                values="0;0.8;0.8;0"
                                keyTimes="0;0.1;0.9;1"
                                dur="2.5s"
                                begin={`${i * 0.5}s`}
                                repeatCount="indefinite"
                            />
                         </circle>
                    ))}
                 </g>

                {/* Connection lines */}
                <line 
                    x1="150" y1="100" x2="150" y2="60" 
                    stroke="#8D6E63" 
                    strokeWidth="2" 
                    strokeDasharray="2,2" 
                    style={{ animation: 'flowUp 0.5s linear infinite' }}
                />

                {/* Leaf Node */}
                <g transform="translate(150, 100)">
                    <ellipse cx="0" cy="0" rx="25" ry="12" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
                    <text x="35" y="4" className="text-xs font-bold fill-stone-700 font-serif">Leaf</text>
                     <foreignObject x="-15" y="-8" width="30" height="16">
                         <div className="flex items-center justify-center w-full h-full">
                             <span className="text-[9px] text-white font-mono drop-shadow-sm"><Latex>{"\\psi_L"}</Latex></span>
                         </div>
                    </foreignObject>
                    
                    {/* Stomata Resistance Indication */}
                    <g transform="translate(0, -25)">
                        <rect x="-6" y="-6" width="12" height="12" fill="white" stroke="#4D7C0F" strokeWidth="1" rx="2" />
                        <foreignObject x="-6" y="-6" width="12" height="12">
                             <div className="flex items-center justify-center w-full h-full text-[8px] text-stone-600 font-bold">g</div>
                        </foreignObject>
                    </g>
                </g>

                {/* Xylem Node */}
                <g transform="translate(150, 205)">
                     <circle r="6" fill="#A1887F" stroke="white" strokeWidth="1.5" />
                     <text x="20" y="4" className="text-xs fill-stone-400 italic">Xylem</text>
                </g>

                {/* Root Node */}
                <g transform="translate(150, 310)">
                    {/* Roots Art */}
                    <path d="M 0 0 C -10 20 -30 30 -50 50" stroke="#5D4037" strokeWidth="2" fill="none" />
                    <path d="M 0 0 C 10 20 30 30 50 50" stroke="#5D4037" strokeWidth="2" fill="none" />
                    <path d="M 0 0 L 0 40" stroke="#5D4037" strokeWidth="2" fill="none" />
                    
                    <circle r="18" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
                    <text x="35" y="4" className="text-xs font-bold fill-stone-700 font-serif">Root</text>
                    <foreignObject x="-20" y="-10" width="40" height="20">
                         <div className="flex items-center justify-center w-full h-full">
                             <span className="text-[9px] text-white font-mono drop-shadow-sm"><Latex>{"\\psi_{root}"}</Latex></span>
                         </div>
                    </foreignObject>
                </g>

                {/* --- SOIL (Bottom) --- */}
                <g transform="translate(150, 380)">
                    <path d="M -100 0 Q 0 10 100 0 L 100 30 L -100 30 Z" fill="#D7CCC8" stroke="#8D6E63" strokeWidth="1" />
                    <text x="0" y="20" textAnchor="middle" className="text-[10px] font-bold fill-stone-600 tracking-[0.2em] uppercase">Soil Reservoir</text>
                     <foreignObject x="-60" y="-25" width="120" height="20">
                         <div className="flex items-center justify-center w-full h-full text-center">
                             <span className="text-[10px] text-stone-600 font-mono bg-white/50 px-2 rounded-full"><Latex>{"\\psi_s > -3"}</Latex></span>
                         </div>
                    </foreignObject>
                </g>
            </svg>
        </div>
        
        <div className="bg-stone-50 p-3 text-[10px] text-stone-500 text-center border-t border-stone-100">
            Water moves from high potential (Soil) to low potential (Atmosphere) through hydraulic resistances.
        </div>
    </div>
  );
};

// --- PHYSICS ENGINE & DATA GENERATION ---
const PHYSICS = {
  n: 0.451,      // Porosity (Loam)
  Zr: 500,      // Root depth (mm)
  Emax: 5.0,    // Max Transpiration (mm/d)
  Ew: 0.2,      // Bare Soil Evaporation (mm/d)
  Ksat: 500,    // Saturated conductivity (mm/d) - tuned for visual scaling
  c: 13,        // Leakage exponent (b ~ 5)
  lambda: 0.15, // Rainfall frequency (1/d)
  alpha: 15,    // Mean rainfall depth (mm)
};

// Safe number check
const safe = (n: number, fallback: number = 0) => (isNaN(n) || !isFinite(n) ? fallback : n);

// Generate a single strategy's data based on psi_g50
const calculateStrategy = (psi_g50: number, t: number) => {
    // t: 0 (Purple/Aggressive/-2.5) -> 1 (Yellow/Conservative/-0.35)
    
    // 1. Map Traits to Model Parameters (Matching Figure 2a)
    // s_w: Purple starts early (0.15), Yellow starts later (0.4)
    const s_w = 0.15 + (t * 0.25);
    
    // s_star: The width of the regulation ramp
    const ramp = 0.25;
    const s_star = s_w + ramp;

    // Max Beta (Plateau): Yellow plateaus lower (~0.6) than Purple (1.0)
    const max_beta = 1.0 - (t * 0.4);

    // 2. Physics Simulation
    const { n, Zr, Emax, Ew, Ksat, c, lambda, alpha } = PHYSICS;
    const nZr = n * Zr;
    const gamma = nZr / alpha;
    
    let integralTerm = 0;
    const ds = 0.01; // Step size
    
    const results = [];
    
    // First pass: Calculate betas and log probabilities
    for (let s = 0.01; s <= 1.0; s += ds) {
        // --- Beta Calculation ---
        let b = 0;
        if (s <= s_w) b = 0;
        else if (s > s_w && s <= s_star) b = (s - s_w) / (s_star - s_w);
        else b = 1;
        
        const beta = b * max_beta;

        // --- PDF Calculation (Log Space for Stability) ---
        // Loss function
        const loss = (Emax * beta) + Ew + (Ksat * Math.pow(s, c));
        // Normalized loss
        const rho = Math.max(1e-6, loss / nZr); 
        
        integralTerm += (1 / rho) * ds;
        
        // log(p) = -ln(rho) - gamma*s + lambda*integral
        const log_p = -Math.log(rho) - (gamma * s) + (lambda * integralTerm);
        
        results.push({ s, beta, log_p });
    }

    // Normalize PDF from log space
    const max_log_p = Math.max(...results.map(r => r.log_p));
    // Calculate unnormalized probabilities safely
    const unnorm = results.map(r => ({ ...r, p: Math.exp(r.log_p - max_log_p) }));
    // Integrate area
    const area = unnorm.reduce((acc, curr) => acc + curr.p, 0) * ds;
    
    const safeArea = area > 0 ? area : 1.0;
    
    const finalPoints = unnorm.map(r => ({
        s: r.s,
        beta: r.beta,
        prob: r.p / safeArea
    }));
    
    // 3. Metrics Calculation (Stylized)
    const Pi_R = 0.1 + (t * 0.9);
    const Pi_F = 1.6 - (t * 1.3);
    const Pi_T = 0.5 + (t * 2.5);
    const Pi_S = 50 + (t * 200);

    const sigma = 0.6 * (1 - Math.exp(-3 * t)); 
    const epsilon = 0.4 + 0.2 * Math.exp(-15 * Math.pow(t - 0.35, 2));

    return {
        t,
        psi_g50,
        s_w,
        s_star,
        max_beta,
        points: finalPoints,
        sigma,
        epsilon,
        Pi: { Pi_R, Pi_F, Pi_T, Pi_S }
    };
};

// --- SUB-COMPONENT: SCATTER PLOT ---
const ScatterPlot = ({ 
    data, 
    activeData, 
    yKey, 
    yLabel, 
    yDomain,
    label 
}: { 
    data: any[], 
    activeData: any, 
    yKey: string, 
    yLabel: string, 
    yDomain: [number, number],
    label: string
}) => {
    return (
        <div className="relative h-40 bg-[#1a1a1a] border border-stone-700 rounded-lg p-2 overflow-hidden group">
            <div className="absolute top-1 left-2 text-[9px] text-stone-400 font-bold uppercase tracking-wider">{label}</div>
            
            {/* Y Axis Label */}
            <div className="absolute top-1/2 left-1 transform -translate-y-1/2 -rotate-90 text-[10px] text-stone-500 font-serif">
                <Latex>{yLabel}</Latex>
            </div>
            
             {/* X Axis Label */}
             <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[9px] text-stone-500 font-serif">
                <Latex>{'\\psi_{g,50}'}</Latex>
            </div>

            <div className="absolute top-4 right-2 bottom-6 left-8 border-l border-b border-stone-600">
                {/* Scatter Points */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {data.map((pt, i) => {
                         const xNorm = (pt.psi_g50 - (-2.5)) / (-0.35 - (-2.5)); 
                         const yNorm = safe((pt[yKey] - yDomain[0]) / (yDomain[1] - yDomain[0]));
                         const isActive = pt === activeData;

                         return (
                            <circle 
                                key={i}
                                cx={xNorm * 100}
                                cy={100 - (yNorm * 100)}
                                r={isActive ? 4 : 2}
                                fill={getViridisColor(pt.t)}
                                stroke={isActive ? "white" : "none"}
                                strokeWidth={1.5}
                                className="transition-all duration-300"
                            />
                         )
                    })}
                </svg>
            </div>
        </div>
    )
}

// --- SUB-COMPONENT: PI GROUP STRIP ---
const PiGroupStrip = ({ data, activeData }: { data: any[], activeData: any }) => {
    const metrics = [
        { key: 'Pi_R', label: '\\Pi_R', domain: [0, 1] },
        { key: 'Pi_F', label: '\\Pi_F', domain: [0, 2] },
        { key: 'Pi_T', label: '\\Pi_T', domain: [0, 3.5] },
        { key: 'Pi_S', label: '\\Pi_S', domain: [0, 300] }
    ];

    return (
        <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:h-full">
            {metrics.map((m) => (
                <div key={m.key} className="relative h-28 lg:h-auto lg:flex-1 bg-[#1a1a1a] border border-stone-700 rounded-lg overflow-hidden">
                    <div className="absolute top-1 left-1 text-[9px] text-stone-500 font-serif z-10">
                        <Latex>{m.label}</Latex>
                    </div>
                    <div className="absolute top-2 right-2 bottom-2 left-6 border-l border-b border-stone-600/50">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                             {/* Line */}
                             <polyline 
                                points={data.map(pt => {
                                    const x = ((pt.psi_g50 - (-2.5)) / 2.15) * 100; 
                                    const val = pt.Pi[m.key];
                                    const y = 100 - ((val - m.domain[0]) / (m.domain[1] - m.domain[0])) * 100;
                                    return `${safe(x)},${safe(y)}`;
                                }).join(' ')}
                                fill="none"
                                stroke="#555"
                                strokeWidth="1.5"
                            />
                            {/* Active Dot */}
                            {(() => {
                                const pt = activeData;
                                const x = ((pt.psi_g50 - (-2.5)) / 2.15) * 100;
                                const val = pt.Pi[m.key];
                                const y = 100 - ((val - m.domain[0]) / (m.domain[1] - m.domain[0])) * 100;
                                return (
                                    <circle cx={safe(x)} cy={safe(y)} r="3" fill={getViridisColor(pt.t)} stroke="white" strokeWidth="1" />
                                );
                            })()}
                        </svg>
                    </div>
                </div>
            ))}
            <div className="col-span-2 lg:col-span-1 text-center text-[9px] text-stone-500 font-serif mt-[-4px]">
                <Latex>{'\\psi_{g,50}'}</Latex> (e)
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---
export const StrategyExplorer: React.FC = () => {
    const [sliderVal, setSliderVal] = useState(0.35);

    // 1. Generate Full Dataset (Family of Curves)
    const dataset = useMemo(() => {
        const data = [];
        const steps = 40; 
        for(let i=0; i<=steps; i++) {
            const t = i/steps; 
            const psi = -2.5 + t * (2.15);
            data.push(calculateStrategy(psi, t));
        }
        return data;
    }, []);

    // 2. Get Active Data
    const activeData = useMemo(() => {
        return dataset.reduce((prev, curr) => 
            Math.abs(curr.t - sliderVal) < Math.abs(prev.t - sliderVal) ? curr : prev
        );
    }, [sliderVal, dataset]);

    // Determine Y Max for PDF scaling dynamically for robustness
    const pdfMax = useMemo(() => {
        let m = 0;
        dataset.forEach(d => d.points.forEach(p => m = Math.max(m, p.prob)));
        return Math.ceil(m);
    }, [dataset]);

    return (
        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-4 md:p-8 shadow-2xl max-w-7xl mx-auto text-stone-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-stone-800">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-white font-serif text-3xl mb-2">Eco-Evolutionary Strategy Space</h3>
                    <p className="text-stone-400 text-sm max-w-xl">
                        Interactive replication of Figure 2. Adjust the stomatal sensitivity (<Latex>{'\\psi_{g,50}'}</Latex>) to see how hydraulic traits shift the ecosystem equilibrium.
                    </p>
                </div>
                
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                     <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Stomatal Sensitivity Control</div>
                     
                     <div className="relative w-full md:w-64 h-10 flex items-center select-none group">
                        {/* Track */}
                        <div className="absolute left-0 right-0 h-1.5 rounded-full" style={{ background: `linear-gradient(to right, #440154, #21918c, #fde725)` }}></div>
                        
                        {/* Input (Interactive Layer) */}
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={sliderVal} 
                            onChange={(e) => setSliderVal(parseFloat(e.target.value))}
                            className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                        />

                        {/* Custom Thumb */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-10 transition-all duration-75"
                            style={{ left: `${sliderVal * 100}%` }}
                        >
                            <StomaThumb t={sliderVal} color={getViridisColor(sliderVal)} />
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between w-full md:w-64 text-xs font-mono mt-1">
                         <span className="text-purple-400">-2.5</span>
                         <div className="font-bold text-lg" style={{ color: getViridisColor(sliderVal) }}>
                            <Latex>{`\\psi_{g,50} = ${activeData.psi_g50.toFixed(2)}`}</Latex>
                         </div>
                         <span className="text-yellow-300">-0.35</span>
                     </div>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 gap-4 lg:gap-6 lg:h-[700px]">
                
                {/* Column 1: Wide plots (a) & (c) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 h-[600px] lg:h-full">
                    
                    {/* (a) Regulation */}
                    <div className="flex-1 bg-[#1a1a1a] border border-stone-700 rounded-xl relative p-4 overflow-hidden group/plot">
                        <div className="absolute top-3 left-4 text-xs text-stone-400 font-bold uppercase tracking-wider">(a) Regulation</div>
                        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 -rotate-90 text-[10px] text-stone-500 font-serif">
                            <Latex>{'\\beta(s)'}</Latex>
                        </div>
                         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-stone-500 font-serif">
                            <Latex>{'s'}</Latex> (Soil Moisture)
                        </div>
                        
                        <div className="absolute top-12 right-12 bottom-16 left-16 border-l border-b border-stone-600/50">
                            {/* Axis Ticks X */}
                            {[0.2, 0.4, 0.6, 0.8].map(v => (
                                <div key={v} className="absolute bottom-0 translate-y-full pt-1 flex flex-col items-center" style={{ left: `${v * 100}%` }}>
                                    <div className="w-px h-1 bg-stone-500 mb-1"></div>
                                    <span className="text-[10px] text-stone-500 font-mono -ml-px">{v.toFixed(1)}</span>
                                </div>
                            ))}

                            {/* Axis Ticks Y */}
                            {[0, 0.5, 1.0].map(v => (
                                <div key={v} className="absolute left-0 -translate-x-full pr-1 flex items-center justify-end w-8" style={{ bottom: `${v * 100}%` }}>
                                    <span className="text-[10px] text-stone-500 font-mono mr-1">{v.toFixed(1)}</span>
                                    <div className="w-1 h-px bg-stone-500"></div>
                                </div>
                            ))}

                            {/* Grid Lines */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[0.5, 1.0].map(v => (
                                     <div key={v} className="absolute left-0 right-0 border-t border-stone-600/20" style={{ bottom: `${v*100}%` }} />
                                ))}
                                {[0.2, 0.4, 0.6, 0.8].map(p => (
                                    <div key={p} className="absolute top-0 bottom-0 border-l border-stone-600/20" style={{ left: `${p*100}%` }} />
                                ))}
                            </div>
                            
                            {/* SVG Content */}
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                
                                {/* Family of Curves (Background) */}
                                {dataset.map((d, i) => i % 2 === 0 && (
                                    <path 
                                        key={i}
                                        d={`M ${d.points.map(pt => `${pt.s * 100} ${100 - (pt.beta * 100)}`).join(' L ')}`}
                                        fill="none"
                                        stroke={getViridisColor(d.t)}
                                        strokeWidth="0.8"
                                        strokeOpacity="0.3"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                ))}

                                {/* Active Curve Stroke (Highlight) */}
                                 <path 
                                    d={`M ${activeData.points.map(pt => `${pt.s * 100} ${100 - (pt.beta * 100)}`).join(' L ')}`}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                />
                                
                                {/* Active Curve (Colored Overlay) */}
                                <path 
                                    d={`M ${activeData.points.map(pt => `${pt.s * 100} ${100 - (pt.beta * 100)}`).join(' L ')}`}
                                    fill="none"
                                    stroke={getViridisColor(activeData.t)}
                                    strokeWidth="1.2"
                                    vectorEffect="non-scaling-stroke"
                                />

                                {/* Markers */}
                                <g>
                                    {/* s_w line */}
                                    <line 
                                        x1={activeData.s_w * 100} y1="100" 
                                        x2={activeData.s_w * 100} y2="20" 
                                        stroke="white" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" vectorEffect="non-scaling-stroke"
                                    />
                                     <text x={activeData.s_w * 100} y="108" fill="white" fontSize="4" textAnchor="middle" className="font-mono">
                                        s_w
                                    </text>
                                    
                                     {/* s_star line */}
                                     <line 
                                        x1={activeData.s_star * 100} y1="100" 
                                        x2={activeData.s_star * 100} y2="5" 
                                        stroke="white" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" vectorEffect="non-scaling-stroke"
                                    />
                                    <text x={activeData.s_star * 100} y="108" fill="white" fontSize="4" textAnchor="middle" className="font-mono">
                                        s*
                                    </text>

                                    {/* Annotations */}
                                    <text x={activeData.s_w * 50} y="95" textAnchor="middle" fontSize="4" fill="#78716c" className="italic font-serif">Stressed</text>
                                    <text x={(activeData.s_w + activeData.s_star) / 2 * 100} y="85" textAnchor="middle" fontSize="4" fill="#78716c" className="italic font-serif">Regulated</text>
                                    <text x={(1 + activeData.s_star) / 2 * 100} y="15" textAnchor="middle" fontSize="4" fill="#78716c" className="italic font-serif">Unstressed</text>
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* (c) PDF */}
                    <div className="flex-1 bg-[#1a1a1a] border border-stone-700 rounded-xl relative p-4 overflow-hidden group/plot">
                        <div className="absolute top-3 left-4 text-xs text-stone-400 font-bold uppercase tracking-wider">(c) Soil Moisture PDF</div>
                        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 -rotate-90 text-[10px] text-stone-500 font-serif">
                            <Latex>{'p(s)'}</Latex>
                        </div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-stone-500 font-serif">
                             <Latex>{'s'}</Latex>
                        </div>
                        
                        <div className="absolute top-12 right-12 bottom-16 left-16 border-l border-b border-stone-600/50">
                             {/* Axis Ticks X */}
                             {[0.2, 0.4, 0.6, 0.8].map(v => (
                                <div key={v} className="absolute bottom-0 translate-y-full pt-1 flex flex-col items-center" style={{ left: `${v * 100}%` }}>
                                    <div className="w-px h-1 bg-stone-500 mb-1"></div>
                                    <span className="text-[10px] text-stone-500 font-mono -ml-px">{v.toFixed(1)}</span>
                                </div>
                            ))}
                            
                             {/* Axis Ticks Y (PDF) */}
                             <div className="absolute left-0 -translate-x-full pr-1 flex items-center justify-end w-8" style={{ bottom: `0%` }}>
                                    <span className="text-[10px] text-stone-500 font-mono mr-1">0</span>
                                    <div className="w-1 h-px bg-stone-500"></div>
                             </div>
                             <div className="absolute left-0 -translate-x-full pr-1 flex items-center justify-end w-8" style={{ bottom: `50%` }}>
                                    <div className="w-1 h-px bg-stone-500"></div>
                             </div>
                              <div className="absolute left-0 -translate-x-full pr-1 flex items-center justify-end w-8" style={{ bottom: `100%` }}>
                                    <div className="w-1 h-px bg-stone-500"></div>
                             </div>

                             {/* Grid Lines */}
                             <div className="absolute inset-0 pointer-events-none">
                                {[0.2, 0.4, 0.6, 0.8].map(p => (
                                    <div key={p} className="absolute top-0 bottom-0 border-l border-stone-600/20" style={{ left: `${p*100}%` }} />
                                ))}
                            </div>

                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {dataset.map((d, i) => i % 2 === 0 && (
                                    <path 
                                        key={i}
                                        d={`M ${d.points.map(pt => `${pt.s * 100} ${100 - (pt.prob / pdfMax * 100)}`).join(' L ')}`} 
                                        fill="none"
                                        stroke={getViridisColor(d.t)}
                                        strokeWidth="0.8"
                                        strokeOpacity="0.3"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                ))}
                                
                                {/* Active Curve Stroke */}
                                <path 
                                    d={`M ${activeData.points.map(pt => `${pt.s * 100} ${100 - (pt.prob / pdfMax * 100)}`).join(' L ')}`}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    vectorEffect="non-scaling-stroke"
                                />
                                <path 
                                    d={`M ${activeData.points.map(pt => `${pt.s * 100} ${100 - (pt.prob / pdfMax * 100)}`).join(' L ')}`}
                                    fill="none"
                                    stroke={getViridisColor(activeData.t)}
                                    strokeWidth="1.5"
                                    vectorEffect="non-scaling-stroke"
                                />
                             </svg>
                        </div>
                    </div>
                </div>

                {/* Column 2: Scatter Plots (b) & (d) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 justify-between h-[400px] lg:h-full">
                     <div className="flex-1 bg-[#1a1a1a] border border-stone-700 rounded-xl p-4 flex flex-col">
                        <ScatterPlot 
                            data={dataset} 
                            activeData={activeData} 
                            yKey="sigma" 
                            yLabel="\\sigma" 
                            yDomain={[0, 0.7]} 
                            label="(b) Uptake Capacity" 
                        />
                     </div>
                     <div className="flex-1 bg-[#1a1a1a] border border-stone-700 rounded-xl p-4 flex flex-col">
                         <ScatterPlot 
                            data={dataset} 
                            activeData={activeData} 
                            yKey="epsilon" 
                            yLabel="\\epsilon" 
                            yDomain={[0.3, 0.65]} 
                            label="(d) Performance" 
                        />
                     </div>
                </div>

                {/* Column 3: Pi Groups (e) */}
                <div className="col-span-12 lg:col-span-2 lg:h-full">
                     <PiGroupStrip data={dataset} activeData={activeData} />
                </div>

            </div>
        </div>
    );
};
