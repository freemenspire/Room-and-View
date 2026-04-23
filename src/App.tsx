import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const NAV_LINKS = ['Services', 'Portfolio', 'About', 'Contact']

const SERVICES = [
  {
    title: 'Residential Design',
    desc: 'Transforming homes into personal sanctuaries. From single rooms to full-scale renovations, we craft spaces that reflect who you are.',
    icon: '⌂',
    back: 'From studio apartments to sprawling estates — every scale, every style, handled with the same care.',
  },
  {
    title: 'Commercial Spaces',
    desc: 'Purposeful environments that elevate your brand. We design offices, boutiques, and hospitality spaces that make lasting impressions.',
    icon: '◻',
    back: 'Retail, hospitality, corporate — we align every design decision with your brand and your people.',
  },
  {
    title: 'Space Planning',
    desc: 'Strategic layouts that maximize flow and function. Every square foot considered, every detail deliberate.',
    icon: '⊞',
    back: 'We model traffic, light, and use patterns before a single wall is moved.',
  },
  {
    title: 'FF&E Curation',
    desc: 'Expert selection of furniture, fixtures, and equipment. We source globally to find pieces that are both beautiful and enduring.',
    icon: '◈',
    back: 'Access to 400+ trade vendors worldwide — pieces that can\'t be found on the high street.',
  },
  {
    title: 'Color Consultation',
    desc: 'The right palette changes everything. Our color specialists guide you to tones that harmonize your space and elevate your mood.',
    icon: '◉',
    back: 'We test color in your actual light conditions — morning, afternoon, and evening.',
  },
  {
    title: 'Project Management',
    desc: "Seamless execution from concept to completion. We coordinate every vendor, contractor, and timeline so you don't have to.",
    icon: '◇',
    back: 'One point of contact. Full accountability. Projects delivered on time and on budget.',
  },
]

const PORTFOLIO = [
  { title: 'The Meridian Penthouse', category: 'Residential', color: '#C4A882' },
  { title: 'Atelier Noir Boutique', category: 'Commercial', color: '#8B7355' },
  { title: 'The Orchard Estate', category: 'Residential', color: '#B5A08A' },
  { title: 'Lumière Restaurant', category: 'Hospitality', color: '#9A8570' },
  { title: 'Harlow Tower Offices', category: 'Commercial', color: '#C9B99A' },
  { title: 'Casa Serena Villa', category: 'Residential', color: '#A8936E' },
]

const TESTIMONIALS = [
  {
    quote: "Room and View didn't just design our home — they understood our life and translated it into something extraordinary.",
    author: 'Margaret & Thomas H.',
    project: 'The Orchard Estate',
  },
  {
    quote: 'Working with their team was effortless. The result exceeded every expectation we had going in.',
    author: 'James K.',
    project: 'Harlow Tower Offices',
  },
  {
    quote: 'Our restaurant has become a destination in its own right. Guests comment on the space before they even taste the food.',
    author: 'Sofia R.',
    project: 'Lumière Restaurant',
  },
]

