
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { EcoHeroScene, WaterBalanceScene } from './components/EcoScene';
import { StrategyExplorer, SPACDiagram, DerivationBoard } from './components/Diagrams';
import { Latex } from './components/Math';
import { ArrowDown, Menu, X, Leaf, Droplets, Activity, Linkedin, PlayCircle, Presentation, Play, ExternalLink, Network, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      // 1. Handle Navbar Background transparency
      setScrolled(window.scrollY > 50);

      // 2. Handle Active Section Highlighting (Scroll Spy)
      const sections = ['intro', 'theory', 'strategies'];
      // Use a trigger point roughly 1/3 down the viewport for natural reading highlight
      const scrollPosition = window.scrollY + (window.innerHeight * 0.3);

      let current = '';
      
      // Find the last section whose top is above the scroll position
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          if (element.offsetTop <= scrollPosition) {
            current = section;
          }
        }
      }

      // Special case: If we are at the very bottom, highlight the last item
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = 'strategies';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on mount to set initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const getNavLinkClass = (sectionId: string) => {
    const baseClass = "transition-all duration-300 cursor-pointer uppercase tracking-wider text-xs font-bold py-1 border-b-2";
    const activeClass = "text-earth-olive border-earth-olive";
    const inactiveClass = "text-stone-600 border-transparent hover:text-earth-olive hover:border-earth-olive/30";
    
    return `${baseClass} ${activeSection === sectionId ? activeClass : inactiveClass}`;
  };

  const getMobileNavLinkClass = (sectionId: string) => {
    const baseClass = "transition-colors cursor-pointer uppercase";
    const activeClass = "text-earth-olive font-bold";
    const inactiveClass = "hover:text-earth-olive text-stone-800";
    
    return `${baseClass} ${activeSection === sectionId ? activeClass : inactiveClass}`;
  };

  // --- SCIENTIFIC KNOWLEDGE NETWORK DATA ---
  
  const lectures = {
    eagleson: {
      id: 'eagleson',
      title: 'Foundations of Ecohydrology',
      speaker: 'Prof. Peter S. Eagleson',
      institution: 'MIT',
      context: 'Tribute to a Pioneer',
      abstract: 'The late Peter Eagleson established the paradigm of Ecohydrology, linking vegetation dynamics with landscape water availability.',
      url: 'https://www.youtube.com/watch?v=HUH0EXZ_UHE',
      thumbnail: 'https://img.youtube.com/vi/HUH0EXZ_UHE/hqdefault.jpg',
      duration: 'Legacy',
      tags: ['Foundations', 'Climate Coupling']
    },
    porporato: {
      id: 'porporato',
      title: 'Hydrology without Dimensions',
      speaker: 'Prof. Amilcare Porporato',
      institution: 'Princeton University',
      context: 'Dalton Medal Lecture',
      abstract: 'Exploring scaling, group theory, and "street-fighting hydrology" applied to partitioning and landscape evolution.',
      url: 'https://www.youtube.com/watch?v=PmTYdor4vKo&t=329s',
      thumbnail: 'https://img.youtube.com/vi/PmTYdor4vKo/hqdefault.jpg',
      duration: '34:00',
      tags: ['Scaling', 'Theory']
    },
    entekhabi: {
      id: 'entekhabi',
      title: 'SMAP: Land-Atmosphere Coupling',
      speaker: 'Prof. Dara Entekhabi',
      institution: 'MIT',
      context: 'ESSIC Seminar',
      abstract: 'How global soil moisture fields from NASA SMAP provide insights into water and energy balances.',
      url: 'https://www.youtube.com/watch?v=eqI2djznJTM&t=809s',
      thumbnail: 'https://img.youtube.com/vi/eqI2djznJTM/hqdefault.jpg',
      duration: '58:00',
      tags: ['Physics', 'SMAP']
    },
    wood: {
      id: 'wood',
      title: 'Grand Challenges in LSMs',
      speaker: 'Prof. Eric F. Wood',
      institution: 'Princeton University',
      context: 'Symposium Lecture',
      abstract: 'Evolution of land surface models and the need for hyper-resolution monitoring to manage water resources.',
      url: 'https://www.youtube.com/watch?v=Wlq6oJCy54U&t=1002s',
      thumbnail: 'https://img.youtube.com/vi/Wlq6oJCy54U/hqdefault.jpg',
      duration: 'Lecture',
      tags: ['Modeling', 'Global Scale']
    },
    vergopolan: {
      id: 'vergopolan',
      title: 'Hyper-Resolution: SMAP-HydroBlocks',
      speaker: 'Dr. Noemi Vergopolan',
      institution: 'Princeton University',
      context: 'Research Highlight',
      abstract: 'Combining microwave remote sensing, land surface modeling, and ML to obtain 30-m soil moisture estimates.',
      url: 'https://www.youtube.com/watch?v=kw3VqFDLo_4&t=238s',
      thumbnail: 'https://img.youtube.com/vi/kw3VqFDLo_4/hqdefault.jpg',
      duration: 'Visualizer',
      tags: ['Hyper-resolution', 'ML']
    },
    walker: {
      id: 'walker',
      title: 'Remote Sensing & Data Assimilation',
      speaker: 'Prof. Jeffrey Walker',
      institution: 'Monash University',
      context: 'ESSIC Seminar & Field Experiments',
      abstract: 'Improving spatial resolution through downscaling, data assimilation, and P-band satellite concepts for root-zone moisture.',
      url: 'https://youtu.be/rHTF45OkYRs?si=E88zKTct3fT_JxoB',
      thumbnail: 'https://img.youtube.com/vi/rHTF45OkYRs/hqdefault.jpg',
      duration: '1:01:00',
      tags: ['P-Band', 'Field Campaigns', 'Data Assimilation']
    },
    eswar: {
      id: 'eswar',
      title: 'RS Applications in Hydrology',
      speaker: 'Prof. Eswar Rajasekaran',
      institution: 'IIT Bombay',
      context: 'Lecture Series',
      abstract: 'Advanced applications of remote sensing in hydrology and thermal ET estimation.',
      url: 'https://www.youtube.com/watch?v=hRF9oXOV18I&list=PLOzRYVm0a65cD8A9tJpU-vOoz1LDQ-UjD&index=65',
      thumbnail: 'https://img.youtube.com/vi/hRF9oXOV18I/hqdefault.jpg',
      duration: 'Lecture',
      tags: ['ET', 'Thermal']
    }
  };

  const domains = [
    {
      id: 'foundations',
      title: 'Ecohydrology & Fundamental Theory',
      description: 'Why land–water–vegetation systems behave the way they do.',
      color: 'emerald', // Green
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200',
      accent: 'bg-emerald-600',
      text: 'text-emerald-800',
      items: [lectures.eagleson, lectures.porporato]
    },
    {
      id: 'interactions',
      title: 'Soil Moisture & Land–Atmosphere',
      description: 'Soil moisture physics + satellite observation concepts.',
      color: 'sky', // Blue
      bg: 'bg-sky-50/50',
      border: 'border-sky-200',
      accent: 'bg-sky-600',
      text: 'text-sky-800',
      items: [lectures.entekhabi]
    },
    {
      id: 'modeling',
      title: 'Land Surface Modeling',
      description: 'Turning theory into Earth system models.',
      color: 'orange', // Orange
      bg: 'bg-orange-50/50',
      border: 'border-orange-200',
      accent: 'bg-orange-600',
      text: 'text-orange-800',
      items: [lectures.wood, lectures.vergopolan]
    },
    {
      id: 'sensing',
      title: 'Remote Sensing Observations',
      description: 'Field campaigns, data assimilation, and satellite observations.',
      color: 'purple', // Purple
      bg: 'bg-purple-50/50',
      border: 'border-purple-200',
      accent: 'bg-purple-600',
      text: 'text-purple-800',
      items: [lectures.walker]
    },
    {
      id: 'energy',
      title: 'Evapotranspiration & Energy',
      description: 'Water–energy partitioning and thermal remote sensing.',
      color: 'amber', // Yellow
      bg: 'bg-amber-50/50',
      border: 'border-amber-200',
      accent: 'bg-amber-600',
      text: 'text-amber-800',
      items: [lectures.eswar]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-stone-800 selection:bg-earth-olive selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F9F8F4]/95 backdrop-blur-md shadow-sm py-4 border-b border-stone-200/50' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-earth-olive rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg pb-1">
              <Latex className="text-white">{"\\Psi"}</Latex>
            </div>

            <div className={`flex flex-col font-serif transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              <span className="font-bold text-lg tracking-wide text-stone-900 leading-tight">
                Sanjay's Ecohydrology Visualizer
              </span>

              <span className="text-[10px] text-stone-500 font-sans tracking-wide uppercase font-semibold">
                sanjaync@monash.edu
              </span>

              {/* ✅ Added creator + supervision line */}
              <span className="text-[10px] text-stone-500 font-sans leading-snug">
                Created by <span className="font-semibold text-stone-700">Sanjay N C</span> (IIT Bombay and Monash University) — Under supervision of{' '}
                <span className="font-semibold text-stone-700">Prof. Eswar Rajasekaran</span> and{' '}
                <span className="font-semibold text-stone-700">Prof. Jeffrey Walker</span>.
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="#intro" onClick={scrollToSection('intro')} className={getNavLinkClass('intro')}>The Problem</a>
            <a href="#theory" onClick={scrollToSection('theory')} className={getNavLinkClass('theory')}>Theory</a>
            <a href="#strategies" onClick={scrollToSection('strategies')} className={getNavLinkClass('strategies')}>Strategies</a>
            <a 
              href="https://doi.org/10.1016/j.advwatres.2023.104405" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-stone-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              Read Paper
            </a>
          </div>

          <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F9F8F4] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in">
          <a href="#intro" onClick={scrollToSection('intro')} className={getMobileNavLinkClass('intro')}>The Problem</a>
          <a href="#theory" onClick={scrollToSection('theory')} className={getMobileNavLinkClass('theory')}>Theory</a>
          <a href="#strategies" onClick={scrollToSection('strategies')} className={getMobileNavLinkClass('strategies')}>Strategies</a>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <EcoHeroScene />
        
        {/* Gradient Overlay for better text legibility */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.9)_0%,rgba(249,248,244,0.7)_40%,rgba(249,248,244,0.3)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center mt-12">
          <div className="inline-block mb-6 px-4 py-1.5 border border-earth-olive/30 text-earth-olive text-[10px] tracking-[0.3em] uppercase font-bold rounded-full backdrop-blur-md bg-white/40 shadow-sm">
            Advances in Water Resources
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] mb-8 text-stone-900 drop-shadow-sm">
            Optimal Plant <br/><span className="italic font-normal text-stone-600/90 text-4xl md:text-6xl block mt-4">Water Use Strategies</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-700 font-light leading-relaxed mb-12">
            Explaining soil moisture variability through eco-evolutionary optimality and non-dimensional hydraulic traits.
          </p>
          
          <div className="flex justify-center">
            <a href="#intro" onClick={scrollToSection('intro')} className="group flex flex-col items-center gap-3 text-xs font-bold tracking-widest text-stone-400 hover:text-stone-900 transition-colors cursor-pointer uppercase">
              <span>Explore Research</span>
              <span className="p-3 border border-stone-300 rounded-full group-hover:border-stone-900 group-hover:bg-white transition-all duration-300 shadow-sm">
                <ArrowDown size={16} />
              </span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Introduction */}
        <section id="intro" className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4 sticky top-32">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">Introduction</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight text-stone-900">The Up-scaling Challenge</h2>
              <div className="w-20 h-1 bg-earth-olive mb-6"></div>
            </div>
            <div className="md:col-span-8 text-xl text-stone-600 font-light leading-relaxed space-y-8">
              <p>
                <span className="text-6xl float-left mr-4 mt-[-12px] font-serif text-earth-olive opacity-80">P</span>
                lant responses to water stress are critical for carbon and water cycles. However, quantifying these responses at the ecosystem level is complex due to the challenge of upscaling diverse plant traits and disentangling environmental factors.
              </p>
              <p>
                This research proposes a solution: reducing dimensionality. By combining plant traits with soil and climate variables into <strong className="text-stone-900 font-normal">non-dimensional parameter groups (<Latex>{'\\Pi'}</Latex> groups)</strong>, we can synthesize key eco-physiological tradeoffs and predict optimal water use strategies.
              </p>
            </div>
          </div>
        </section>

        {/* Theory: SPAC */}
        <section id="theory" className="py-24 md:py-32 bg-[#F5F5DC]/30 border-t border-stone-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-stone-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-200 shadow-sm">
                  <Leaf size={14} className="text-earth-olive"/> The Framework
                </div>
                <h2 className="font-serif text-4xl md:text-6xl mb-8 text-stone-900">Soil-Plant-Atmosphere</h2>
                <p className="text-xl text-stone-600 mb-10 leading-relaxed font-light">
                  Water moves through the ecosystem driven by potential gradients. The research models this using the Buckingham-<Latex>{'\\Pi'}</Latex> theorem to identify four key non-dimensional groups:
                </p>
                <ul className="space-y-6 text-stone-700">
                  <li className="flex items-start gap-5 p-4 rounded-lg hover:bg-white/50 transition-colors">
                    <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-earth-olive/10 rounded-full font-serif font-bold text-earth-olive text-xl">
                      <Latex>{'\\Pi_R'}</Latex>
                    </span>
                    <div>
                      <strong className="block text-stone-900 text-lg mb-1">Hydraulic Risk Tolerance</strong>
                      <span className="text-stone-600">Balance between stomatal control and xylem damage.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-5 p-4 rounded-lg hover:bg-white/50 transition-colors">
                    <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-earth-olive/10 rounded-full font-serif font-bold text-earth-olive text-xl">
                      <Latex>{'\\Pi_F'}</Latex>
                    </span>
                    <div>
                      <strong className="block text-stone-900 text-lg mb-1">Plant Water Flux Control</strong>
                      <span className="text-stone-600">Ratio of atmospheric demand to plant hydraulic capacity.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-5 p-4 rounded-lg hover:bg-white/50 transition-colors opacity-70">
                    <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-stone-200 rounded-full font-serif font-bold text-stone-500 text-xl">
                      <Latex>{'\\Pi_T'}</Latex>
                    </span>
                    <div>
                      <strong className="block text-stone-800 text-lg mb-1">Soil-Root Transport</strong>
                      <span className="text-stone-500">Capacity of the root system relative to demand.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-5 p-4 rounded-lg hover:bg-white/50 transition-colors opacity-70">
                    <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-stone-200 rounded-full font-serif font-bold text-stone-500 text-xl">
                      <Latex>{'\\Pi_S'}</Latex>
                    </span>
                    <div>
                      <strong className="block text-stone-800 text-lg mb-1">Soil Suitability</strong>
                      <span className="text-stone-500">Effect of soil texture on water extraction.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <SPACDiagram />
              </div>
            </div>
          </div>
        </section>

        {/* Math Derivation Section */}
        <section className="py-24 bg-stone-50 border-y border-stone-200">
          <div className="container mx-auto px-6">
            <DerivationBoard />
          </div>
        </section>

        {/* --- SCIENTIFIC KNOWLEDGE NETWORK SECTION --- */}
        <section className="py-24 bg-[#EBE9E4] border-b border-stone-200">
          <div className="container mx-auto px-6 max-w-7xl">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900/5 text-stone-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-200/20">
                 <Network size={14} /> Knowledge Architecture
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-stone-900 mb-6">Scientific Context & Lineage</h2>
              <p className="max-w-2xl mx-auto text-lg text-stone-600 font-light leading-relaxed">
                Understanding land–atmosphere interactions through the integration of theory, models, and satellite observations.
              </p>
            </div>

            {/* DOMAIN MASONRY LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
              
              {/* Loop through Domains */}
              {domains.map((domain) => (
                <div key={domain.id} className={`rounded-2xl border ${domain.border} ${domain.bg} p-6 flex flex-col gap-6 shadow-sm`}>
                  
                  {/* Domain Header */}
                  <div>
                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-3 ${domain.accent}`}>
                      {domain.title}
                    </div>
                    <p className={`text-sm ${domain.text} opacity-90 leading-snug`}>
                      {domain.description}
                    </p>
                  </div>

                  {/* Videos/Cards in this Domain */}
                  <div className="space-y-4">
                    {domain.items.map((lecture) => (
                      <div key={lecture.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-shadow group">
                         {/* Thumbnail (Compact) */}
                         <div className="relative aspect-video w-full bg-stone-200 cursor-pointer overflow-hidden" onClick={() => window.open(lecture.url, '_blank')}>
                            <img src={lecture.thumbnail} alt={lecture.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                               <PlayCircle className="text-white drop-shadow-md opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" size={32} />
                            </div>
                         </div>
                         
                         {/* Details */}
                         <div className="p-4">
                           <h4 className="font-serif text-lg leading-tight text-stone-900 mb-1 group-hover:text-stone-600 transition-colors cursor-pointer" onClick={() => window.open(lecture.url, '_blank')}>
                             {lecture.title}
                           </h4>
                           <div className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">
                             {lecture.speaker} <span className="text-stone-300 mx-1">|</span> <span className="font-normal normal-case italic">{lecture.institution}</span>
                           </div>
                           
                           {/* Dotted Lineage Indicator (Visual Connections) */}
                           <div className={`mt-3 pt-3 border-t border-dashed ${domain.border} flex flex-col gap-2 text-[10px] ${domain.text} opacity-70`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${domain.accent}`}></div>
                                <span>{lecture.tags.join(' • ')}</span>
                              </div>

                              {/* VISUAL LINEAGE CONNECTIONS (Cross-Domain) */}
                              {lecture.id === 'entekhabi' && (
                                <div className="mt-1 pt-2 border-t border-dotted border-emerald-300/50 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wide">
                                        Legacy: Eagleson
                                    </span>
                                </div>
                              )}
                              
                              {lecture.id === 'noemi' && (
                                <div className="mt-1 pt-2 border-t border-dotted border-orange-300/50 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                    <span className="text-[10px] text-orange-700 font-semibold uppercase tracking-wide">
                                        Supervision: Wood
                                    </span>
                                </div>
                              )}
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}

              {/* CENTRAL SYNTHESIS NODE (Black) */}
              <div className="md:col-span-2 xl:col-span-1 rounded-2xl border border-stone-800 bg-stone-900 p-8 flex flex-col justify-center text-white shadow-xl relative overflow-hidden group">
                 {/* Decorative background blur */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-stone-700/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                 <div className="relative z-10">
                    <div className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white text-stone-900 mb-6">
                      Integration & Synthesis
                    </div>
                    
                    <h3 className="font-serif text-3xl mb-4 text-white">
                      Sanjay N C <span className="block text-lg text-stone-400 font-sans font-normal mt-2">The Unifying Framework</span>
                    </h3>
                    
                    <p className="text-stone-400 mb-8 leading-relaxed text-sm">
                      Synthesizing ecohydrologic theory, land surface modeling, remote sensing, and energy fluxes into a coherent understanding of global water strategies.
                    </p>
                    
                    {/* SUPERVISION LINKS */}
                    <div className="space-y-3 mb-8 bg-stone-800/50 p-4 rounded-xl border border-stone-700">
                       <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">Research Supervision</div>
                       
                       {/* Eswar Link (Yellow) */}
                       <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                           <div className="flex-1 border-b border-dotted border-amber-500/50"></div>
                           <span className="text-xs font-bold text-amber-100 whitespace-nowrap">Prof. Eswar R.</span>
                       </div>

                       {/* Walker Link (Purple) */}
                       <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                           <div className="flex-1 border-b border-dotted border-purple-500/50"></div>
                           <span className="text-xs font-bold text-purple-100 whitespace-nowrap">Prof. Jeffrey Walker</span>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3 text-sm text-stone-300">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span>Theory & Scaling</span>
                          <ArrowRight size={12} className="opacity-50" />
                          <span className="font-bold text-white">Strategies</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-stone-300">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span>Models (LSMs)</span>
                          <ArrowRight size={12} className="opacity-50" />
                          <span className="font-bold text-white">Validation</span>
                       </div>
                       <div className="flex items-center gap-3 text-sm text-stone-300">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span>Observations</span>
                          <ArrowRight size={12} className="opacity-50" />
                          <span className="font-bold text-white">Constraint</span>
                       </div>
                    </div>

                    <a href="#strategies" onClick={scrollToSection('strategies')} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-earth-olive hover:text-white transition-colors cursor-pointer">
                       View Research <ArrowDown size={14} />
                    </a>
                 </div>
              </div>

            </div>
            
          </div>
        </section>

        {/* Strategies: Interactive */}
        <section id="strategies" className="py-24 md:py-32 bg-stone-900 text-stone-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="w-[800px] h-[800px] rounded-full bg-earth-olive blur-[150px] absolute top-[-200px] left-[-200px] opacity-40"></div>
            <div className="w-[600px] h-[600px] rounded-full bg-earth-water blur-[120px] absolute bottom-[-100px] right-[-100px] opacity-30"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 text-earth-olive text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-700">
                Interactive Model
              </div>
              <h2 className="font-serif text-4xl md:text-6xl mb-8 text-white">Defining the Strategy</h2>
              <p className="text-xl text-stone-400 leading-relaxed font-light">
                How do plants regulate transpiration (<Latex>{'\\beta'}</Latex>) as soil moisture (<Latex>{'s'}</Latex>) depletes? Adjust the <strong>Risk Tolerance</strong> below to observe the shift between strategies.
              </p>
            </div>

            <StrategyExplorer />
          </div>
        </section>

        {/* Results */}
        <section className="py-24 md:py-32 bg-[#F9F8F4]">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-6 relative h-[600px]">
              <div className="absolute inset-0 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-xl">
                <WaterBalanceScene />
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <span className="px-4 py-2 bg-white/80 backdrop-blur text-xs text-stone-500 font-serif italic rounded-full shadow-sm">
                    Optimality criterion: maximize water uptake while minimizing water stress
                  </span>
                </div>
              </div>
            </div>
            <div className="md:col-span-6 flex flex-col justify-center">
              <div className="inline-block mb-4 text-xs font-bold tracking-widest text-stone-500 uppercase">Key Findings</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-8 text-stone-900">Optimality Explains Reality</h2>
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                By applying this framework to 40 FLUXNET ecosystems, the authors found that observed soil moisture variability is best explained by strategies that <strong>maximize water use performance</strong> (<Latex>{'\\epsilon'}</Latex>).
              </p>
              <p className="text-lg text-stone-600 mb-10 leading-relaxed">
                The optimal strategy balances the benefit of carbon gain (transpiration) against the cost of hydraulic risk (water stress). This parsimonious approach accurately captures dynamics across wet to arid ecosystems without needing complex parameterization.
              </p>

              <div className="p-8 bg-white border border-stone-200 rounded-xl border-l-4 border-l-earth-olive shadow-lg">
                <div className="flex items-center gap-3 mb-4 text-earth-olive">
                  <Activity size={20} />
                  <h4 className="font-bold text-sm uppercase tracking-wider">Research Conclusion</h4>
                </div>
                <p className="font-serif italic text-xl text-stone-800 leading-relaxed">
                  "Specific plant water use strategies maximize plant water uptake weighted by risks of water stress."
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-stone-900 text-stone-400 py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-white font-serif font-bold text-2xl mb-2 flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 bg-earth-olive rounded-full flex items-center justify-center text-[10px] text-white">
                <Latex>{"\\Psi"}</Latex>
              </div>
              Ecohydrology
            </div>
            <p className="text-sm opacity-60">Based on "Optimal plant water use strategies explain soil moisture variability" (2023)</p>
          </div>
          <div className="flex gap-8 text-sm font-medium tracking-wide items-center">
            <a href="https://doi.org/10.1016/j.advwatres.2023.104405" target="_blank" className="hover:text-white transition-colors">Original Paper</a>
            
            <span className="opacity-20">|</span>

            <a href="https://notebooklm.google.com/notebook/eadd648a-5761-4c0a-b441-e4a9bbafc9fc?artifactId=ee069c5e-351b-486a-8707-1e7e6f785103" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
               <Presentation size={18} />
               <span>Slides</span>
            </a>

            <span className="opacity-20">|</span>

            <a href="https://notebooklm.google.com/notebook/eadd648a-5761-4c0a-b441-e4a9bbafc9fc?artifactId=729265cb-53f0-45c6-904c-4d491be8de6e" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
               <PlayCircle size={18} />
               <span>AI Deep Dive</span>
            </a>

            <span className="opacity-20">|</span>

            <a href="https://linkedin.com/in/sanjay-n-c-007894102" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
