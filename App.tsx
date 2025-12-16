/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { EcoHeroScene, WaterBalanceScene } from './components/EcoScene';
import { StrategyExplorer, SPACDiagram, DerivationBoard } from './components/Diagrams';
import { Latex } from './components/Math';
import { ArrowDown, Menu, X, Leaf, Droplets, Activity } from 'lucide-react';

const AuthorCard = ({ name, role, delay }: { name: string, role: string, delay: string }) => {
  return (
    <div
      className="flex flex-col group animate-fade-in-up items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs hover:border-nobel-gold/50"
      style={{ animationDelay: delay }}
    >
      <h3 className="font-serif text-2xl text-stone-900 text-center mb-3">{name}</h3>
      <div className="w-12 h-0.5 bg-earth-olive mb-4 opacity-60"></div>
      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
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
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
            <a href="#intro" onClick={scrollToSection('intro')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase tracking-wider text-xs font-bold">The Problem</a>
            <a href="#theory" onClick={scrollToSection('theory')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase tracking-wider text-xs font-bold">Theory</a>
            <a href="#strategies" onClick={scrollToSection('strategies')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase tracking-wider text-xs font-bold">Strategies</a>
            <a href="#authors" onClick={scrollToSection('authors')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase tracking-wider text-xs font-bold">Authors</a>
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
          <a href="#intro" onClick={scrollToSection('intro')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase">The Problem</a>
          <a href="#theory" onClick={scrollToSection('theory')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase">Theory</a>
          <a href="#strategies" onClick={scrollToSection('strategies')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase">Strategies</a>
          <a href="#authors" onClick={scrollToSection('authors')} className="hover:text-earth-olive transition-colors cursor-pointer uppercase">Authors</a>
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

        {/* Authors */}
        <section id="authors" className="py-24 bg-[#EBEAE4] border-t border-stone-300">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">THE RESEARCHERS</div>
              <h2 className="font-serif text-3xl md:text-5xl mb-4 text-stone-900">Contributors</h2>
              <p className="text-stone-500 max-w-2xl mx-auto">Swedish University of Agricultural Sciences & Stockholm University</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center flex-wrap">
              <AuthorCard name="Maoya Bassiouni" role="SLU, Sweden & UC Berkeley" delay="0s" />
              <AuthorCard name="Stefano Manzoni" role="Stockholm University" delay="0.1s" />
              <AuthorCard name="Giulia Vico" role="SLU, Sweden" delay="0.2s" />
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
          <div className="flex gap-8 text-sm font-medium tracking-wide">
            <a href="https://doi.org/10.1016/j.advwatres.2023.104405" target="_blank" className="hover:text-white transition-colors">Original Paper</a>
            <span className="opacity-20">|</span>
            <span className="hover:text-white transition-colors cursor-default">Visualized with AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