// --- Portfolio 3D tilt card ---
function TiltCard({ project, index }: { project: typeof PORTFOLIO[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50, active: false })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width   // 0–1
    const y = (e.clientY - rect.top) / rect.height    // 0–1
    const rx = (y - 0.5) * -18   // tilt up/down
    const ry = (x - 0.5) * 22    // tilt left/right
    setTilt({ rx, ry, glareX: x * 100, glareY: y * 100, active: true })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50, active: false })
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden cursor-pointer"
      style={{
        aspectRatio: index % 3 === 1 ? '3/4' : '4/3',
        perspective: '900px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.active ? 1.03 : 1})`,
          transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${135 + index * 15}deg, ${project.color}99, ${project.color}44, #1c1a17)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(196,168,130,0.3) 40px, rgba(196,168,130,0.3) 41px)`,
        }} />

        {/* Glare layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            opacity: tilt.active ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Content — lifted in Z */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6"
          style={{ transform: 'translateZ(30px)', transition: tilt.active ? 'none' : 'transform 0.5s ease-out' }}
        >
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-sans font-medium mb-2">{project.category}</p>
          <h3 className="text-stone-50 text-xl font-light tracking-wide">{project.title}</h3>
        </div>

        <div
          className="absolute top-4 right-4"
          style={{
            transform: `translateZ(30px)`,
            opacity: tilt.active ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        >
          <span className="text-amber-400 text-2xl">→</span>
        </div>
      </div>
    </div>
  )
}

// --- Services flip card ---
function FlipCard({ service }: { service: typeof SERVICES[0] }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="relative cursor-default"
      style={{ perspective: '1000px', minHeight: '220px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.65s cubic-bezier(0.4,0.2,0.2,1)',
          minHeight: '220px',
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 bg-stone-50 p-10 flex flex-col"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <span className="text-3xl text-amber-700 block mb-6">{service.icon}</span>
          <h3 className="text-xl font-light text-stone-800 mb-4 tracking-wide">{service.title}</h3>
          <p className="text-stone-500 font-sans font-light text-sm leading-relaxed">{service.desc}</p>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 bg-stone-900 p-10 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <span className="text-3xl text-amber-400 block mb-6">{service.icon}</span>
            <h3 className="text-xl font-light text-stone-50 mb-4 tracking-wide">{service.title}</h3>
            <p className="text-stone-400 font-sans font-light text-sm leading-relaxed">{service.back}</p>
          </div>
          <div className="mt-6">
            <span className="text-amber-500 text-xs tracking-[0.25em] uppercase font-sans font-medium border-b border-amber-700/50 pb-0.5">
              Learn More →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Hero parallax ---
function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 to 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (gridRef.current)    gridRef.current.style.transform    = `translate(${cx * -12}px, ${cy * -8}px)`
      if (decorRef.current)   decorRef.current.style.transform   = `translateY(-50%) translate(${cx * 28}px, ${cy * 18}px)`
      if (barRef.current)     barRef.current.style.transform     = `translate(${cx * 5}px, ${cy * 3}px)`
      if (contentRef.current) contentRef.current.style.transform = `translate(${cx * -6}px, ${cy * -4}px)`
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (gridRef.current)    gridRef.current.style.transform    = ''
    if (decorRef.current)   decorRef.current.style.transform   = 'translateY(-50%)'
    if (barRef.current)     barRef.current.style.transform     = ''
    if (contentRef.current) contentRef.current.style.transform = ''
  }, [])

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-end pb-24 overflow-hidden bg-stone-900"
    >
      {/* Base bg */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #1c1a17 0%, #2d2620 40%, #1a1208 100%)',
      }} />

      {/* Grid layer — slowest */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(196,168,130,0.15) 80px, rgba(196,168,130,0.15) 81px),
                            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(196,168,130,0.15) 80px, rgba(196,168,130,0.15) 81px)`,
          transition: 'transform 0.08s ease-out',
          willChange: 'transform',
        }}
      />

      {/* Gold bar — subtle */}
      <div
        ref={barRef}
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-700 via-amber-600 to-transparent opacity-60"
        style={{ transition: 'transform 0.12s ease-out', willChange: 'transform' }}
      />

      {/* Large R&V — fastest layer */}
      <div
        ref={decorRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[20vw] leading-none font-serif text-stone-700 opacity-10 select-none pointer-events-none pr-8"
        style={{ transition: 'transform 0.06s ease-out', willChange: 'transform' }}
      >
        R&V
      </div>

      {/* Content — slight counter-movement */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        style={{ transition: 'transform 0.1s ease-out', willChange: 'transform' }}
      >
        {children}
      </div>
    </section>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="bg-stone-50 text-stone-800 font-serif min-h-screen">

      {/* NAV */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-stone-50/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex flex-col leading-none">
            <span className="text-xl tracking-[0.2em] uppercase font-light text-stone-900">Room</span>
            <span className="text-xs tracking-[0.4em] uppercase text-amber-700 font-sans font-medium">& View</span>
          </div>
          <ul className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <li key={link}>
                <button
                  onClick={() => scrollTo(link.toLowerCase())}
                  className="text-sm tracking-[0.15em] uppercase font-sans font-medium text-stone-500 hover:text-amber-700 transition-colors duration-200"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => scrollTo('contact')}
            className="hidden md:block px-6 py-2.5 bg-stone-800 text-stone-50 text-xs tracking-[0.2em] uppercase font-sans font-medium hover:bg-amber-800 transition-colors duration-300"
          >
            Inquire
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`block h-px w-6 bg-stone-800 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px w-6 bg-stone-800 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-stone-800 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden bg-stone-50 border-t border-stone-200 px-6 py-6 flex flex-col gap-6">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                className="text-sm tracking-[0.15em] uppercase font-sans font-medium text-stone-500 hover:text-amber-700 text-left transition-colors"
              >
                {link}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="w-full px-6 py-3 bg-stone-800 text-stone-50 text-xs tracking-[0.2em] uppercase font-sans font-medium hover:bg-amber-800 transition-colors"
            >
              Inquire
            </button>
          </div>
        )}
      </header>

      {/* HERO — parallax */}
      <HeroParallax>
        <div className="max-w-3xl">
          <p className="text-amber-600 text-xs tracking-[0.4em] uppercase font-sans mb-8 font-medium">
            Interior Design Studio · Est. 2010
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-stone-50 leading-[1.05] mb-8 tracking-tight">
            Where Space<br />
            <em className="italic text-amber-400/90">Becomes</em><br />
            Sanctuary
          </h1>
          <p className="text-stone-400 text-lg md:text-xl font-sans font-light leading-relaxed max-w-xl mb-12">
            We design interiors that are quietly extraordinary — spaces built around how you live, not how others expect you to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo('portfolio')}
              className="px-8 py-4 bg-amber-700 text-stone-50 text-xs tracking-[0.25em] uppercase font-sans font-medium hover:bg-amber-600 transition-colors duration-300"
            >
              View Our Work
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 border border-stone-600 text-stone-300 text-xs tracking-[0.25em] uppercase font-sans font-medium hover:border-amber-700 hover:text-amber-400 transition-colors duration-300"
            >
              Start a Project
            </button>
          </div>
        </div>
        <div className="flex gap-12 mt-20 pt-12 border-t border-stone-700/50">
          {[['14+', 'Years Experience'], ['340+', 'Projects Completed'], ['12', 'Design Awards']].map(([num, label]) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-3xl font-light text-amber-400">{num}</span>
              <span className="text-xs tracking-[0.15em] uppercase text-stone-500 font-sans">{label}</span>
            </div>
          ))}
        </div>
      </HeroParallax>

      {/* SERVICES — flip cards */}
      <section id="services" className="py-28 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-sans font-medium mb-4">What We Do</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-800 leading-tight">
              Our <em className="italic">Services</em>
            </h2>
          </div>
          <p className="text-stone-500 font-sans font-light max-w-sm leading-relaxed text-sm">
            Hover each card to learn more. Every engagement begins with deep listening.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200">
          {SERVICES.map(service => (
            <FlipCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      {/* PORTFOLIO — 3D tilt cards */}
      <section id="portfolio" className="py-28 bg-stone-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-amber-600 text-xs tracking-[0.4em] uppercase font-sans font-medium mb-4">Selected Work</p>
              <h2 className="text-4xl md:text-5xl font-light text-stone-50 leading-tight">
                Our <em className="italic text-amber-400/80">Portfolio</em>
              </h2>
            </div>
            <p className="text-stone-400 font-sans font-light max-w-sm leading-relaxed text-sm">
              A curated collection of projects — each one a story told through light, texture, and form.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO.map((project, i) => (
              <TiltCard key={project.title} project={project} index={i} />
            ))}
          </div>
          <div className="text-center mt-14">
            <button className="px-10 py-4 border border-stone-600 text-stone-300 text-xs tracking-[0.25em] uppercase font-sans font-medium hover:border-amber-700 hover:text-amber-400 transition-colors duration-300">
              View Full Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-amber-800 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-amber-200 text-xs tracking-[0.4em] uppercase font-sans font-medium mb-16">Client Stories</p>
          <div className="relative min-h-48">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 flex flex-col items-center justify-center ${i === activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
              >
                <blockquote className="text-2xl md:text-3xl font-light text-amber-50 leading-relaxed italic mb-8">
                  "{t.quote}"
                </blockquote>
                <div>
                  <p className="text-amber-200 font-sans font-medium text-sm">{t.author}</p>
                  <p className="text-amber-400/70 font-sans text-xs tracking-widest uppercase mt-1">{t.project}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-12">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-px transition-all duration-300 ${i === activeTestimonial ? 'w-12 bg-amber-200' : 'w-4 bg-amber-600'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-sans font-medium mb-4">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-800 leading-tight mb-8">
              Design That<br /><em className="italic">Endures</em>
            </h2>
            <p className="text-stone-500 font-sans font-light leading-relaxed mb-6 text-sm">
              Room and View was founded on a singular belief: that thoughtful design transforms not just how a space looks, but how it makes you feel. For over a decade, we have worked with clients across the country to create interiors that are considered, timeless, and deeply personal.
            </p>
            <p className="text-stone-500 font-sans font-light leading-relaxed mb-10 text-sm">
              Our approach is unhurried. We ask questions before we sketch anything. We visit. We listen. We observe how light moves through your rooms and how your days unfold within them. Only then do we begin to design.
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              {[
                ['Natalie Voss', 'Principal Designer', '14 yrs'],
                ['Marcus Ellroy', 'Creative Director', '11 yrs'],
                ['Simone Park', 'Lead Architect', '9 yrs'],
                ['Delia Harmon', 'FF&E Specialist', '7 yrs'],
              ].map(([name, role, exp]) => (
                <div key={name} className="border-l-2 border-amber-700/40 pl-4">
                  <p className="text-stone-800 font-light text-sm">{name}</p>
                  <p className="text-amber-700 text-xs tracking-wide font-sans font-medium">{role}</p>
                  <p className="text-stone-400 text-xs font-sans mt-0.5">{exp} experience</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 bg-stone-800 text-stone-50 text-xs tracking-[0.25em] uppercase font-sans font-medium hover:bg-amber-800 transition-colors duration-300"
            >
              Meet the Team
            </button>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] bg-stone-200 relative overflow-hidden">
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(160deg, #C4A882 0%, #8B7355 40%, #2d2620 100%)',
              }} />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 31px)`,
              }} />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-stone-50 text-3xl font-light leading-snug italic">"Every room has a soul. Our job is to reveal it."</p>
                <p className="text-amber-300 text-xs tracking-widest uppercase font-sans mt-4">— Natalie Voss, Principal</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-700 flex items-center justify-center">
              <span className="text-amber-100 text-xs text-center tracking-widest uppercase font-sans font-medium leading-loose">Design<br />Awards<br />× 12</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-sans font-medium mb-4">How We Work</p>
            <h2 className="text-4xl font-light text-stone-800">Our <em className="italic">Process</em></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              ['01', 'Discovery', 'We learn about you, your habits, your aesthetic, and your goals through an in-depth consultation.'],
              ['02', 'Concept', 'We develop a design concept — mood boards, spatial plans, and material palettes — for your review.'],
              ['03', 'Design', 'Every element is specified and refined. We present a complete design ready for execution.'],
              ['04', 'Delivery', 'We oversee installation and styling until every detail is exactly right.'],
            ].map(([num, title, desc], i, arr) => (
              <div key={num} className={`relative p-8 ${i < arr.length - 1 ? 'border-r border-stone-300' : ''}`}>
                <span className="text-5xl font-light text-stone-200 leading-none block mb-6">{num}</span>
                <h3 className="text-lg font-light text-stone-800 mb-3 tracking-wide">{title}</h3>
                <p className="text-stone-500 font-sans text-sm leading-relaxed font-light">{desc}</p>
                {i < arr.length - 1 && (
                  <span className="absolute top-8 -right-3 text-amber-700 text-xl hidden md:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p className="text-amber-700 text-xs tracking-[0.4em] uppercase font-sans font-medium mb-4">Get In Touch</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-800 leading-tight mb-8">
              Let's Build<br />Something<br /><em className="italic">Beautiful</em>
            </h2>
            <p className="text-stone-500 font-sans font-light leading-relaxed mb-12 text-sm max-w-sm">
              Every project begins with a conversation. Tell us about your space and what you're imagining. We'll take it from there.
            </p>
            <div className="space-y-6">
              {[
                ['Studio', '240 West 34th Street, Suite 900\nNew York, NY 10001'],
                ['Email', 'hello@roomandview.com'],
                ['Phone', '+1 (212) 555 0192'],
                ['Hours', 'Mon–Fri, 9am – 6pm EST'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-6">
                  <span className="text-amber-700 text-xs tracking-[0.2em] uppercase font-sans font-medium w-16 shrink-0 pt-0.5">{label}</span>
                  <span className="text-stone-600 font-sans text-sm leading-relaxed whitespace-pre-line">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase font-sans font-medium text-stone-400 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full border-b border-stone-300 bg-transparent py-3 text-stone-800 font-sans text-sm focus:outline-none focus:border-amber-700 transition-colors placeholder:text-stone-300"
                    placeholder="Natalie"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.2em] uppercase font-sans font-medium text-stone-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full border-b border-stone-300 bg-transparent py-3 text-stone-800 font-sans text-sm focus:outline-none focus:border-amber-700 transition-colors placeholder:text-stone-300"
                    placeholder="Voss"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase font-sans font-medium text-stone-400 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full border-b border-stone-300 bg-transparent py-3 text-stone-800 font-sans text-sm focus:outline-none focus:border-amber-700 transition-colors placeholder:text-stone-300"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase font-sans font-medium text-stone-400 mb-2">Project Type</label>
                <select className="w-full border-b border-stone-300 bg-transparent py-3 text-stone-600 font-sans text-sm focus:outline-none focus:border-amber-700 transition-colors appearance-none">
                  <option value="">Select a service...</option>
                  <option>Residential Design</option>
                  <option>Commercial Spaces</option>
                  <option>Space Planning</option>
                  <option>FF&amp;E Curation</option>
                  <option>Color Consultation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-[0.2em] uppercase font-sans font-medium text-stone-400 mb-2">Tell Us About Your Project</label>
                <textarea
                  rows={4}
                  className="w-full border-b border-stone-300 bg-transparent py-3 text-stone-800 font-sans text-sm focus:outline-none focus:border-amber-700 transition-colors resize-none placeholder:text-stone-300"
                  placeholder="Describe your space, timeline, and what you're hoping to achieve..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-stone-800 text-stone-50 text-xs tracking-[0.25em] uppercase font-sans font-medium hover:bg-amber-800 transition-colors duration-300"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-900 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-stone-700">
            <div>
              <div className="flex flex-col leading-none mb-3">
                <span className="text-lg tracking-[0.2em] uppercase font-light text-stone-100">Room</span>
                <span className="text-xs tracking-[0.4em] uppercase text-amber-600 font-sans font-medium">& View</span>
              </div>
              <p className="text-stone-500 font-sans text-xs font-light">Interior Design Studio · New York, NY</p>
            </div>
            <ul className="flex flex-wrap gap-8">
              {NAV_LINKS.map(link => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo(link.toLowerCase())}
                    className="text-xs tracking-[0.15em] uppercase font-sans font-medium text-stone-500 hover:text-amber-600 transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8">
            <p className="text-stone-600 font-sans text-xs">© 2026 Room and View. All rights reserved.</p>
            <div className="flex gap-6">
              {['Instagram', 'Pinterest', 'LinkedIn', 'Houzz'].map(social => (
                <a key={social} href="#" className="text-stone-600 hover:text-amber-600 transition-colors text-xs font-sans tracking-wide">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
