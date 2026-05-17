import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Sun, 
  CloudRain, 
  ThermometerSun, 
  Snowflake, 
  Mountain, 
  Compass, 
  TreePine, 
  Luggage, 
  Leaf,
  Droplets,
  Wind,
  Navigation,
  Globe2,
  Star,
  Info,
  ChevronRight,
  Volume2,
  VolumeX
} from "lucide-react";

// --- Premium Sound Effects System ---
// Diseñado con Web Audio API para generar tonos premium sintetizados en tiempo real.
// ¡100% offline, ultra liviano, sin archivos externos ni dependencias de red!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // 1. Sonido Sutil de Click/Tap (para botones)
  playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn("Audio Context failed:", e);
    }
  }

  // 2. Acierto / Ropa Correcta / Respuesta Correcta
  playSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Nota 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Nota 2 (un poco después)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain2.gain.setValueAtTime(0.12, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.25);

      // Nota 3
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(783.99, now + 0.16); // G5
      gain3.gain.setValueAtTime(0.15, now + 0.16);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc3.connect(gain3);
      gain3.connect(this.ctx.destination);
      osc3.start(now + 0.16);
      osc3.stop(now + 0.4);
    } catch (e) {
      console.warn(e);
    }
  }

  // 3. Fallo / Ropa Incorrecta / Error
  playFailure() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.linearRampToValueAtTime(147, now + 0.25); // D3

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      // Sencillo filtro de paso bajo para suavizar el sonido del diente de sierra
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {
      console.warn(e);
    }
  }

  // 4. Giro del Dado / Movimiento (simulado)
  playDice() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Sonido de rodar: 6 "ticks" rápidos que aceleran
      for (let i = 0; i < 6; i++) {
        const tickTime = now + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        // Frecuencia variable para dar sensación de movimiento
        osc.frequency.setValueAtTime(300 + Math.random() * 400, tickTime);
        
        gain.gain.setValueAtTime(0.05, tickTime);
        gain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(tickTime);
        osc.stop(tickTime + 0.06);
      }

      // Golpe final de dado en la mesa
      const endNow = now + 0.48;
      const oscEnd = this.ctx.createOscillator();
      const gainEnd = this.ctx.createGain();
      oscEnd.type = "sine";
      oscEnd.frequency.setValueAtTime(180, endNow);
      gainEnd.gain.setValueAtTime(0.1, endNow);
      gainEnd.gain.exponentialRampToValueAtTime(0.001, endNow + 0.15);
      oscEnd.connect(gainEnd);
      gainEnd.connect(this.ctx.destination);
      oscEnd.start(endNow);
      oscEnd.stop(endNow + 0.15);
    } catch (e) {
      console.warn(e);
    }
  }

  // 5. Gran Victoria / Diploma / Misión completada
  playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Un arpegio mayor triunfal rápido C Major: C4 -> E4 -> G4 -> C5 -> E5 -> G5 -> C6
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);

        // Acentuar última nota
        const volume = idx === notes.length - 1 ? 0.12 : 0.07;
        const duration = idx === notes.length - 1 ? 0.8 : 0.25;

        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        // Añadir oscilador secundario (octava) con forma de onda de seno
        const oscSub = this.ctx.createOscillator();
        const gainSub = this.ctx.createGain();
        oscSub.type = "sine";
        oscSub.frequency.setValueAtTime(freq * 2, time);
        gainSub.gain.setValueAtTime(volume * 0.5, time);
        gainSub.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        oscSub.connect(gainSub);
        gainSub.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
        
        oscSub.start(time);
        oscSub.stop(time + duration);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

export const soundFX = new SoundEngine();

// --- Components ---

const FadeIn: React.FC<{ children: React.ReactNode, delay?: number, className?: string }> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const SunInteractive = () => {
  const [lat, setLat] = useState(0);
  
  let zoneName = "Zona Cálida (Ecuador)";
  let zoneColor = "text-orange-500";
  if (lat > 23 && lat <= 66) {
    zoneName = "Zona Templada";
    zoneColor = "text-yellow-500";
  } else if (lat > 66) {
    zoneName = "Zona Fría (Polos)";
    zoneColor = "text-blue-400";
  }

  // Calculate beam spread. At 0° it's 100px wide. At 80° it spreads out.
  const spread = 100 / Math.max(Math.cos(lat * Math.PI / 180), 0.15);
  
  return (
    <div className="bg-slate-900 rounded-[32px] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800">
      <div className="relative z-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
            <Sun className="text-orange-400" /> Simulador de Inclinación Solar
          </h3>
          <p className="text-slate-300 font-light mb-8 leading-relaxed">
            Mueve el control para viajar desde el Ecuador (0°) hacia los Polos (90°). Observa cómo la inclinación de la Tierra hace que la luz solar se esparza, perdiendo fuerza y calentando menos.
          </p>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2">
              <span className="text-orange-400">0° (Ecuador)</span>
              <span className="text-blue-400">90° (Polo)</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="90" 
              value={lat} 
              onChange={(e) => setLat(Number(e.target.value))}
              className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          
          <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Impacto Actual:</p>
            <p className={`text-2xl font-serif ${zoneColor}`}>{zoneName}</p>
            <p className="text-slate-300 mt-2 text-sm">
              {lat <= 23 && "Los rayos caen casi rectos. La energía está concentrada al máximo. ¡Hace mucho calor!"}
              {lat > 23 && lat <= 66 && "Los rayos caen inclinados. La misma luz se reparte en más espacio, suavizando las temperaturas."}
              {lat > 66 && "Los rayos apenas rozan la superficie. La energía se disipa casi por completo. Es el reino del hielo."}
            </p>
          </div>
        </div>
        
        {/* Visualizer */}
        <div className="relative h-[300px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-end pb-10">
          <div className="absolute top-0 text-orange-400 flex flex-col items-center">
            <Sun size={48} className="animate-spin-slow" />
            <motion.div 
              style={{ width: spread, opacity: Math.max(1 - (lat / 120), 0.3) }}
              className="h-48 bg-gradient-to-b from-orange-400/80 to-yellow-500/10 blur-md transform origin-bottom transition-all duration-100 ease-out"
            />
          </div>
          
          {/* Surface of the earth rotating */}
          <motion.div 
            animate={{ rotate: lat }}
            className="w-[200%] h-4 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 origin-center rounded-full mt-48 z-10"
          />
          <span className="absolute bottom-4 text-xs text-slate-500 uppercase tracking-widest font-bold">Superficie Terrestre</span>
        </div>
      </div>
    </div>
  );
};

const interactiveCards = [
  {
    id: "selva",
    title: "Selva",
    icon: <Leaf />,
    subtitle: "Humedad extrema",
    img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80",
    desc: "Es el reino de la humedad y la vegetación frondosa (como el Amazonas). El aire se siente 'pesado' y pegajoso. Aquí habitan tucanes, monos, jaguares y miles de insectos."
  },
  {
    id: "sabana",
    title: "Sabana",
    icon: <Wind />,
    subtitle: "Lluvias y sequías",
    img: "https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?auto=format&fit=crop&w=1200&q=80",
    desc: "Grandes pastizales que alternan épocas de lluvia con intensas sequías. Es el hogar de los grandes caminantes: elefantes, jirafas, leones, hienas y rinocerontes."
  },
  {
    id: "desierto",
    title: "Desierto",
    icon: <Sun />,
    subtitle: "Calor seco implacable",
    img: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80",
    desc: "Aquí el calor es seco y agobiante de día. Pero al no haber nubes que guarden el calor, la temperatura baja drásticamente por la noche. La vida aquí es escasa y valiente."
  }
];

const SeasonsInteractive = () => {
  const [activeTab, setActiveTab] = useState("primavera");

  const seasons = [
    { id: 'primavera', title: 'Primavera', icon: <Leaf />, color: 'text-pink-500', bg: 'bg-pink-100', img: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80', desc: 'El aire es fresco y las flores despiertan en el bosque templado. Usamos chaquetas ligeras mientras la biología recobra su energía.' },
    { id: 'verano', title: 'Verano', icon: <Sun />, color: 'text-yellow-600', bg: 'bg-yellow-100', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', desc: 'El verde del bosque alcanza su máximo esplendor. El sol calienta con fuerza, los días son largos e invita a disfrutar al aire libre bajo los densos árboles.' },
    { id: 'otono', title: 'Otoño', icon: <Wind />, color: 'text-orange-600', bg: 'bg-orange-100', img: 'https://images.unsplash.com/photo-1416862291207-4ca732144d83?auto=format&fit=crop&w=1200&q=80', desc: 'Los árboles de hoja caduca del bosque templado cambian de color. Las hojas caen formando mantos dorados y rojizos, y empezamos a usar capas de ropa.' },
    { id: 'invierno', title: 'Invierno', icon: <Snowflake />, color: 'text-blue-500', bg: 'bg-blue-100', img: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=80', desc: 'El bosque queda desnudo y a menudo cubierto de nieve. Sacamos abrigos gruesos, bufandas y botas para tolerar las bajas temperaturas de este letargo biológico.' }
  ];

  const activeData = seasons.find(s => s.id === activeTab) || seasons[0];

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl border border-teal-100">
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-2xl font-serif font-bold text-teal-900 mb-2">El Bosque Templado a través del año</h3>
        <p className="text-teal-700/80 mb-6 text-sm uppercase tracking-widest font-bold">Selecciona una estación</p>
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
          {seasons.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold transition-all ${
                activeTab === s.id ? `${s.bg} ${s.color} shadow-sm scale-105` : `bg-gray-50 text-gray-500 hover:bg-gray-100`
              }`}
            >
              {s.icon} <span className="hidden md:inline">{s.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-inner">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeData.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={activeData.img}
            className="absolute inset-0 w-full h-full object-cover"
            alt={activeData.title}
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeData.id + "-text"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h4 className={`text-4xl md:text-5xl font-serif font-bold ${activeData.color.replace('text-', 'text-')} text-white mb-4 drop-shadow-lg`}>
                {activeData.title}
              </h4>
              <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-md">
                {activeData.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const PackingInteractive = () => {
  const allGear = [
    { id: "cotton", name: "Polera de Algodón 👕", isCorrect: true, desc: "Ropa muy ligera y transpirable. ¡Es perfecta para tolerar la humedad de la selva y el calor!", packed: false },
    { id: "shorts", name: "Shorts frescos 🩳", isCorrect: true, desc: "Pantalones cortos para que tus piernas respiren y no sientas el calor agobiante.", packed: false },
    { id: "sandals", name: "Sandalias cómodas 🩴", isCorrect: true, desc: "Mantienen tus pies frescos. Evitan que sudes como pasaría con calzado cerrado pesado.", packed: false },
    { id: "sunscreen", name: "Protector Solar 🧴", isCorrect: true, desc: "¡Vital! Los rayos caen directos y rectos en el ecuador, quemando la piel en minutos.", packed: false },
    { id: "hat", name: "Gorra de Sol 🧢", isCorrect: true, desc: "Protege tu cara y tu cabeza de la radiación solar directa. ¡Evita insolaciones!", packed: false },
    { id: "parka", name: "Parka de Plumas 🧥", isCorrect: false, desc: "¡Qué calor! Con más de 30°C y humedad extrema, te derretirías al instante.", packed: false },
    { id: "boots", name: "Botas de Nieve 🥾", isCorrect: false, desc: "Tus pies sudarían muchísimo, te saldrían ampollas y caminarías muy incómodo.", packed: false },
    { id: "gloves", name: "Guantes de Lana 🧤", isCorrect: false, desc: "¡Innecesario! En el trópico tus manos no necesitan abrigo alguno.", packed: false }
  ];

  const [gearList, setGearList] = useState(allGear);
  const [packedCount, setPackedCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  const maxCorrect = allGear.filter(g => g.isCorrect).length;

  const handleEquip = (id: string) => {
    const item = gearList.find(g => g.id === id);
    if (!item) return;

    if (item.isCorrect) {
      if (item.packed) {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: false } : g));
        setPackedCount(prev => prev - 1);
        setFeedback(`Te has quitado la ${item.name.split(" ")[0]}. ¡Volverá a tu mochila!`);
        setFeedbackType("error");
        soundFX.playClick();
      } else {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: true } : g));
        const newCount = packedCount + 1;
        setPackedCount(newCount);
        setFeedback(`¡Excelente! ${item.desc}`);
        setFeedbackType("success");
        if (newCount === maxCorrect) {
          soundFX.playVictory();
        } else {
          soundFX.playSuccess();
        }
      }
    } else {
      setFeedback(`🚨 ¡Alerta de Calor Absoluto! ${item.desc}`);
      setFeedbackType("error");
      soundFX.playFailure();
    }
  };

  const isCompleted = packedCount === maxCorrect;

  return (
    <div className="bg-[#fffdfa] rounded-[32px] p-6 md:p-10 text-gray-900 border border-orange-200 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-white to-white pointer-events-none"></div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            ☀️ Desafío Tropical
          </span>
          <h3 className="text-3xl font-serif font-bold mb-4 text-orange-950">
            Prepara tu Maleta para el Trópico
          </h3>
          <p className="text-gray-600 font-light mb-8 leading-relaxed text-sm md:text-base">
            ¡Viajamos a la Zona Cálida! El calor es constante y la humedad en las selvas es extrema. Selecciona solo las prendas necesarias para estar cómodo y protegido del sol directo.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {gearList.map((item) => (
              <button
                key={item.id}
                onClick={() => handleEquip(item.id)}
                className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  item.packed 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm"
                    : "bg-orange-50/30 border-orange-100 text-orange-950 hover:bg-orange-50"
                }`}
              >
                <span>{item.name}</span>
                {item.packed && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            ))}
          </div>

          <div className="h-20 flex items-center">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl border text-sm font-light leading-relaxed w-full ${
                    feedbackType === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Suitcase Preview */}
        <div className="relative bg-orange-50/40 rounded-2xl p-6 border border-orange-100 flex flex-col items-center justify-center min-h-[350px]">
          <img 
            src="./warm_clothing.png" 
            alt="Ropa Tropical" 
            className="w-full max-w-[280px] h-auto object-contain rounded-xl shadow-md border border-orange-100 mb-6 bg-white p-2"
          />
          
          <div className="w-full">
            <div className="flex justify-between text-xs text-orange-800 uppercase tracking-widest font-bold mb-2">
              <span>Progreso de la Maleta:</span>
              <span>{packedCount} de {maxCorrect} prendas</span>
            </div>
            
            <div className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-300"
                animate={{ width: `${(packedCount / maxCorrect) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center border-2 border-emerald-500"
              >
                <div className="w-20 h-20 bg-emerald-100 border border-emerald-400 rounded-full flex items-center justify-center text-5xl mb-4 animate-bounce">
                  🌴
                </div>
                <h4 className="text-2xl font-serif font-bold text-gray-900 mb-2">¡Mochila Tropical Lista!</h4>
                <p className="text-emerald-800 text-sm mb-6 leading-relaxed max-w-xs font-light">
                  ¡Excelente! Tienes todo lo indispensable para explorar la selva o el desierto sin sufrir insolaciones o exceso de calor.
                </p>
                <button
                  onClick={() => {
                    setGearList(allGear);
                    setPackedCount(0);
                    setFeedback(null);
                    setFeedbackType(null);
                  }}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
                >
                  Reiniciar Mochila
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const PolarGearInteractive = () => {
  const allGear = [
    { id: "parka", name: "Parka Extrema 🧥", isCorrect: true, desc: "Abrigo térmico e impermeable. ¡Mantiene el calor del cuerpo a salvo del viento polar!", packed: false },
    { id: "boots", name: "Botas de Nieve 🥾", isCorrect: true, desc: "Aislantes y con suela gruesa para caminar sobre el hielo sin congelarte.", packed: false },
    { id: "gloves", name: "Guantes Térmicos 🧤", isCorrect: true, desc: "Acolchados e impermeables. Tus manos se mantendrán calientes y secas.", packed: false },
    { id: "beanie", name: "Gorro de Lana 🧣", isCorrect: true, desc: "Esencial, ya que gran parte del calor corporal se escapa por la cabeza.", packed: false },
    { id: "goggles", name: "Gafas de Nieve 🥽", isCorrect: true, desc: "Protegen tus ojos del reflejo solar extremo sobre el hielo blanco.", packed: false },
    { id: "shorts", name: "Shorts playeros 🩳", isCorrect: false, desc: "¡Cuidado! A -30°C tus piernas se congelarían en cuestión de segundos.", packed: false },
    { id: "sandals", name: "Sandalias 🩴", isCorrect: false, desc: "¡No! En el hielo necesitas protección total. Tus dedos no aguantarían el frío.", packed: false },
    { id: "swimsuit", name: "Traje de baño 🩱", isCorrect: false, desc: "¡Para nada! A menos que seas una foca, no querrás usar esto en los polos.", packed: false }
  ];

  const [gearList, setGearList] = useState(allGear);
  const [packedCount, setPackedCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  const maxCorrect = allGear.filter(g => g.isCorrect).length;

  const handleEquip = (id: string) => {
    const item = gearList.find(g => g.id === id);
    if (!item) return;

    if (item.isCorrect) {
      if (item.packed) {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: false } : g));
        setPackedCount(prev => prev - 1);
        setFeedback(`Te has quitado la ${item.name.split(" ")[0]}. ¡Hace frío!`);
        setFeedbackType("error");
        soundFX.playClick();
      } else {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: true } : g));
        const newCount = packedCount + 1;
        setPackedCount(newCount);
        setFeedback(`¡Excelente! ${item.desc}`);
        setFeedbackType("success");
        if (newCount === maxCorrect) {
          soundFX.playVictory();
        } else {
          soundFX.playSuccess();
        }
      }
    } else {
      setFeedback(`🚨 ¡Alerta de Congelación! ${item.desc}`);
      setFeedbackType("error");
      soundFX.playFailure();
    }
  };

  const isCompleted = packedCount === maxCorrect;

  return (
    <div className="bg-[#0f2444] rounded-[32px] p-6 md:p-10 text-white border border-blue-900/60 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-[#0f2444] to-[#0f2444] pointer-events-none"></div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            🧤 Minijuego de Supervivencia
          </span>
          <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-white">
            Prepárate para la Expedición Polar
          </h3>
          <p className="text-blue-200/80 font-light mb-8 leading-relaxed text-sm md:text-base">
            En los polos la temperatura puede bajar de los -40°C. Si no te vistes adecuadamente, ¡te congelarías! Selecciona únicamente las prendas correctas para completar tu traje de exploración.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {gearList.map((item) => (
              <button
                key={item.id}
                onClick={() => handleEquip(item.id)}
                className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  item.packed 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-emerald-950/20"
                    : "bg-blue-950/40 border-blue-800/60 text-blue-200 hover:bg-blue-900/40"
                }`}
              >
                <span>{item.name}</span>
                {item.packed && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            ))}
          </div>

          <div className="h-20 flex items-center">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl border text-sm font-light leading-relaxed w-full ${
                    feedbackType === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      : "bg-red-500/10 border-red-500/30 text-red-200"
                  }`}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Suitcase / Character Preview */}
        <div className="relative bg-blue-950/50 rounded-2xl p-6 border border-blue-900/60 flex flex-col items-center justify-center min-h-[350px]">
          <img 
            src="./polar_clothing.png" 
            alt="Ropa Polar" 
            className="w-full max-w-[280px] h-auto object-contain rounded-xl shadow-lg border border-blue-900/60 mb-6 bg-blue-900/20 p-2"
          />
          
          <div className="w-full">
            <div className="flex justify-between text-xs text-blue-300 uppercase tracking-widest font-bold mb-2">
              <span>Progreso del Traje:</span>
              <span>{packedCount} de {maxCorrect} prendas</span>
            </div>
            
            <div className="w-full h-3 bg-blue-900/60 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300"
                animate={{ width: `${(packedCount / maxCorrect) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center border-2 border-emerald-500"
              >
                <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400 rounded-full flex items-center justify-center text-5xl mb-4 animate-bounce">
                  🏆
                </div>
                <h4 className="text-2xl font-serif font-bold text-white mb-2">¡Listo para la Expedición!</h4>
                <p className="text-emerald-300 text-sm mb-6 leading-relaxed max-w-xs font-light">
                  ¡Excelente trabajo! Has seleccionado todo el equipamiento necesario para sobrevivir al viento y al frío extremo del Reino del Hielo.
                </p>
                <button
                  onClick={() => {
                    setGearList(allGear);
                    setPackedCount(0);
                    setFeedback(null);
                    setFeedbackType(null);
                  }}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Reiniciar Desafío
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const TemperateGearInteractive = () => {
  const allGear = [
    { id: "jacket", name: "Chaqueta Ligera 🧥", isCorrect: true, desc: "Abrigo ideal para el otoño o la primavera fresca. ¡Excelente para el viento de media estación!", packed: false },
    { id: "jeans", name: "Jeans Largos 👖", isCorrect: true, desc: "El pantalón de mezclilla es ideal para climas templados, protegiéndote sin sofocarte.", packed: false },
    { id: "sneakers", name: "Zapatillas Cómodas 👟", isCorrect: true, desc: "Calzado cerrado para protegerte de la humedad del bosque templado u hojas húmedas.", packed: false },
    { id: "umbrella", name: "Paraguas Compacto 🌂", isCorrect: true, desc: "¡Muy útil! Las lluvias son comunes y recurrentes a lo largo de las cuatro estaciones.", packed: false },
    { id: "tshirt", name: "Polera Básica 👕", isCorrect: true, desc: "Esencial para usarla sola si sale el sol, o debajo de tu chaqueta ligera.", packed: false },
    { id: "heavy_parka", name: "Parka Antártica 🧥", isCorrect: false, desc: "¡Excesivo! En la zona templada sudarías demasiado con ropa pensada para el polo.", packed: false },
    { id: "sandals", name: "Sandalias de Playa 🩴", isCorrect: false, desc: "¡No es muy seguro! Si llueve o refresca por la tarde, tus pies se enfriarán rápido.", packed: false },
    { id: "gloves", name: "Guantes de Nieve 🧤", isCorrect: false, desc: "Demasiado gruesos para temperaturas moderadas. No tendrías movilidad.", packed: false }
  ];

  const [gearList, setGearList] = useState(allGear);
  const [packedCount, setPackedCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  const maxCorrect = allGear.filter(g => g.isCorrect).length;

  const handleEquip = (id: string) => {
    const item = gearList.find(g => g.id === id);
    if (!item) return;

    if (item.isCorrect) {
      if (item.packed) {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: false } : g));
        setPackedCount(prev => prev - 1);
        setFeedback(`Te has quitado la ${item.name.split(" ")[0]}. ¡Volverá a tu equipaje!`);
        setFeedbackType("error");
        soundFX.playClick();
      } else {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: true } : g));
        const newCount = packedCount + 1;
        setPackedCount(newCount);
        setFeedback(`¡Excelente! ${item.desc}`);
        setFeedbackType("success");
        if (newCount === maxCorrect) {
          soundFX.playVictory();
        } else {
          soundFX.playSuccess();
        }
      }
    } else {
      setFeedback(`🚨 ¡Alerta de Ropa Inadecuada! ${item.desc}`);
      setFeedbackType("error");
      soundFX.playFailure();
    }
  };

  const isCompleted = packedCount === maxCorrect;

  return (
    <div className="bg-[#fbfcfa] rounded-[32px] p-6 md:p-10 text-gray-900 border border-teal-200 shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/20 via-white to-white pointer-events-none"></div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-teal-100 border border-teal-200 text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            🍃 Desafío Cuatro Estaciones
          </span>
          <h3 className="text-3xl font-serif font-bold mb-4 text-teal-950">
            Equípate para la Zona Templada
          </h3>
          <p className="text-gray-600 font-light mb-8 leading-relaxed text-sm md:text-base">
            ¡Viajamos a la Zona Templada! Aquí el clima cambia mucho y se marcan las cuatro estaciones. La clave es vestirse en capas para adaptarse al sol y la lluvia templada.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {gearList.map((item) => (
              <button
                key={item.id}
                onClick={() => handleEquip(item.id)}
                className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  item.packed 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm"
                    : "bg-teal-50/30 border-teal-100 text-teal-950 hover:bg-teal-50"
                }`}
              >
                <span>{item.name}</span>
                {item.packed && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            ))}
          </div>

          <div className="h-20 flex items-center">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl border text-sm font-light leading-relaxed w-full ${
                    feedbackType === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Suitcase Preview */}
        <div className="relative bg-teal-50/40 rounded-2xl p-6 border border-teal-100 flex flex-col items-center justify-center min-h-[350px]">
          <img 
            src="./temperate_clothing.png" 
            alt="Ropa Templada" 
            className="w-full max-w-[280px] h-auto object-contain rounded-xl shadow-md border border-teal-100 mb-6 bg-white p-2"
          />
          
          <div className="w-full">
            <div className="flex justify-between text-xs text-teal-800 uppercase tracking-widest font-bold mb-2">
              <span>Progreso del Equipaje:</span>
              <span>{packedCount} de {maxCorrect} prendas</span>
            </div>
            
            <div className="w-full h-3 bg-teal-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-300"
                animate={{ width: `${(packedCount / maxCorrect) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 text-center border-2 border-emerald-500"
              >
                <div className="w-20 h-20 bg-emerald-100 border border-emerald-400 rounded-full flex items-center justify-center text-5xl mb-4 animate-bounce">
                  🍂
                </div>
                <h4 className="text-2xl font-serif font-bold text-gray-900 mb-2">¡Equipaje Templado Listo!</h4>
                <p className="text-emerald-800 text-sm mb-6 leading-relaxed max-w-xs font-light">
                  ¡Excelente trabajo! Tienes la ropa perfecta para adaptarte al cambiante clima templado del bosque o los valles.
                </p>
                <button
                  onClick={() => {
                    setGearList(allGear);
                    setPackedCount(0);
                    setFeedback(null);
                    setFeedbackType(null);
                  }}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
                >
                  Reiniciar Equipaje
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ClimaticBoardGame = () => {
  const [position, setPosition] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [gameFinished, setGameFinished] = useState(false);

  const boardSteps = [
    { id: 0, title: "Inicio", type: "start", icon: "🚀", label: "Punto de Partida" },
    { id: 1, title: "Zona Cálida", type: "warm", icon: "🌴", label: "La Radiación Solar" },
    { id: 2, title: "Zona Cálida", type: "warm", icon: "🏜️", label: "Adaptación del Cactus" },
    { id: 3, title: "Zona Templada", type: "temperate", icon: "🍂", label: "Las 4 Estaciones" },
    { id: 4, title: "Zona Templada", type: "temperate", icon: "🏔️", label: "La Alta Montaña" },
    { id: 5, title: "Zona Fría", type: "cold", icon: "🐻‍❄️", label: "Osos vs Pingüinos" },
    { id: 6, title: "Zona Fría", type: "cold", icon: "❄️", label: "Vivir en el Hielo" },
    { id: 7, title: "Meta", type: "finish", icon: "🏆", label: "Gran Explorador" }
  ];

  const questions = [
    {
      step: 1,
      q: "¿Por qué hace tanto calor de forma constante en la Zona Cálida?",
      options: [
        "Porque el Sol está más cerca de la Tierra en el Ecuador.",
        "Porque los rayos del Sol llegan muy directos y perpendiculares (rectos).",
        "Porque no hay vegetación que tape la luz del Sol."
      ],
      correct: 1,
      badge: "Insignia Cálida ☀️",
      desc: "¡Exacto! Al llegar de forma vertical, el calor se concentra en un área pequeña, haciéndola muy caliente."
    },
    {
      step: 2,
      q: "¿De qué forma se adapta la flora (como el Cactus) para sobrevivir al clima seco del desierto?",
      options: [
        "Tienen hojas muy anchas y delgadas para absorber humedad nocturna.",
        "Tienen espinas para evitar perder agua por evaporación y guardan líquido en su tallo.",
        "Cambian de color verde a amarillo según la estación."
      ],
      correct: 1,
      badge: "Insignia del Desierto 🌵",
      desc: "¡Brillante! Las espinas son hojas modificadas que reducen la transpiración al mínimo."
    },
    {
      step: 3,
      q: "¿Por qué en la Zona Templada podemos distinguir claramente las cuatro estaciones?",
      options: [
        "Porque la Tierra se aleja del Sol durante los meses de invierno.",
        "Porque los rayos del Sol llegan con una inclinación moderada que varía a lo largo del año.",
        "Porque el viento sopla siempre en una sola dirección."
      ],
      correct: 1,
      badge: "Insignia de las Estaciones 🍃",
      desc: "¡Excelente! La inclinación semi-inclinada y el movimiento de traslación crean el ciclo perfecto de estaciones."
    },
    {
      step: 4,
      q: "Si subes una montaña altísima en la Zona Templada, ¿qué cambio climático experimentas?",
      options: [
        "La temperatura sube porque estás más cerca de las nubes cálidas.",
        "El clima se vuelve cada vez más frío, imitando la subida hacia los polos.",
        "El clima se mantiene igual, pero el aire se vuelve más denso."
      ],
      correct: 1,
      badge: "Insignia de la Altura 🏔️",
      desc: "¡Maravilloso! A mayor altitud disminuye la presión y la temperatura, creando un clima frío azonal."
    },
    {
      step: 5,
      q: "¿Es verdadero que los osos polares y los pingüinos viven y conviven en el mismo ecosistema?",
      options: [
        "Sí, ambos viven juntos compartiendo los glaciares del Polo Sur.",
        "No, los osos polares habitan en el Polo Norte (Ártico) y los pingüinos en el Polo Sur (Antártica).",
        "Sí, pero solo se juntan durante la época de invierno extremo."
      ],
      correct: 1,
      badge: "Insignia de los Polos 🐧",
      desc: "¡Así es! Están separados por todo el planeta: los osos en el norte y los pingüinos en el sur."
    },
    {
      step: 6,
      q: "¿Cuál es una adaptación clave de las personas para vivir en la Zona Fría?",
      options: [
        "Usar ropa de algodón y chalas ligeras.",
        "Construir casas térmicas con techos inclinados para la nieve y vestir trajes gruesos impermeables.",
        "Mudarse al interior de cuevas bajo tierra y no salir nunca."
      ],
      correct: 1,
      badge: "Insignia de Supervivencia ❄️",
      desc: "¡Excelente respuesta! El ingenio humano nos permite habitar hasta los lugares más helados."
    }
  ];

  const rollDice = () => {
    if (isRolling || showQuestion || gameFinished) return;
    setIsRolling(true);
    setDiceResult(null);
    soundFX.playDice();

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 3) + 1); // 1, 2 or 3 spaces
      rollCount++;
      if (rollCount > 10) {
        clearInterval(interval);
        
        // Final result
        const finalRoll = Math.floor(Math.random() * 3) + 1;
        setDiceResult(finalRoll);
        setIsRolling(false);

        const newPos = Math.min(position + finalRoll, boardSteps.length - 1);
        
        setTimeout(() => {
          setPosition(newPos);
          
          if (newPos === boardSteps.length - 1) {
            setGameFinished(true);
            soundFX.playVictory();
          } else {
            // Find question for this step
            const questionIdx = questions.findIndex(q => q.step === newPos);
            if (questionIdx !== -1) {
              setCurrentQuestionIdx(questionIdx);
              setSelectedAnswer(null);
              setAnswerFeedback(null);
              setIsAnswerCorrect(null);
              setShowQuestion(true);
            }
          }
        }, 800);
      }
    }, 100);
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const question = questions[currentQuestionIdx];
    if (idx === question.correct) {
      setIsAnswerCorrect(true);
      setAnswerFeedback(question.desc);
      soundFX.playSuccess();
      if (!earnedBadges.includes(question.badge)) {
        setEarnedBadges(prev => [...prev, question.badge]);
      }
    } else {
      setIsAnswerCorrect(false);
      setAnswerFeedback("⚠️ ¡Oh! Esa no es la correcta. ¡Inténtalo de nuevo para aprender!");
      soundFX.playFailure();
    }
  };

  const closeQuestion = () => {
    if (isAnswerCorrect) {
      setShowQuestion(false);
    } else {
      // Allow trying again
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      setIsAnswerCorrect(null);
    }
  };

  const resetGame = () => {
    setPosition(0);
    setDiceResult(null);
    setShowQuestion(false);
    setEarnedBadges([]);
    setGameFinished(false);
  };

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl border border-gray-100 max-w-5xl mx-auto relative overflow-hidden my-20">
      {/* Decorative sun */}
      <div className="absolute -top-12 -left-12 text-yellow-100/60 pointer-events-none">
        <Sun size={200} />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-200 text-yellow-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            🎲 Gran Juego de Mesa
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            El Gran Tablero del Explorador
          </h2>
          <p className="text-gray-600 font-light max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            ¡Demuestra todo lo que has aprendido en el viaje! Tira el dado para avanzar a lo largo de las zonas climáticas de la Tierra. ¡Contesta las preguntas para ganar tus insignias oficiales!
          </p>
        </div>

        {/* Badges Display */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {questions.map((q, idx) => {
            const earned = earnedBadges.includes(q.badge);
            return (
              <span
                key={idx}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-500 ${
                  earned
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 scale-105 shadow-sm"
                    : "bg-gray-50 border-gray-200 text-gray-400 opacity-60"
                }`}
              >
                {earned ? "🏆" : "🔒"} {q.badge.split(" ")[0]}
              </span>
            );
          })}
        </div>

        {/* Board Map */}
        <div className="grid grid-cols-2 md:grid-cols-8 gap-4 mb-12">
          {boardSteps.map((step) => {
            const isCurrent = position === step.id;
            const isPassed = position > step.id;
            
            let colorClasses = "";
            if (step.type === "start" || step.type === "finish") {
              colorClasses = "bg-yellow-50 border-yellow-300 text-yellow-950";
            } else if (step.type === "warm") {
              colorClasses = "bg-orange-50 border-orange-200 text-orange-950";
            } else if (step.type === "temperate") {
              colorClasses = "bg-teal-50 border-teal-200 text-teal-950";
            } else {
              colorClasses = "bg-blue-50 border-blue-200 text-blue-950";
            }

            return (
              <div
                key={step.id}
                className={`relative rounded-2xl p-4 border text-center transition-all duration-500 flex flex-col justify-between h-[120px] shadow-sm ${colorClasses} ${
                  isCurrent 
                    ? "ring-4 ring-yellow-400 scale-105 shadow-md font-bold"
                    : isPassed 
                    ? "opacity-60" 
                    : ""
                }`}
              >
                <div className="text-3xl mb-1">{step.icon}</div>
                <div className="text-xs uppercase tracking-widest font-bold opacity-80">{step.title}</div>
                <div className="text-[10px] font-light leading-tight">{step.label}</div>

                {isCurrent && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow"
                  >
                    Tú aquí ☀️
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls & Dice */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={rollDice}
              disabled={isRolling || showQuestion || gameFinished}
              className={`px-8 py-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-100 disabled:text-gray-400 text-gray-900 font-extrabold rounded-2xl shadow-lg border-b-4 border-yellow-600 transition-all active:scale-95 text-base cursor-pointer`}
            >
              {isRolling ? "Girando el Dado..." : "🎲 ¡Tirar el Dado!"}
            </button>

            {/* Custom Dice Graphic */}
            <motion.div
              animate={isRolling ? { rotate: 360 } : {}}
              className="w-16 h-16 bg-white border-2 border-gray-300 rounded-2xl shadow flex items-center justify-center text-3xl font-extrabold text-gray-900"
            >
              {diceResult !== null ? diceResult : "?"}
            </motion.div>
          </div>
          
          <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Avanzas de 1 a 3 casillas por tiro
          </div>
        </div>

        {/* Question Modal Overlay */}
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-6 md:p-10 max-w-xl w-full border border-gray-100 shadow-2xl relative"
              >
                <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  ❓ Pregunta del Camino
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-6 leading-relaxed">
                  {questions[currentQuestionIdx].q}
                </h3>

                <div className="flex flex-col gap-3 mb-6">
                  {questions[currentQuestionIdx].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        selectedAnswer === idx
                          ? isAnswerCorrect
                            ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                            : "bg-red-50 border-red-500 text-red-800"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{option}</span>
                      {selectedAnswer === idx && (
                        <span>{isAnswerCorrect ? "✅" : "❌"}</span>
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {answerFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border text-sm font-light leading-relaxed mb-6 ${
                        isAnswerCorrect
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}
                    >
                      {answerFeedback}
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedAnswer !== null && (
                  <button
                    onClick={closeQuestion}
                    className={`w-full py-3.5 text-white font-extrabold rounded-2xl shadow-sm text-sm transition-all active:scale-95 cursor-pointer ${
                      isAnswerCorrect ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {isAnswerCorrect ? "¡Avanzar en el Tablero! 🚀" : "Intentar de Nuevo 🔄"}
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory Modal */}
        <AnimatePresence>
          {gameFinished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] p-8 md:p-12 max-w-2xl w-full border-4 border-yellow-400 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-50 via-white to-white pointer-events-none opacity-40"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-yellow-100 border border-yellow-400 rounded-full flex items-center justify-center text-6xl mb-6 animate-bounce">
                    🏆
                  </div>
                  
                  <span className="bg-yellow-100 border border-yellow-200 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    ¡Certificación Oficial!
                  </span>

                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                    ¡Felicidades, Súper Explorador Juanpi!
                  </h3>
                  
                  <p className="text-gray-600 font-light max-w-md mb-6 leading-relaxed text-sm md:text-base">
                    Has completado el Gran Tablero Climático y recolectado todas las insignias de aprendizaje. ¡Ahora eres un experto oficial certificado en los climas de la Tierra!
                  </p>

                  <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl text-rose-950 font-bold text-xs md:text-sm max-w-md mx-auto mb-8 shadow-sm">
                    ❤️ Mensaje de tu papá: "Juanpi, ¡tu papá está demasiado orgulloso de ver cómo aprendes y avanzas paso a paso en el tablero de la vida! Eres mi gran orgullo."
                  </div>

                  <div className="flex gap-2 justify-center mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100 w-full max-w-sm">
                    {questions.map((q, idx) => (
                      <span key={idx} className="text-3xl" title={q.badge}>
                        {q.badge.split(" ")[0]}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
                    <button
                      onClick={resetGame}
                      className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-extrabold rounded-2xl text-sm transition-all active:scale-95 cursor-pointer shadow-md"
                    >
                      Volver a Jugar 🔄
                    </button>
                    <button
                      onClick={() => setGameFinished(false)}
                      className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Cerrar y Ver el Sitio
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ClimaticMemorizeGame = () => {
  const initialCards = [
    { id: 1, pairId: 1, name: "Desierto Cálido", emoji: "🏜️", zone: "warm", info: "Los desiertos son paisajes secos y calientes de la Zona Cálida." },
    { id: 2, pairId: 1, name: "Cactus Adaptado", emoji: "🌵", zone: "warm", info: "Los cactus tienen espinas para almacenar agua y sobrevivir al calor del desierto." },
    { id: 3, pairId: 2, name: "Selva Tropical", emoji: "🌴", zone: "warm", info: "Las selvas de la Zona Cálida tienen gran vegetación y lluvias frecuentes." },
    { id: 4, pairId: 2, name: "Lluvia Tropical", emoji: "🌧️", zone: "warm", info: "La lluvia constante nutre los frondosos bosques y ríos de la selva tropical." },
    { id: 5, pairId: 3, name: "Bosque Templado", emoji: "🌳", zone: "temperate", info: "Los bosques de la Zona Templada son el hogar de robles y animales diversos." },
    { id: 6, pairId: 3, name: "Cuatro Estaciones", emoji: "🍂", zone: "temperate", info: "En la Zona Templada se viven intensamente el otoño, invierno, primavera y verano." },
    { id: 7, pairId: 4, name: "Alta Montaña", emoji: "🏔️", zone: "temperate", info: "Las altas cumbres representan un clima frío azonal muy particular." },
    { id: 8, pairId: 4, name: "Frío de Altura", emoji: "❄️", zone: "temperate", info: "A mayor altura, la atmósfera retiene menos calor y la temperatura desciende." },
    { id: 9, pairId: 5, name: "Tundra Ártica", emoji: "🐻‍❄️", zone: "cold", info: "La tundra es el reino helado del norte donde habita el oso polar." },
    { id: 10, pairId: 5, name: "Polo Norte", emoji: "🧊", zone: "cold", info: "El Polo Norte está compuesto de hielo marino rodeado de continentes helados." },
    { id: 11, pairId: 6, name: "Glaciar Antártico", emoji: "🐧", zone: "cold", info: "La Antártica es un continente rocoso cubierto por un gigantesco manto de hielo." },
    { id: 12, pairId: 6, name: "Polo Sur", emoji: "❄️", zone: "cold", info: "El Polo Sur es el desierto helado más frío, ventoso y seco de nuestro planeta." }
  ];

  const connections = {
    1: {
      title: "🏜️ + 🌵 Adaptación del Desierto",
      desc: "¡Excelente! Los desiertos de la Zona Cálida son sumamente secos. Para no perder agua, los cactus tienen espinas en lugar de hojas anchas y guardan el agua dentro de sus troncos carnosos."
    },
    2: {
      title: "🌴 + 🌧️ La Vida en la Selva",
      desc: "¡Grandioso! Cerca de la línea del Ecuador hace calor todo el año y llueve casi a diario. Esto crea selvas tropicales súper húmedas llenas de árboles gigantes y miles de animales."
    },
    3: {
      title: "🌳 + 🍂 El Ciclo de las Estaciones",
      desc: "¡Perfecto! En la Zona Templada los rayos solares llegan con inclinación moderada que varía en el año, haciendo que la vegetación cambie por completo en otoño, invierno, primavera y verano."
    },
    4: {
      title: "🏔️ + ❄️ Clima de Alta Montaña",
      desc: "¡Brillante! A mayor altitud en las cordilleras, el aire se vuelve delgado y la temperatura baja drásticamente. ¡Es como viajar verticalmente a los polos fríos!"
    },
    5: {
      title: "🐻‍❄️ + 🧊 El Reino del Ártico",
      desc: "¡Excelente! El Polo Norte o Ártico es un océano cubierto por banquisa de hielo marino. Es el hogar del oso polar, que cuenta con una densa capa de grasa bajo su piel para protegerse."
    },
    6: {
      title: "🐧 + ❄️ La Gélida Antártica",
      desc: "¡Asombroso! El Polo Sur es un inmenso continente montañoso cubierto por kilómetros de glaciares. Es la zona más fría de la Tierra, donde reinan los pingüinos y las orcas."
    }
  };

  const [cards, setCards] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [activeMatchPair, setActiveMatchPair] = useState<number | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const shuffle = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startNewGame = () => {
    setCards(shuffle(initialCards.map(c => ({ ...c, flipped: false }))));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setShowMatchModal(false);
    setActiveMatchPair(null);
    setGameFinished(false);
  };

  React.useEffect(() => {
    startNewGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (
      selected.length >= 2 || 
      selected.includes(index) || 
      matched.includes(cards[index].pairId) ||
      showMatchModal
    ) return;

    soundFX.playClick();
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const firstCard = cards[newSelected[0]];
      const secondCard = cards[newSelected[1]];

      if (firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setMatched(prev => [...prev, firstCard.pairId]);
          setActiveMatchPair(firstCard.pairId);
          setShowMatchModal(true);
          setSelected([]);
          
          if (matched.length + 1 === 6) {
            setGameFinished(true);
            soundFX.playVictory();
          } else {
            soundFX.playSuccess();
          }
        }, 600);
      } else {
        soundFX.playFailure();
        setTimeout(() => {
          setSelected([]);
        }, 1500);
      }
    }
  };

  const stars = moves <= 9 ? "⭐⭐⭐" : moves <= 14 ? "⭐⭐" : "⭐";

  return (
    <div className="bg-[#f0f9ff] border border-blue-100 rounded-[32px] p-6 md:p-10 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-blue-50 shadow-sm">
        <div className="text-left">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-blue-950 mb-1">
            🔍 Relaciones Climáticas de la Tierra
          </h3>
          <p className="text-xs text-blue-800 font-light leading-relaxed max-w-md">
            ¡No busques dos figuras iguales! Encuentra el **paisaje** y su **elemento o adaptación** correspondiente. ¡Aprende jugando!
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] text-blue-800 uppercase tracking-widest font-extrabold block">Movimientos</span>
            <span className="text-2xl font-black text-blue-950">{moves}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-blue-800 uppercase tracking-widest font-extrabold block">Calificación</span>
            <span className="text-xl tracking-wide">{stars}</span>
          </div>
          <button
            onClick={startNewGame}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            Reiniciar Juego 🔄
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
        {cards.map((card, idx) => {
          const isSelected = selected.includes(idx);
          const isMatched = matched.includes(card.pairId);
          const isFlipped = isSelected || isMatched;

          let zoneBorder = "border-gray-200";
          let zoneBg = "bg-white";
          if (isFlipped) {
            if (card.zone === "warm") {
              zoneBorder = "border-orange-400";
              zoneBg = "bg-orange-50/70 text-orange-950";
            } else if (card.zone === "temperate") {
              zoneBorder = "border-teal-400";
              zoneBg = "bg-teal-50/70 text-teal-950";
            } else {
              zoneBorder = "border-blue-400";
              zoneBg = "bg-blue-50/70 text-blue-950";
            }
          }

          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              className={`h-[130px] md:h-[160px] rounded-2xl border-2 cursor-pointer transition-all duration-300 transform relative flex items-center justify-center ${
                isSelected ? "ring-4 ring-blue-300" : ""
              } ${zoneBorder} ${zoneBg}`}
            >
              <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white transition-opacity duration-300 ${isFlipped ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                <Compass className="w-8 h-8 animate-pulse mb-1 text-blue-200" />
                <span className="text-[9px] uppercase tracking-widest font-extrabold text-blue-100">Explorar</span>
              </div>

              <div className={`absolute inset-0 flex flex-col items-center justify-center p-3 text-center transition-opacity duration-300 ${isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <span className="text-4xl md:text-5xl mb-2">{card.emoji}</span>
                <span className="text-[10px] md:text-xs font-bold leading-tight line-clamp-2">{card.name}</span>
                <span className="text-[8px] uppercase tracking-wider opacity-60 font-semibold mt-1">
                  {card.zone === "warm" ? "Zona Cálida" : card.zone === "temperate" ? "Zona Templada" : "Zona Fría"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showMatchModal && activeMatchPair !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-blue-100 shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto animate-bounce">
                🎉
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2 inline-block">
                ¡Pareja Educativa Encontrada!
              </span>
              <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900 mb-4">
                {(connections as any)[activeMatchPair].title}
              </h3>
              <p className="text-gray-700 text-sm font-light leading-relaxed mb-6">
                {(connections as any)[activeMatchPair].desc}
              </p>
              <button
                onClick={() => setShowMatchModal(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-sm text-sm transition-all active:scale-95 cursor-pointer"
              >
                Seguir Buscando Parejas 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameFinished && !showMatchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full border-4 border-blue-400 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white pointer-events-none opacity-40"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-5xl mb-4 animate-bounce">
                  🏆
                </div>
                
                <span className="bg-blue-100 border border-blue-200 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  ¡Memoria de Explorador!
                </span>

                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                  ¡Excelente Trabajo, Juanpi!
                </h3>
                
                <p className="text-gray-600 font-light mb-4 leading-relaxed text-sm">
                  Has completado el Memorice Climático con **{moves} movimientos** y obtuviste una calificación de **{stars}**. ¡Tus conexiones geográficas son impecables!
                </p>

                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-950 font-bold text-xs max-w-sm mx-auto mb-6 shadow-sm">
                  ❤️ Mensaje de tu papá: "¡Qué gran memoria, Juanpi! Tu papá te ama con todo el corazón y celebra cada uno de tus descubrimientos con una sonrisa gigante."
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={startNewGame}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-sm transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    Volver a Jugar 🔄
                  </button>
                  <button
                    onClick={() => setGameFinished(false)}
                    className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Cerrar y Regresar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClimaticDressingSimulator = () => {
  const missions = [
    {
      id: 1,
      name: "Expedición al Desierto de Atacama 🏜️",
      zone: "warm",
      desc: "Clima extremadamente seco y caliente de día (más de 35°C), con radiación solar altísima.",
      requirements: {
        head: "Sombrero de sol ligero 👒",
        torso: "Polera de algodón 👕",
        legs: "Short veraniego 🩳",
        feet: "Chalas veraniegas 🩴",
        extras: ["Bloqueador solar 🧴", "Gafas de sol 🕶️", "Cantimplora con agua 💧"]
      },
      evaluation: (equipped: any) => {
        let score = 0;
        let reasons = [];
        
        if (equipped.head === "Sombrero de sol ligero 👒") { score += 20; } else { reasons.push("⚠️ Tu cabeza está desprotegida frente a la radiación solar extrema."); }
        if (equipped.torso === "Polera de algodón 👕") { score += 20; } else if (equipped.torso === "Parka térmica gruesa 🧥") { reasons.push("⚠️ ¡La parka te hará sudar y deshidratarte al instante en el desierto!"); } else { reasons.push("⚠️ Necesitas ropa de torso fresca y transpirable."); }
        if (equipped.legs === "Short veraniego 🩳") { score += 20; } else { reasons.push("⚠️ Los pantalones gruesos te darán demasiado calor."); }
        if (equipped.feet === "Chalas veraniegas 🩴" || equipped.feet === "Zapatillas deportivas 👟") { score += 20; } else { reasons.push("⚠️ Las botas de nieve pesadas sobre la arena caliente te cansarán."); }
        
        const hasSunscreen = equipped.extras.includes("Bloqueador solar 🧴");
        const hasWater = equipped.extras.includes("Cantimplora con agua 💧");
        if (hasSunscreen && hasWater) { score += 20; } else { reasons.push("⚠️ ¡Vital! Olvidaste el bloqueador solar o la cantimplora para hidratarte."); }

        return { score, reasons };
      }
    },
    {
      id: 2,
      name: "Aventura en la Selva del Amazonas 🌴",
      zone: "warm",
      desc: "Clima caluroso (30°C) y sumamente húmedo, con lluvias tropicales repentinas y muchos mosquitos.",
      requirements: {
        head: "Sombrero de sol ligero 👒",
        torso: "Polera de algodón 👕",
        legs: "Short veraniego 🩳",
        feet: "Zapatillas deportivas 👟",
        extras: ["Repelente de insectos 🦟", "Impermeable de lluvia 🧥", "Cantimplora con agua 💧"]
      },
      evaluation: (equipped: any) => {
        let score = 0;
        let reasons = [];

        if (equipped.head === "Sombrero de sol ligero 👒") { score += 20; } else { reasons.push("⚠️ Tu cabeza necesita protección ligera del sol húmedo."); }
        if (equipped.torso === "Polera de algodón 👕") { score += 20; } else { reasons.push("⚠️ El torso debe estar fresco en este clima tropical caluroso."); }
        if (equipped.legs === "Short veraniego 🩳" || equipped.legs === "Jeans cómodos 👖") { score += 20; } else { reasons.push("⚠️ La ropa de pierna debe permitirte caminar cómodo en la humedad."); }
        if (equipped.feet === "Zapatillas deportivas 👟") { score += 20; } else if (equipped.feet === "Chalas veraniegas 🩴") { reasons.push("⚠️ ¡Peligro! Las chalas no protegen tus pies del lodo y las alimañas del suelo."); } else { reasons.push("⚠️ Necesitas zapatillas cerradas cómodas."); }
        
        const hasRepellent = equipped.extras.includes("Repelente de insectos 🦟");
        const hasRaincoat = equipped.extras.includes("Impermeable de lluvia 🧥");
        if (hasRepellent && hasRaincoat) { score += 20; } else { reasons.push("⚠️ ¡Cuidado! Olvidaste protegerte de los mosquitos o de la intensa lluvia tropical."); }

        return { score, reasons };
      }
    },
    {
      id: 3,
      name: "Paseo por el Valle Central de Chile 🌳",
      zone: "temperate",
      desc: "Clima templado cambiante (18°C) con llovizna ocasional de media estación.",
      requirements: {
        head: "Ninguno",
        torso: "Cortavientos ligero 🧥",
        legs: "Jeans cómodos 👖",
        feet: "Zapatillas deportivas 👟",
        extras: ["Paraguas ☔", "Cantimplora con agua 💧"]
      },
      evaluation: (equipped: any) => {
        let score = 0;
        let reasons = [];

        score += 20;
        if (equipped.torso === "Cortavientos ligero 🧥") { score += 20; } else if (equipped.torso === "Parka térmica gruesa 🧥") { reasons.push("⚠️ La parka térmica es muy abrigada para 18°C."); } else { reasons.push("⚠️ Necesitas una chaqueta intermedia para protegerte de la brisa templada."); }
        if (equipped.legs === "Jeans cómodos 👖") { score += 20; } else { reasons.push("⚠️ Los shorts te dejarán desprotegido si baja la temperatura por la tarde."); }
        if (equipped.feet === "Zapatillas deportivas 👟") { score += 20; } else { reasons.push("⚠️ Calzado cerrado cómodo es ideal para caminar por el valle."); }
        
        const hasUmbrella = equipped.extras.includes("Paraguas ☔");
        if (hasUmbrella) { score += 20; } else { reasons.push("⚠️ ¡Sorpresa! Si empieza a lloviznar te mojarás por no llevar paraguas."); }

        return { score, reasons };
      }
    },
    {
      id: 4,
      name: "Exploración a la Alta Cordillera 🏔️",
      zone: "temperate",
      desc: "Alta montaña con clima frío de altura (menos de 5°C), viento fuerte y nieve en las cumbres.",
      requirements: {
        head: "Gorro de lana polar 🧦",
        torso: "Parka térmica gruesa 🧥",
        legs: "Pantalón térmico 👖",
        feet: "Botas de nieve 🥾",
        extras: ["Gafas de esquí 🥽", "Cantimplora con agua 💧"]
      },
      evaluation: (equipped: any) => {
        let score = 0;
        let reasons = [];

        if (equipped.head === "Gorro de lana polar 🧦") { score += 20; } else { reasons.push("⚠️ Perderás calor por la cabeza. ¡Se necesita gorro abrigador!"); }
        if (equipped.torso === "Parka térmica gruesa 🧥") { score += 20; } else { reasons.push("⚠️ Un torso desprotegido en la cordillera puede provocar hipotermia."); }
        if (equipped.legs === "Pantalón térmico 👖") { score += 20; } else { reasons.push("⚠️ Se requieren pantalones gruesos y abrigados."); }
        if (equipped.feet === "Botas de nieve 🥾") { score += 20; } else { reasons.push("⚠️ Calzado con tracción y aislamiento es obligatorio en la nieve."); }
        
        const hasGoggles = equipped.extras.includes("Gafas de esquí 🥽");
        if (hasGoggles) { score += 20; } else { reasons.push("⚠️ ¡La ceguera de la nieve es peligrosa! Necesitas gafas de esquí para la radiación blanca."); }

        return { score, reasons };
      }
    },
    {
      id: 5,
      name: "Investigación en la Antártica 🧊",
      zone: "cold",
      desc: "Zona Fría polar. Temperaturas extremas bajo cero (-25°C), ventiscas heladas y glaciares gigantes.",
      requirements: {
        head: "Gorro de lana polar 🧦",
        torso: "Parka térmica gruesa 🧥",
        legs: "Pantalón térmico 👖",
        feet: "Botas de nieve 🥾",
        extras: ["Gafas de esquí 🥽", "Cantimplora con agua 💧"]
      },
      evaluation: (equipped: any) => {
        let score = 0;
        let reasons = [];

        if (equipped.head === "Gorro de lana polar 🧦") { score += 20; } else { reasons.push("⚠️ ¡El viento polar te congelará las orejas! Ponte el gorro térmico."); }
        if (equipped.torso === "Parka térmica gruesa 🧥") { score += 20; } else { reasons.push("⚠️ ¡Vital! En la Antártica es obligatoria la parka impermeable y aislante."); }
        if (equipped.legs === "Pantalón térmico 👖") { score += 20; } else { reasons.push("⚠️ Los shorts o jeans delgados congelarán tus piernas."); }
        if (equipped.feet === "Botas de nieve 🥾") { score += 20; } else { reasons.push("⚠️ ¡Tus pies sufrirán congelamiento con zapatillas normales o chalas!"); }
        
        const hasGoggles = equipped.extras.includes("Gafas de esquí 🥽");
        if (hasGoggles) { score += 20; } else { reasons.push("⚠️ Necesitas gafas polarizadas de esquí frente al reflejo cegador del hielo."); }

        return { score, reasons };
      }
    }
  ];

  const items = {
    head: [
      { name: "Sombrero de sol ligero 👒", type: "head", label: "Sombrero de Sol" },
      { name: "Gorro de lana polar 🧦", type: "head", label: "Gorro Térmico" },
      { name: "Ninguno", type: "head", label: "Sin Sombrero" }
    ],
    torso: [
      { name: "Polera de algodón 👕", type: "torso", label: "Polera Ligera" },
      { name: "Cortavientos ligero 🧥", type: "torso", label: "Chaqueta Cortavientos" },
      { name: "Parka térmica gruesa 🧥", type: "torso", label: "Parka Extrema" }
    ],
    legs: [
      { name: "Short veraniego 🩳", type: "legs", label: "Pantalón Corto" },
      { name: "Jeans cómodos 👖", type: "legs", label: "Pantalones Mezclilla" },
      { name: "Pantalón térmico 👖", type: "legs", label: "Pantalón Nieve" }
    ],
    feet: [
      { name: "Chalas veraniegas 🩴", type: "feet", label: "Sandalias Abiertas" },
      { name: "Zapatillas deportivas 👟", type: "feet", label: "Zapatillas Cómodas" },
      { name: "Botas de nieve 🥾", type: "feet", label: "Botas de Nieve" }
    ],
    extras: [
      { name: "Bloqueador solar 🧴", type: "extras", label: "Bloqueador Solar" },
      { name: "Gafas de sol 🕶️", type: "extras", label: "Gafas de Sol" },
      { name: "Cantimplora con agua 💧", type: "extras", label: "Cantimplora" },
      { name: "Repelente de insectos 🦟", type: "extras", label: "Repelente Mosquitos" },
      { name: "Impermeable de lluvia 🧥", type: "extras", label: "Poncho Lluvia" },
      { name: "Paraguas ☔", type: "extras", label: "Paraguas Compacto" },
      { name: "Gafas de esquí 🥽", type: "extras", label: "Gafas de Nieve" }
    ]
  };

  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [equipped, setEquipped] = useState({
    head: "Ninguno",
    torso: "Polera de algodón 👕",
    legs: "Jeans cómodos 👖",
    feet: "Zapatillas deportivas 👟",
    extras: [] as string[]
  });
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [reasons, setReasons] = useState<string[]>([]);

  const handleEquip = (category: string, itemName: string) => {
    soundFX.playClick();
    if (category === "extras") {
      setEquipped(prev => {
        const alreadyHas = prev.extras.includes(itemName);
        let newExtras = [];
        if (alreadyHas) {
          newExtras = prev.extras.filter(x => x !== itemName);
        } else {
          if (prev.extras.length >= 3) {
            newExtras = [...prev.extras.slice(1), itemName];
          } else {
            newExtras = [...prev.extras, itemName];
          }
        }
        return { ...prev, extras: newExtras };
      });
    } else {
      setEquipped(prev => ({ ...prev, [category]: itemName }));
    }
  };

  const runExpedition = () => {
    const mission = missions[currentMissionIdx];
    const { score, reasons } = mission.evaluation(equipped);
    setScore(score);
    setReasons(reasons);
    setShowResult(true);

    if (score === 100) {
      soundFX.playVictory();
    } else if (score >= 60) {
      soundFX.playSuccess();
    } else {
      soundFX.playFailure();
    }
  };

  const changeMission = () => {
    soundFX.playClick();
    setCurrentMissionIdx(prev => (prev + 1) % missions.length);
    setShowResult(false);
  };

  const mission = missions[currentMissionIdx];

  return (
    <div className="bg-[#fffbeb] border border-amber-100 rounded-[32px] p-6 md:p-10 relative overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        <div className="bg-white rounded-2xl p-6 border border-amber-50 shadow-sm flex flex-col justify-between">
          <div className="text-left">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4 inline-block">
              🗺️ Destino de Exploración
            </span>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2">
              {mission.name}
            </h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
              {mission.desc}
            </p>

            <div className="bg-amber-50/50 border border-amber-100/60 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[220px]">
              <div className="text-6xl mb-4 animate-bounce">🤠</div>
              <h4 className="text-sm font-bold text-amber-900 mb-4">Juanpi el Explorador</h4>
              
              <div className="grid grid-cols-2 gap-3 w-full text-xs text-gray-700 font-semibold bg-white p-4 rounded-xl border border-amber-100 text-left">
                <div>🧢 Cabeza: <span className="font-light text-gray-600 block">{equipped.head}</span></div>
                <div>🧥 Torso: <span className="font-light text-gray-600 block">{equipped.torso}</span></div>
                <div>👖 Piernas: <span className="font-light text-gray-600 block">{equipped.legs}</span></div>
                <div>👟 Pies: <span className="font-light text-gray-600 block">{equipped.feet}</span></div>
              </div>

              <div className="w-full mt-3 text-xs text-gray-700 font-semibold bg-white p-3 rounded-xl border border-amber-100 text-center">
                🎒 Accesorios en Mochila (Máx 3):
                <div className="flex flex-wrap gap-1.5 justify-center mt-1.5 min-h-[24px]">
                  {equipped.extras.length === 0 ? (
                    <span className="text-[10px] text-gray-400 font-light italic">¡Mochila Vacía!</span>
                  ) : (
                    equipped.extras.map((ex, i) => (
                      <span key={i} className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-md text-[10px]">
                        {ex}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={changeMission}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
            >
              Cambiar Destino 🔄
            </button>
            <button
              onClick={runExpedition}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              ¡Iniciar Expedición! 🚀
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-amber-50 shadow-sm flex flex-col justify-between text-left">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                👕 El Guardarropa Climático
              </h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-extrabold mb-4">
                Toca las prendas para vestir a tu explorador
              </p>
            </div>

            <div>
              <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider block mb-2">👒 Gorros y Sombreros:</span>
              <div className="flex flex-wrap gap-2">
                {items.head.map((it, i) => (
                  <button
                    key={i}
                    onClick={() => handleEquip("head", it.name)}
                    className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      equipped.head === it.name
                        ? "bg-amber-100 border-amber-400 text-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {it.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider block mb-2">👕 Abrigo y Torso:</span>
              <div className="flex flex-wrap gap-2">
                {items.torso.map((it, i) => (
                  <button
                    key={i}
                    onClick={() => handleEquip("torso", it.name)}
                    className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      equipped.torso === it.name
                        ? "bg-amber-100 border-amber-400 text-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {it.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider block mb-2">👖 Pantalones:</span>
              <div className="flex flex-wrap gap-2">
                {items.legs.map((it, i) => (
                  <button
                    key={i}
                    onClick={() => handleEquip("legs", it.name)}
                    className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      equipped.legs === it.name
                        ? "bg-amber-100 border-amber-400 text-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {it.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider block mb-2">👟 Zapatos:</span>
              <div className="flex flex-wrap gap-2">
                {items.feet.map((it, i) => (
                  <button
                    key={i}
                    onClick={() => handleEquip("feet", it.name)}
                    className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      equipped.feet === it.name
                        ? "bg-amber-100 border-amber-400 text-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {it.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-amber-900 font-extrabold uppercase tracking-wider block mb-2">🎒 Accesorios (Elige hasta 3):</span>
              <div className="flex flex-wrap gap-2">
                {items.extras.map((it, i) => {
                  const isSelected = equipped.extras.includes(it.name);
                  return (
                    <button
                      key={i}
                      onClick={() => handleEquip("extras", it.name)}
                      className={`px-3 py-1.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-100 border-amber-400 text-amber-900"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {it.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-amber-100 shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto animate-bounce">
                  🧭
                </div>
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2 inline-block">
                  Evaluación de Supervivencia
                </span>
                <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900">
                  Resultado de la Misión
                </h3>
              </div>

              <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-extrabold block mb-1">Puntaje de Acomodación</span>
                <span className="text-3xl font-black text-amber-600">{score}%</span>
                
                <div className="w-full h-3.5 bg-gray-200 rounded-full overflow-hidden mt-2.5">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${score >= 80 ? "from-emerald-400 to-green-500" : score >= 50 ? "from-yellow-400 to-amber-500" : "from-red-400 to-pink-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="mb-6 max-h-[160px] overflow-y-auto space-y-2 text-xs font-light text-gray-700 leading-relaxed text-left bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                {score === 100 ? (
                  <div className="text-emerald-800 font-semibold text-center flex flex-col items-center gap-2 py-4">
                    <span>🌟 ¡EXPEDICIÓN PERFECTA! 🌟</span>
                    <span className="font-light text-gray-700">Juanpi está excelentemente preparado para el clima. Su vestimenta y accesorios equilibran frescura, protección solar, hidratación y aislamiento térmico según amerite el destino. ¡Eres un meteorólogo de nivel doctoral!</span>
                    <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-950 font-bold text-xs leading-relaxed max-w-sm">
                      ❤️ Mensaje de tu papá: "¡Maleta lista! Tu papá sabe que llegarás muy lejos en todos tus viajes y estudios. ¡Te amo infinito, campeón!"
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-amber-900 block mb-2">Consejos del Guía del Clima:</span>
                    <ul className="space-y-2">
                      {reasons.map((re, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span>{re}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResult(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                >
                  Modificar Ropa 👕
                </button>
                {score < 100 && (
                  <button
                    onClick={() => {
                      const req = mission.requirements;
                      setEquipped({
                        head: req.head || "Ninguno",
                        torso: req.torso,
                        legs: req.legs,
                        feet: req.feet,
                        extras: req.extras
                      });
                      setShowResult(false);
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Auto-Vestir Perfecto 🧥
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClimaticMapPainter = () => {
  const [selectedBrush, setSelectedBrush] = useState<"cold" | "temperate" | "warm" | null>(null);
  
  // 5 bands from North to South:
  // Band 0: Polar North (cold)
  // Band 1: Temperate North (temperate)
  // Band 2: Warm Central (warm)
  // Band 3: Temperate South (temperate)
  // Band 4: Polar South (cold)
  const [bandTypes, setBandTypes] = useState<(string | null)[]>([null, null, null, null, null]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState<string[]>([]);

  const handleBandClick = (index: number) => {
    if (selectedBrush === null) return;
    soundFX.playClick();
    setBandTypes(prev => {
      const next = [...prev];
      next[index] = selectedBrush;
      return next;
    });
  };

  const getBandColor = (type: string | null) => {
    if (type === "cold") return "rgba(59, 130, 246, 0.75)"; // Blue 500
    if (type === "temperate") return "rgba(16, 185, 129, 0.75)"; // Emerald 500
    if (type === "warm") return "rgba(249, 115, 22, 0.75)"; // Orange 500
    return "rgba(248, 250, 252, 0.4)"; // Ocean slate
  };

  const validateMap = () => {
    const correctAnswers = ["cold", "temperate", "warm", "temperate", "cold"];
    let errors: string[] = [];
    
    if (bandTypes[0] !== correctAnswers[0]) {
      errors.push("❌ Zona Fría del Norte: La franja desde el Círculo Polar Ártico hasta el Polo Norte debe ser de color Azul (Zona Fría).");
    }
    if (bandTypes[1] !== correctAnswers[1]) {
      errors.push("❌ Zona Templada del Norte: La franja entre el Círculo Polar Ártico y el Trópico de Cáncer debe ser de color Verde (Zona Templada).");
    }
    if (bandTypes[2] !== correctAnswers[2]) {
      errors.push("❌ Zona Cálida Central: La franja central entre los trópicos (cruzada por la Línea del Ecuador) debe ser de color Naranja (Zona Cálida).");
    }
    if (bandTypes[3] !== correctAnswers[3]) {
      errors.push("❌ Zona Templada del Sur: La franja entre el Trópico de Capricornio y el Círculo Polar Antártico debe ser de color Verde (Zona Templada).");
    }
    if (bandTypes[4] !== correctAnswers[4]) {
      errors.push("❌ Zona Fría del Sur: La franja desde el Círculo Polar Antártico hasta el Polo Sur (la Antártica) debe ser de color Azul (Zona Fría).");
    }

    if (errors.length === 0) {
      setIsCorrect(true);
      soundFX.playVictory();
    } else {
      setIsCorrect(false);
      setFeedback(errors);
      soundFX.playFailure();
    }
    setShowResult(true);
  };

  const resetMap = () => {
    setBandTypes([null, null, null, null, null]);
    setShowResult(false);
    setIsCorrect(false);
    setSelectedBrush(null);
  };

  const autoSolve = () => {
    setBandTypes(["cold", "temperate", "warm", "temperate", "cold"]);
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-[#f0fdf4] border border-green-100 rounded-[32px] p-6 md:p-10 relative overflow-hidden">
      
      <div className="grid md:grid-cols-4 gap-8 items-stretch">
        
        {/* Left Column: Instructions and Brush Selection */}
        <div className="md:col-span-1 bg-white rounded-2xl p-6 border border-green-50 shadow-sm flex flex-col justify-between text-left">
          <div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-4 inline-block">
              🗺️ Examen de Cartografía
            </span>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              El Pintor del Mapamundi
            </h3>
            <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
              ¡Prepárate para tu evaluación real! Selecciona un pincel de color y haz clic sobre las diferentes franjas del planisferio para colorear las zonas climáticas de la Tierra.
            </p>

            {/* Brushes Selection */}
            <div className="space-y-3">
              <span className="text-[10px] text-green-900 font-extrabold uppercase tracking-wider block">Elige tu Pincel:</span>
              
              <button
                onClick={() => setSelectedBrush("cold")}
                className={`w-full p-3.5 rounded-xl border-2 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  selectedBrush === "cold"
                    ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm scale-[1.02]"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>❄️ Pincel Zona Fría</span>
                <span className="w-5 h-5 bg-blue-500 rounded-full border border-white" />
              </button>

              <button
                onClick={() => setSelectedBrush("temperate")}
                className={`w-full p-3.5 rounded-xl border-2 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  selectedBrush === "temperate"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm scale-[1.02]"
                    : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>🌳 Pincel Zona Templada</span>
                <span className="w-5 h-5 bg-emerald-500 rounded-full border border-white" />
              </button>

              <button
                onClick={() => setSelectedBrush("warm")}
                className={`w-full p-3.5 rounded-xl border-2 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer ${
                  selectedBrush === "warm"
                    ? "bg-orange-50 border-orange-500 text-orange-900 shadow-sm scale-[1.02]"
                    : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>☀️ Pincel Zona Cálida</span>
                <span className="w-5 h-5 bg-orange-500 rounded-full border border-white" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <button
              onClick={validateMap}
              className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl text-xs transition-all active:scale-95 cursor-pointer shadow-md"
            >
              ¡Validar Mapamundi! 🗺️
            </button>
            <button
              onClick={resetMap}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-all active:scale-95 cursor-pointer"
            >
              Limpiar Todo 🔄
            </button>
          </div>
        </div>

        {/* Right Columns: The Map */}
        <div className="md:col-span-3 bg-white rounded-2xl p-6 border border-green-50 shadow-sm flex flex-col justify-between">
          <div className="w-full relative">
            
            {/* Legend / Info top */}
            <div className="flex items-center justify-between mb-4 text-xs text-gray-500 font-semibold bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span>Pincel Activo: {selectedBrush === "cold" ? "🔵 Azul (Zona Fría)" : selectedBrush === "temperate" ? "🟢 Verde (Zona Templada)" : selectedBrush === "warm" ? "🟠 Naranja (Zona Cálida)" : "🧹 Ninguno (Selecciona un pincel)"}</span>
              <button
                onClick={autoSolve}
                className="text-[10px] text-green-700 hover:underline font-extrabold cursor-pointer"
              >
                Ayuda de Dibujo 💡
              </button>
            </div>

            {/* SVG Canvas Map */}
            <div className="relative w-full aspect-[2/1] bg-sky-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-inner">
              <svg viewBox="0 0 800 400" className="w-full h-full select-none">
                
                {/* Background Grid Lines */}
                <g stroke="rgba(0,0,0,0.03)" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="100" y1="0" x2="100" y2="400" />
                  <line x1="200" y1="0" x2="200" y2="400" />
                  <line x1="300" y1="0" x2="300" y2="400" />
                  <line x1="400" y1="0" x2="400" y2="400" />
                  <line x1="500" y1="0" x2="500" y2="400" />
                  <line x1="600" y1="0" x2="600" y2="400" />
                  <line x1="700" y1="0" x2="700" y2="400" />
                </g>

                {/* Clickable paint rects (Bands) */}
                
                {/* Band 0: Polar North */}
                <rect
                  x="0" y="0" width="800" height="60"
                  fill={getBandColor(bandTypes[0])}
                  onClick={() => handleBandClick(0)}
                  className="cursor-pointer transition-all duration-300 hover:fill-blue-100/20"
                />

                {/* Band 1: Temperate North */}
                <rect
                  x="0" y="60" width="800" height="90"
                  fill={getBandColor(bandTypes[1])}
                  onClick={() => handleBandClick(1)}
                  className="cursor-pointer transition-all duration-300 hover:fill-emerald-100/10"
                />

                {/* Band 2: Warm Central */}
                <rect
                  x="0" y="150" width="800" height="100"
                  fill={getBandColor(bandTypes[2])}
                  onClick={() => handleBandClick(2)}
                  className="cursor-pointer transition-all duration-300 hover:fill-orange-100/10"
                />

                {/* Band 3: Temperate South */}
                <rect
                  x="0" y="250" width="800" height="90"
                  fill={getBandColor(bandTypes[3])}
                  onClick={() => handleBandClick(3)}
                  className="cursor-pointer transition-all duration-300 hover:fill-emerald-100/10"
                />

                {/* Band 4: Polar South */}
                <rect
                  x="0" y="340" width="800" height="60"
                  fill={getBandColor(bandTypes[4])}
                  onClick={() => handleBandClick(4)}
                  className="cursor-pointer transition-all duration-300 hover:fill-blue-100/20"
                />

                {/* Stylized continent outlines (placed above filled bands to absorb colors beautifully!) */}
                <g fill="rgba(255,255,255,0.7)" stroke="#cbd5e1" strokeWidth="1.5" style={{ pointerEvents: "none" }}>
                  {/* Antarctica */}
                  <path d="M 50,375 L 750,375 L 730,395 L 70,395 Z" />
                  {/* North America */}
                  <path d="M 80,60 L 180,50 L 220,70 L 240,110 L 210,130 L 160,130 L 170,160 L 140,180 L 120,150 L 80,110 Z" />
                  {/* South America */}
                  <path d="M 140,180 L 170,180 L 210,210 L 230,240 L 210,300 L 180,340 L 165,340 L 150,260 L 130,210 Z" />
                  {/* Africa */}
                  <path d="M 380,150 L 440,140 L 480,170 L 490,210 L 440,280 L 415,300 L 405,250 L 375,190 Z" />
                  {/* Europe & Asia */}
                  <path d="M 370,110 L 410,70 L 450,55 L 550,50 L 680,60 L 740,75 L 750,110 L 700,150 L 720,180 L 650,210 L 620,170 L 580,180 L 520,150 L 480,150 L 450,130 Z" />
                  {/* Australia */}
                  <path d="M 640,280 L 700,270 L 720,290 L 700,320 L 650,310 Z" />
                </g>

                {/* Boundaries & Latitude lines (Pedagogical guidelines) */}
                <g stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" style={{ pointerEvents: "none" }}>
                  <line x1="0" y1="60" x2="800" y2="60" />
                  <line x1="0" y1="150" x2="800" y2="150" />
                  <line x1="0" y1="200" x2="800" y2="200" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1.5" />
                  <line x1="0" y1="250" x2="800" y2="250" />
                  <line x1="0" y1="340" x2="800" y2="340" />
                </g>

                {/* Latitude Text Labels on map */}
                <g fill="#475569" fontSize="9" fontWeight="bold" fontFamily="sans-serif" style={{ pointerEvents: "none" }}>
                  <text x="10" y="55">66°33' N - Círculo Polar Ártico ❄️</text>
                  <text x="10" y="145">23°27' N - Trópico de Cáncer ☀️</text>
                  <text x="10" y="195" fill="#ef4444">0° - Línea del Ecuador 🌍</text>
                  <text x="10" y="245">23°27' S - Trópico de Capricornio ☀️</text>
                  <text x="10" y="335">66°33' S - Círculo Polar Antártico ❄️</text>

                  {/* Zone description tags */}
                  <text x="400" y="35" textAnchor="middle" fill="#0f172a" fontSize="10" letterSpacing="1">
                    {bandTypes[0] === "cold" ? "❄️ ZONA FRÍA DEL NORTE" : bandTypes[0] ? "⚠️ ¡COLOR ERRONEO!" : "PULSA PARA COLOREAR POLO NORTE"}
                  </text>
                  <text x="400" y="110" textAnchor="middle" fill="#0f172a" fontSize="10" letterSpacing="1">
                    {bandTypes[1] === "temperate" ? "🌲 ZONA TEMPLADA DEL NORTE" : bandTypes[1] ? "⚠️ ¡COLOR ERRONEO!" : "PULSA PARA COLOREAR NORTE"}
                  </text>
                  <text x="400" y="205" textAnchor="middle" fill="#0f172a" fontSize="10" letterSpacing="1">
                    {bandTypes[2] === "warm" ? "☀️ ZONA CÁLIDA O INTERTROPICAL" : bandTypes[2] ? "⚠️ ¡COLOR ERRONEO!" : "PULSA PARA COLOREAR EQUILIBRIO CENTRAL"}
                  </text>
                  <text x="400" y="300" textAnchor="middle" fill="#0f172a" fontSize="10" letterSpacing="1">
                    {bandTypes[3] === "temperate" ? "🍂 ZONA TEMPLADA DEL SUR" : bandTypes[3] ? "⚠️ ¡COLOR ERRONEO!" : "PULSA PARA COLOREAR SUR"}
                  </text>
                  <text x="400" y="375" textAnchor="middle" fill="#0f172a" fontSize="10" letterSpacing="1">
                    {bandTypes[4] === "cold" ? "❄️ ZONA FRÍA DEL SUR" : bandTypes[4] ? "⚠️ ¡COLOR ERRONEO!" : "PULSA PARA COLOREAR ANTÁRTICA"}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* Validation Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-8 md:p-12 max-w-lg w-full border-4 border-green-500 text-center shadow-2xl relative overflow-hidden"
            >
              {isCorrect ? (
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-100 border border-green-300 rounded-full flex items-center justify-center text-5xl mb-4 animate-bounce">
                    🎓
                  </div>
                  
                  <span className="bg-green-100 border border-green-200 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    ¡Certificación de Excelencia!
                  </span>

                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                    ¡Felicidades, Súper Cartógrafo Juanpi!
                  </h3>
                  
                  <p className="text-gray-600 font-light mb-8 leading-relaxed text-sm">
                    Has dibujado y clasificado con 100% de exactitud las zonas climáticas de la Tierra en el planisferio, respetando todas las líneas de latitud delimitadoras. ¡Estás completamente listo para tu prueba real!
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={resetMap}
                      className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-2xl text-sm transition-all active:scale-95 cursor-pointer shadow-md"
                    >
                      Volver a Pintar 🔄
                    </button>
                    <button
                      onClick={() => setShowResult(false)}
                      className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Cerrar y Ver Mapa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-100 border border-red-300 rounded-full flex items-center justify-center text-4xl mb-4 animate-pulse">
                    ✏️
                  </div>
                  
                  <span className="bg-red-100 border border-red-200 text-red-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    ¡Ajustes de Cartografía Requeridos!
                  </span>

                  <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 leading-tight text-center">
                    Casi lo tienes, Juanpi
                  </h3>

                  <p className="text-gray-600 font-light mb-6 text-xs text-center">
                    Revisa las franjas señaladas para corregir los colores antes de tu evaluación:
                  </p>

                  <div className="w-full text-left space-y-2 mb-6 max-h-[160px] overflow-y-auto bg-red-50/50 p-4 rounded-xl border border-red-100">
                    {feedback.map((err, i) => (
                      <div key={i} className="text-xs text-red-800 font-medium">
                        {err}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => setShowResult(false)}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl text-xs transition-all active:scale-95 cursor-pointer shadow-md"
                    >
                      Corregir Mapamundi ✏️
                    </button>
                    <button
                      onClick={() => {
                        autoSolve();
                        setShowResult(false);
                      }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Mostrar Correcto 💡
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Climatic Crossword Game ---
// [Crucigrama interactivo de Juanpi]
// Integración del skill "puzzle-activity-planner" adaptado para niños de 3° Básico

const ClimaticCrosswordGame = () => {
  const WORDS = [
    {
      id: "ecuador",
      number: 1,
      word: "ECUADOR",
      clue: "Línea imaginaria cálida que divide la Tierra en dos hemisferios y recibe los rayos del Sol directamente.",
      direction: "horizontal",
      row: 3,
      col: 1,
    },
    {
      id: "oasis",
      number: 2,
      word: "OASIS",
      clue: "Lugar húmedo con agua y vegetación que interrumpe la aridez de los desiertos.",
      direction: "horizontal",
      row: 6,
      col: 2,
    },
    {
      id: "calor",
      number: 3,
      word: "CALOR",
      clue: "Sensación térmica alta y característica constante de la Zona Cálida.",
      direction: "vertical",
      row: 3,
      col: 2,
    },
    {
      id: "desierto",
      number: 4,
      word: "DESIERTO",
      clue: "Paisaje extremadamente seco de la Zona Cálida donde llueve muy poco y destacan los cactus.",
      direction: "vertical",
      row: 3,
      col: 5,
    },
    {
      id: "polos",
      number: 5,
      word: "POLOS",
      clue: "Extremos helados norte y sur del planeta donde se ubican las Zonas Frías.",
      direction: "vertical",
      row: 2,
      col: 6,
    },
  ];

  const GRID_SIZE = 11;

  // Pre-calculate cells map
  const gridData: { [key: string]: { letter: string; numberBadge: number | null; wordIds: string[] } } = {};
  
  WORDS.forEach((w) => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.direction === "horizontal" ? w.row : w.row + i;
      const c = w.direction === "horizontal" ? w.col + i : w.col;
      const key = `${r}-${c}`;
      
      if (!gridData[key]) {
        gridData[key] = { letter: w.word[i], numberBadge: null, wordIds: [] };
      }
      gridData[key].wordIds.push(w.id);
      
      if (i === 0) {
        gridData[key].numberBadge = w.number;
      }
    }
  });

  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [validationResult, setValidationResult] = useState<{ checked: boolean; correct: boolean; errors: string[] }>({
    checked: false,
    correct: false,
    errors: [],
  });

  const focusCell = (r: number, c: number) => {
    const el = document.getElementById(`cell-${r}-${c}`);
    if (el) {
      (el as HTMLInputElement).focus();
      (el as HTMLInputElement).select();
    }
  };

  const handleCellFocus = (r: number, c: number) => {
    setSelectedCell({ r, c });
    const key = `${r}-${c}`;
    const cell = gridData[key];
    if (cell && cell.wordIds.length > 0) {
      if (activeWordId && cell.wordIds.includes(activeWordId)) {
        // Do nothing
      } else {
        setActiveWordId(cell.wordIds[0]);
      }
    }
  };

  const handleCellChange = (r: number, c: number, value: string) => {
    const char = value.toUpperCase().slice(-1);
    if (!/^[A-ZÑ]$/.test(char) && char !== "") return;
    
    soundFX.playClick();
    const key = `${r}-${c}`;
    setInputs(prev => ({ ...prev, [key]: char }));
    
    if (validationResult.checked) {
      setValidationResult({ checked: false, correct: false, errors: [] });
    }

    if (char !== "" && activeWordId) {
      const activeWord = WORDS.find(w => w.id === activeWordId);
      if (activeWord) {
        const idx = activeWord.direction === "horizontal" 
          ? c - activeWord.col 
          : r - activeWord.row;
        if (idx < activeWord.word.length - 1) {
          const nextR = activeWord.direction === "horizontal" ? r : r + 1;
          const nextC = activeWord.direction === "horizontal" ? c + 1 : c;
          setTimeout(() => focusCell(nextR, nextC), 10);
        }
      }
    }
  };

  const handleKeyDown = (r: number, c: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const key = `${r}-${c}`;
      if (!inputs[key] && activeWordId) {
        const activeWord = WORDS.find(w => w.id === activeWordId);
        if (activeWord) {
          const idx = activeWord.direction === "horizontal" 
            ? c - activeWord.col 
            : r - activeWord.row;
          if (idx > 0) {
            const prevR = activeWord.direction === "horizontal" ? r : r - 1;
            const prevC = activeWord.direction === "horizontal" ? c - 1 : c;
            focusCell(prevR, prevC);
          }
        }
      }
    } else if (e.key === "ArrowUp") {
      if (r > 0 && gridData[`${r-1}-${c}`]) focusCell(r-1, c);
    } else if (e.key === "ArrowDown") {
      if (r < GRID_SIZE - 1 && gridData[`${r+1}-${c}`]) focusCell(r+1, c);
    } else if (e.key === "ArrowLeft") {
      if (c > 0 && gridData[`${r}-${c-1}`]) focusCell(r, c-1);
    } else if (e.key === "ArrowRight") {
      if (c < GRID_SIZE - 1 && gridData[`${r}-${c+1}`]) focusCell(r, c+1);
    }
  };

  const handleClueClick = (w: typeof WORDS[0]) => {
    soundFX.playClick();
    setActiveWordId(w.id);
    focusCell(w.row, w.col);
  };

  const validateCrossword = () => {
    let allCorrect = true;
    const errors: string[] = [];

    Object.keys(gridData).forEach((key) => {
      const cell = gridData[key];
      const userInput = (inputs[key] || "").trim().toUpperCase();
      if (userInput !== cell.letter) {
        allCorrect = false;
      }
    });

    WORDS.forEach((w) => {
      let wordComplete = true;
      for (let i = 0; i < w.word.length; i++) {
        const r = w.direction === "horizontal" ? w.row : w.row + i;
        const c = w.direction === "horizontal" ? w.col + i : w.col;
        const key = `${r}-${c}`;
        const val = (inputs[key] || "").trim().toUpperCase();
        if (val !== w.word[i]) {
          wordComplete = false;
        }
      }
      if (!wordComplete) {
        errors.push(`La palabra vertical/horizontal Nº ${w.number} aún tiene letras incorrectas o vacías.`);
      }
    });

    setValidationResult({
      checked: true,
      correct: allCorrect,
      errors,
    });

    if (allCorrect) {
      setShowVictory(true);
      soundFX.playVictory();
    } else {
      soundFX.playFailure();
    }
  };

  const autoSolve = () => {
    const solvedInputs: { [key: string]: string } = {};
    Object.keys(gridData).forEach((key) => {
      solvedInputs[key] = gridData[key].letter;
    });
    setInputs(solvedInputs);
    setValidationResult({ checked: false, correct: false, errors: [] });
  };

  const resetGame = () => {
    setInputs({});
    setValidationResult({ checked: false, correct: false, errors: [] });
    setActiveWordId(null);
    setSelectedCell(null);
  };

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-2xl border border-gray-100 max-w-5xl mx-auto my-8 text-left">
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100 mb-8 flex flex-col md:flex-row gap-6 items-center">
        <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-3xl shadow-sm border border-purple-200">
          🧩
        </div>
        <div>
          <h3 className="text-xl font-serif font-black text-purple-950 mb-1">
            El Súper Crucigrama de Juanpi
          </h3>
          <p className="text-sm text-purple-900/80 font-light leading-relaxed">
            Completa las 5 palabras clave de las Zonas Climáticas. Haz clic en las pistas o en las celdas directamente, escribe con tu teclado y ¡pon a prueba tus conocimientos de geógrafo!
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-gray-100 p-4 md:p-6 rounded-[2.5rem] border-4 border-gray-200 shadow-inner max-w-full overflow-auto">
            <div 
              className="grid grid-cols-11 gap-1 md:gap-1.5 w-[330px] h-[330px] md:w-[440px] md:h-[440px]"
              style={{ userSelect: "none" }}
            >
              {Array.from({ length: GRID_SIZE }).map((_, r) => (
                Array.from({ length: GRID_SIZE }).map((_, c) => {
                  const key = `${r}-${c}`;
                  const cell = gridData[key];
                  const hasLetter = !!cell;
                  
                  if (!hasLetter) {
                    return (
                      <div 
                        key={key} 
                        className="bg-gray-900/90 rounded-md border border-gray-950/20 shadow-sm"
                      />
                    );
                  }

                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const isInActiveWord = activeWordId && cell.wordIds.includes(activeWordId);
                  const isWrong = validationResult.checked && inputs[key] && inputs[key] !== cell.letter;

                  return (
                    <div 
                      key={key} 
                      className={`relative aspect-square flex items-center justify-center rounded-xl font-black text-base md:text-xl transition-all cursor-pointer shadow-md ${
                        isSelected 
                          ? "ring-4 ring-purple-600 bg-purple-50 shadow-purple-200/50 scale-105 z-10" 
                          : isInActiveWord 
                          ? "bg-yellow-100 border-2 border-yellow-400 text-yellow-950" 
                          : isWrong
                          ? "bg-red-50 border-2 border-red-500 text-red-700 animate-pulse"
                          : "bg-white border border-gray-200 hover:border-purple-300 text-gray-950"
                      }`}
                      onClick={() => focusCell(r, c)}
                    >
                      {cell.numberBadge !== null && (
                        <span className="absolute top-0.5 left-0.5 text-[8px] md:text-[10px] font-black text-gray-500">
                          {cell.numberBadge}
                        </span>
                      )}

                      <input
                        id={`cell-${r}-${c}`}
                        type="text"
                        maxLength={1}
                        value={inputs[key] || ""}
                        onChange={(e) => handleCellChange(r, c, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(r, c, e)}
                        onFocus={() => handleCellFocus(r, c)}
                        className="w-full h-full text-center bg-transparent border-none outline-none focus:ring-0 uppercase p-0 font-extrabold select-all cursor-pointer"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mt-6 w-full max-w-md">
            <button
              onClick={validateCrossword}
              className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
            >
              🔍 Comprobar Respuestas
            </button>
            <button
              onClick={autoSolve}
              className="py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
            >
              💡 Auto-Resolver
            </button>
            <button
              onClick={resetGame}
              className="py-3 px-4 bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-700 font-extrabold rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1"
            >
              🔄 Reiniciar
            </button>
          </div>

          {validationResult.checked && (
            <div className="w-full max-w-md mt-6">
              {validationResult.correct ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold text-center">
                  🎉 ¡Excelente! Has resuelto todo el crucigrama perfectamente.
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs font-bold text-left space-y-1">
                  <div className="font-extrabold">✏️ Aún hay errores por corregir:</div>
                  {validationResult.errors.slice(0, 3).map((err, i) => (
                    <div key={i} className="font-light">• {err}</div>
                  ))}
                  {validationResult.errors.length > 3 && (
                    <div className="font-light">• ¡Y algunos errores más! Sigue intentando.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100/50">
            <h4 className="text-lg font-serif font-black text-purple-900 mb-4 flex items-center gap-2">
              <span className="text-xl">➡️</span> Pistas Horizontales
            </h4>
            <div className="space-y-4">
              {WORDS.filter(w => w.direction === "horizontal").map((w) => {
                const isActive = activeWordId === w.id;
                return (
                  <div 
                    key={w.id} 
                    onClick={() => handleClueClick(w)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive 
                        ? "bg-purple-600 border-purple-700 text-white shadow-md scale-102" 
                        : "bg-white border-gray-100 text-gray-700 hover:bg-purple-50 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isActive ? "bg-white text-purple-700" : "bg-purple-100 text-purple-800"
                      }`}>
                        {w.number}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {w.word.length} letras
                      </span>
                    </div>
                    <p className={`text-xs md:text-sm font-light leading-relaxed ${isActive ? "text-purple-50" : "text-gray-600"}`}>
                      {w.clue}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50">
            <h4 className="text-lg font-serif font-black text-blue-900 mb-4 flex items-center gap-2">
              <span className="text-xl">⬇️</span> Pistas Verticales
            </h4>
            <div className="space-y-4">
              {WORDS.filter(w => w.direction === "vertical").map((w) => {
                const isActive = activeWordId === w.id;
                return (
                  <div 
                    key={w.id} 
                    onClick={() => handleClueClick(w)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive 
                        ? "bg-blue-600 border-blue-700 text-white shadow-md scale-102" 
                        : "bg-white border-gray-100 text-gray-700 hover:bg-blue-50 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isActive ? "bg-white text-blue-700" : "bg-blue-100 text-blue-800"
                      }`}>
                        {w.number}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {w.word.length} letras
                      </span>
                    </div>
                    <p className={`text-xs md:text-sm font-light leading-relaxed ${isActive ? "text-blue-50" : "text-gray-600"}`}>
                      {w.clue}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVictory && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white max-w-xl w-full rounded-[40px] p-8 md:p-12 text-center shadow-2xl relative border-8 border-purple-500/20 overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-200/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="text-7xl mb-6 animate-bounce">🏆🧩</div>
              
              <span className="bg-purple-100 text-purple-800 text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-widest inline-block mb-4">
                Misión Completada
              </span>
              
              <h3 className="text-4xl md:text-5xl font-serif font-black text-gray-900 leading-tight mb-4">
                ¡Felicidades, Súper Crucigramista Juanpi!
              </h3>
              
              <p className="text-gray-600 font-light leading-relaxed mb-6 text-sm md:text-base">
                Has descifrado todas las palabras clave sobre las zonas climáticas de nuestro planeta. ¡Tu bitácora científica ahora brilla más que nunca!
              </p>

              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-950 font-bold text-xs max-w-sm mx-auto mb-8 shadow-sm text-center">
                ❤️ Mensaje de tu papá: "¡Descifraste todas las palabras, mi pequeño sabio! Tu papá te abraza muy fuerte y está inmensamente orgulloso de tu inteligencia."
              </div>

              <div className="bg-purple-50 rounded-3xl p-6 border border-purple-100 text-left mb-8">
                <h4 className="font-extrabold text-purple-950 text-sm mb-3">Bitácora de Palabras Descubiertas:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-purple-800">
                  <div>📍 1. ECUADOR</div>
                  <div>🌴 2. OASIS</div>
                  <div>🔥 3. CALOR</div>
                  <div>🌵 4. DESIERTO</div>
                  <div>❄️ 5. POLOS</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowVictory(false)}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-3xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-purple-500/20"
              >
                Continuar Explorando 🧭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Juego 5: Sopa de Letras Climática ---
const ClimaticWordSearchGame = () => {
  const WORD_LIST = [
    { id: "CALIDA", word: "CALIDA", label: "CÁLIDA", icon: "☀️", clue: "Zona donde los rayos del Sol llegan directos y hace calor." },
    { id: "TEMPLADA", word: "TEMPLADA", label: "TEMPLADA", icon: "🍃", clue: "Zona con estaciones del año muy marcadas y clima moderado." },
    { id: "FRIA", word: "FRIA", label: "FRÍA", icon: "❄️", clue: "Zona de bajas temperaturas cerca de los polos norte y sur." },
    { id: "DESIERTO", word: "DESIERTO", label: "DESIERTO", icon: "🌵", clue: "Clima extremadamente seco de la zona cálida con arena y cactus." },
    { id: "SELVA", word: "SELVA", label: "SELVA", icon: "🌴", clue: "Bosque tropical muy húmedo y lluvioso lleno de animales." },
    { id: "POLAR", word: "POLAR", label: "POLAR", icon: "🧊", clue: "Clima extremadamente helado típico de los polos de la Tierra." },
    { id: "SOL", word: "SOL", label: "SOL", icon: "☀️", clue: "Nuestra estrella que entrega luz y calor a todas las zonas climáticas." },
    { id: "LLUVIA", word: "LLUVIA", label: "LLUVIA", icon: "💧", clue: "Precipitación de agua líquida fundamental para la vida silvestre." }
  ];

  const GRID = [
    ['C', 'A', 'L', 'I', 'D', 'A', 'X', 'P', 'Q', 'Z', 'W'],
    ['Y', 'R', 'O', 'B', 'M', 'C', 'V', 'K', 'T', 'D', 'L'],
    ['T', 'E', 'M', 'P', 'L', 'A', 'D', 'A', 'N', 'E', 'B'],
    ['X', 'W', 'J', 'U', 'A', 'N', 'P', 'I', 'G', 'S', 'U'],
    ['M', 'K', 'F', 'R', 'I', 'A', 'L', 'O', 'R', 'I', 'K'],
    ['L', 'H', 'Y', 'C', 'B', 'G', 'Z', 'U', 'M', 'E', 'O'],
    ['L', 'S', 'E', 'L', 'V', 'A', 'W', 'V', 'N', 'R', 'P'],
    ['U', 'N', 'K', 'R', 'M', 'P', 'T', 'D', 'Q', 'T', 'F'],
    ['V', 'A', 'J', 'P', 'O', 'L', 'A', 'R', 'C', 'O', 'Y'],
    ['I', 'F', 'Q', 'X', 'B', 'Z', 'U', 'K', 'M', 'L', 'W'],
    ['A', 'R', 'T', 'I', 'C', 'O', 'S', 'O', 'L', 'P', 'G']
  ];

  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedStart, setSelectedStart] = useState<{ r: number; c: number } | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<{ r: number; c: number } | null>(null);
  const [showVictory, setShowVictory] = useState(false);

  const handleCellClick = (r: number, c: number) => {
    soundFX.playClick();
    
    // Ignore if cell is already part of a found word
    if (isCellFound(r, c)) return;

    if (!selectedStart) {
      // First click: select start cell
      setSelectedStart({ r, c });
      setSelectedEnd(null);
    } else {
      // Clicked same cell again: deselect
      if (selectedStart.r === r && selectedStart.c === c) {
        setSelectedStart(null);
        setSelectedEnd(null);
        return;
      }

      // Clicked a non-aligned cell (not in same row or column):
      // Treat this as starting a new selection from here!
      if (selectedStart.r !== r && selectedStart.c !== c) {
        setSelectedStart({ r, c });
        setSelectedEnd(null);
        return;
      }

      // Aligned click (same row or col):
      const minR = Math.min(selectedStart.r, r);
      const maxR = Math.max(selectedStart.r, r);
      const minC = Math.min(selectedStart.c, c);
      const maxC = Math.max(selectedStart.c, c);

      let wordAttempt = "";

      if (selectedStart.r === r) {
        for (let col = minC; col <= maxC; col++) {
          wordAttempt += GRID[r][col];
        }
      } else {
        for (let row = minR; row <= maxR; row++) {
          wordAttempt += GRID[row][c];
        }
      }

      const wordAttemptReversed = wordAttempt.split("").reverse().join("");

      const foundWord = WORD_LIST.find(
        (w) =>
          !foundWords.includes(w.id) &&
          (w.word === wordAttempt || w.word === wordAttemptReversed)
      );

      if (foundWord) {
        const nextFoundWords = [...foundWords, foundWord.id];
        setFoundWords(nextFoundWords);
        soundFX.playSuccess();

        if (nextFoundWords.length === WORD_LIST.length) {
          setTimeout(() => {
            setShowVictory(true);
            soundFX.playVictory();
          }, 600);
        }
        // Successfully found: clear selection
        setSelectedStart(null);
        setSelectedEnd(null);
      } else {
        // Not a complete word match yet: update selection end so the children
        // can see the highlighted track as they click letters sequentially!
        setSelectedEnd({ r, c });
      }
    }
  };

  const handleCellHover = (r: number, c: number) => {
    if (selectedStart) {
      if (selectedStart.r === r || selectedStart.c === c) {
        setSelectedEnd({ r, c });
      } else {
        setSelectedEnd(null);
      }
    }
  };

  const isCellSelected = (r: number, c: number) => {
    if (!selectedStart) return false;
    if (selectedStart.r === r && selectedStart.c === c) return true;
    if (!selectedEnd) return false;

    const minR = Math.min(selectedStart.r, selectedEnd.r);
    const maxR = Math.max(selectedStart.r, selectedEnd.r);
    const minC = Math.min(selectedStart.c, selectedEnd.c);
    const maxC = Math.max(selectedStart.c, selectedEnd.c);

    if (selectedStart.r === selectedEnd.r) {
      return r === selectedStart.r && c >= minC && c <= maxC;
    }
    if (selectedStart.c === selectedEnd.c) {
      return c === selectedStart.c && r >= minR && r <= maxR;
    }
    return false;
  };

  const isCellFound = (r: number, c: number) => {
    if (foundWords.includes("CALIDA") && r === 0 && c >= 0 && c <= 5) return true;
    if (foundWords.includes("TEMPLADA") && r === 2 && c >= 0 && c <= 7) return true;
    if (foundWords.includes("FRIA") && r === 4 && c >= 2 && c <= 5) return true;
    if (foundWords.includes("DESIERTO") && c === 9 && r >= 1 && r <= 8) return true;
    if (foundWords.includes("SELVA") && r === 6 && c >= 1 && c <= 5) return true;
    if (foundWords.includes("POLAR") && r === 8 && c >= 3 && c <= 7) return true;
    if (foundWords.includes("SOL") && r === 10 && c >= 6 && c <= 8) return true;
    if (foundWords.includes("LLUVIA") && c === 0 && r >= 5 && r <= 10) return true;

    return false;
  };

  const resetGame = () => {
    soundFX.playClick();
    setFoundWords([]);
    setSelectedStart(null);
    setSelectedEnd(null);
    setShowVictory(false);
  };

  const autoSolve = () => {
    soundFX.playClick();
    const allIds = WORD_LIST.map((w) => w.id);
    setFoundWords(allIds);
    setShowVictory(true);
    soundFX.playVictory();
  };

  return (
    <div className="bg-[#fff1f2] border border-rose-100 rounded-[32px] p-6 md:p-10 relative overflow-hidden">
      <div className="grid md:grid-cols-12 gap-8 items-stretch">
        
        {/* Panel Izquierdo: Cuadrícula */}
        <div className="md:col-span-7 bg-white rounded-2xl p-4 md:p-6 border border-rose-50 shadow-sm flex flex-col justify-between items-center">
          <div className="w-full text-center mb-4">
            <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-2 inline-block">
              🔍 Encuentra y Aprende
            </span>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-1">
              Sopa de Letras Climática
            </h3>
            <p className="text-xs text-gray-500 font-light max-w-md mx-auto leading-relaxed">
              Haz clic en la letra de inicio y luego en la letra final de la palabra. ¡Busca en horizontal y vertical!
            </p>
          </div>

          <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100/50 w-full max-w-[440px] aspect-square grid grid-cols-11 gap-1 md:gap-1.5 touch-manipulation select-none">
            {GRID.map((row, rIdx) =>
              row.map((char, cIdx) => {
                const selected = isCellSelected(rIdx, cIdx);
                const found = isCellFound(rIdx, cIdx);
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handleCellClick(rIdx, cIdx)}
                    onMouseEnter={() => handleCellHover(rIdx, cIdx)}
                    className={`aspect-square w-full rounded-lg text-xs md:text-sm font-bold flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                      found
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 font-black scale-105"
                        : selected
                        ? "bg-rose-500 text-white font-black animate-pulse"
                        : "bg-white hover:bg-rose-100 text-gray-800 border border-rose-100/40"
                    }`}
                  >
                    {char}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex gap-3 w-full mt-4 justify-center">
            <button
              onClick={resetGame}
              className="px-4 py-2 border border-rose-200 text-rose-600 font-bold rounded-xl text-xs hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
            >
              🔄 Reiniciar
            </button>
            <button
              onClick={autoSolve}
              className="px-4 py-2 bg-rose-100 text-rose-800 font-bold rounded-xl text-xs hover:bg-rose-200 active:scale-95 transition-all cursor-pointer"
            >
              🪄 Resolver
            </button>
          </div>
        </div>

        {/* Panel Derecho: Lista */}
        <div className="md:col-span-5 flex flex-col justify-between bg-white rounded-2xl p-6 border border-rose-50 shadow-sm text-left">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-extrabold text-gray-900 text-sm tracking-wide">
                LISTA DE PALABRAS
              </h4>
              <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {foundWords.length} / {WORD_LIST.length} encontradas
              </span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full" 
                style={{ width: `${(foundWords.length / WORD_LIST.length) * 100}%` }}
              />
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {WORD_LIST.map((w) => {
                const found = foundWords.includes(w.id);
                return (
                  <div
                    key={w.id}
                    className={`flex flex-col gap-1 p-3 rounded-xl border transition-all duration-300 ${
                      found
                        ? "bg-emerald-50/60 border-emerald-200/60"
                        : "bg-gray-50/50 border-gray-200/50 hover:bg-rose-50/20"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs md:text-sm text-gray-800 flex items-center gap-1.5">
                        <span className="text-base">{w.icon}</span>
                        <span className={found ? "line-through text-gray-400" : ""}>{w.label}</span>
                      </span>
                      {found ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black uppercase">
                          ¡Hallada!
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-bold uppercase">
                          Buscando
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-light leading-relaxed">
                      {w.clue}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Pantalla de Victoria */}
      <AnimatePresence>
        {showVictory && (
          <motion.div 
            className="absolute inset-0 bg-[#fff1f2]/95 backdrop-blur-md z-30 flex items-center justify-center p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white max-w-md w-full rounded-[40px] p-8 md:p-10 shadow-2xl relative border-8 border-rose-500/20 overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-200/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="text-7xl mb-4 animate-bounce">🏆🔍</div>
              
              <span className="bg-rose-100 text-rose-800 text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-widest inline-block mb-3">
                Gran Logro Climático
              </span>
              
              <h3 className="text-2xl md:text-3xl font-serif font-black text-gray-900 leading-tight mb-2">
                ¡Felicidades, Súper Descubridor Juanpi!
              </h3>
              
              <p className="text-gray-600 font-light leading-relaxed mb-4 text-xs md:text-sm">
                Has encontrado todas las palabras de la Tierra y sus climas en la Sopa de Letras. ¡Tus habilidades geográficas son asombrosas!
              </p>

              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-950 font-bold text-xs max-w-sm mx-auto mb-4 shadow-sm text-center">
                ❤️ Mensaje de tu papá: "¡Encontraste todo, Juanpi! Tu papá siempre estará aquí para apoyarte y recordarte que eres capaz de lograr todo lo que te propongas."
              </div>

              <div className="bg-rose-50 rounded-3xl p-5 border border-rose-100 text-left mb-6 text-xs font-bold text-rose-900 space-y-1.5">
                <div className="text-center font-extrabold text-sm mb-2 uppercase tracking-wide">Diploma de Súper Explorador</div>
                <div>👤 Nombre: <span className="font-light text-gray-700">Juanpi el Magnífico</span></div>
                <div>📍 Academia: <span className="font-light text-gray-700">Exploradores de 3º Básico</span></div>
                <div>🎓 Calificación: <span className="font-light text-gray-700">100% Excelente 🌟</span></div>
              </div>
              
              <button
                onClick={resetGame}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-2.5xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-rose-500/20 text-sm"
              >
                Volver a Jugar Sopa 🧭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExplorerGamesHub = () => {
  const [activeTab, setActiveTab] = useState<"board" | "memorize" | "dressup" | "paint" | "puzzle" | "wordsearch">("board");

  return (
    <div id="juegos" className="my-24 max-w-6xl mx-auto px-6 md:px-12 scroll-mt-20">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-pink-100 border border-pink-200 text-pink-800 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          🎮 Centro de Juegos Climáticos
        </span>
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-4">
          Academia de Súper Exploradores
        </h2>
        <p className="text-gray-600 font-light max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          ¡Aprende y pon a prueba tu ingenio! Elige entre seis misiones interactivas diseñadas especialmente para desafiar tus conocimientos geográficos.
        </p>

        {/* Tab Selector */}
        <div className="mt-8 p-1.5 bg-slate-100/60 rounded-3xl border border-slate-200/40 max-w-4xl mx-auto shadow-sm overflow-x-auto whitespace-nowrap backdrop-blur-md">
          <div className="flex justify-center gap-2 bg-white rounded-[calc(24px-0.375rem)] p-2">
            <button
              onClick={() => { setActiveTab("board"); soundFX.playClick(); }}
              className={`flex-1 py-3 px-3 rounded-xl font-display font-bold text-xs md:text-sm transition-spring active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "board"
                  ? "bg-yellow-400 text-gray-950 shadow-md scale-[1.02]"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              🎲 Tablero
            </button>
            <button
              onClick={() => { setActiveTab("memorize"); soundFX.playClick(); }}
              className={`flex-1 py-3 px-3 rounded-xl font-display font-bold text-xs md:text-sm transition-spring active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "memorize"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              🃏 Memorice
            </button>
            <button
              onClick={() => { setActiveTab("dressup"); soundFX.playClick(); }}
              className={`flex-1 py-3 px-3 rounded-xl font-display font-bold text-xs md:text-sm transition-spring active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "dressup"
                  ? "bg-amber-500 text-white shadow-md scale-[1.02]"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              🧥 Vestidor
            </button>
            <button
              onClick={() => { setActiveTab("paint"); soundFX.playClick(); }}
              className={`flex-1 py-3 px-3 rounded-xl font-display font-bold text-xs md:text-sm transition-spring active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "paint"
                  ? "bg-green-600 text-white shadow-md scale-[1.02]"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              🗺️ Pintar Mapa
            </button>
            <button
              onClick={() => { setActiveTab("puzzle"); soundFX.playClick(); }}
              className={`flex-1 py-3 px-3 rounded-xl font-display font-bold text-xs md:text-sm transition-spring active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "puzzle"
                  ? "bg-purple-600 text-white shadow-md scale-[1.02]"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              🧩 Crucigrama
            </button>
            <button
              onClick={() => { setActiveTab("wordsearch"); soundFX.playClick(); }}
              className={`flex-1 py-3 px-3 rounded-xl font-display font-bold text-xs md:text-sm transition-spring active:scale-95 cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === "wordsearch"
                  ? "bg-rose-500 text-white shadow-md scale-[1.02]"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              🔍 Sopa
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "board" ? (
            <ClimaticBoardGame />
          ) : activeTab === "memorize" ? (
            <ClimaticMemorizeGame />
          ) : activeTab === "dressup" ? (
            <ClimaticDressingSimulator />
          ) : activeTab === "paint" ? (
            <ClimaticMapPainter />
          ) : activeTab === "puzzle" ? (
            <ClimaticCrosswordGame />
          ) : (
            <ClimaticWordSearchGame />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());

  const handleToggleMute = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFX.playClick();
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    soundFX.playClick();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-[#faf8f5] text-gray-900 font-sans selection:bg-orange-200 selection:text-orange-900 pb-20 relative min-h-screen overflow-x-hidden">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[10%] left-[-15%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-orange-400/10 to-rose-400/20 glow-orb" />
      <div className="absolute top-[40%] right-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-400/10 to-teal-400/15 glow-orb" />
      <div className="absolute top-[75%] left-[-20%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-blue-400/15 to-indigo-500/15 glow-orb" />
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-teal-400 to-blue-600 origin-left z-50 shadow-sm"
        style={{ scaleX }}
      />

      {/* Premium Sticky Navigation Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo / Title */}
          <div 
            onClick={() => scrollToSection("inicio")} 
            className="flex items-center gap-2.5 cursor-pointer font-serif font-bold text-gray-900 group"
          >
            <div className="bg-orange-100 group-hover:bg-orange-200 text-orange-600 p-1.5 rounded-xl transition-all shadow-sm">
              <Sun size={20} className="animate-spin-slow" />
            </div>
            <span className="text-sm md:text-base tracking-tight font-extrabold">
              El Viaje del Sol <span className="text-orange-500 font-black">de Juanpi ☀️</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-200/30">
            <button
              onClick={() => scrollToSection("inicio")}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-950 rounded-full hover:bg-white/80 transition-all cursor-pointer flex items-center gap-1"
            >
              🏠 Inicio
            </button>
            <button
              onClick={() => scrollToSection("simulador")}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-950 rounded-full hover:bg-white/80 transition-all cursor-pointer flex items-center gap-1"
            >
              🧭 Simulador
            </button>
            <button
              onClick={() => scrollToSection("calida")}
              className="px-4 py-2 text-xs font-bold text-orange-700 hover:bg-orange-50 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              ☀️ Cálida
            </button>
            <button
              onClick={() => scrollToSection("templada")}
              className="px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              🍃 Templada
            </button>
            <button
              onClick={() => scrollToSection("fria")}
              className="px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-full transition-all cursor-pointer flex items-center gap-1"
            >
              ❄️ Fría
            </button>
            <button
              onClick={() => scrollToSection("juegos")}
              className="px-4 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1"
            >
              🎮 Academia
            </button>

            {/* Mute/Unmute sound engine toggle button */}
            <button
              onClick={handleToggleMute}
              className={`ml-2 p-2 rounded-full border transition-all cursor-pointer ${
                isMuted 
                  ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100" 
                  : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
              }`}
              title={isMuted ? "Activar Sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </nav>

          {/* Mobile Sound + Menu Control */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isMuted 
                  ? "bg-red-50 border-red-200 text-red-500" 
                  : "bg-emerald-50 border-emerald-200 text-emerald-600"
              }`}
              title={isMuted ? "Activar Sonido" : "Silenciar"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              <div className="space-y-1.5">
                <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white shadow-xl overflow-hidden text-left"
            >
              <div className="p-4 space-y-2">
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  🏠 Inicio de la Expedición
                </button>
                <button
                  onClick={() => scrollToSection("simulador")}
                  className="w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  🧭 Simulador Solar
                </button>
                <button
                  onClick={() => scrollToSection("calida")}
                  className="w-full px-4 py-3 text-sm font-bold text-orange-700 hover:bg-orange-50 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  ☀️ Zona Cálida
                </button>
                <button
                  onClick={() => scrollToSection("templada")}
                  className="w-full px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  🍃 Zona Templada
                </button>
                <button
                  onClick={() => scrollToSection("fria")}
                  className="w-full px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  ❄️ Zona Fría
                </button>
                <button
                  onClick={() => scrollToSection("juegos")}
                  className="w-full px-4 py-3.5 text-sm font-extrabold bg-pink-500 text-white rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  🎮 Academia de Juegos
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=2000&q=20')] bg-cover bg-center scroll-mt-20">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-32 -right-32 text-orange-400/30 pointer-events-none"
        >
          <Sun size={600} />
        </motion.div>

        <div className="max-w-4xl z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center mb-6 text-orange-500 gap-3"
          >
            <div className="bg-white shadow-xl rounded-full p-4">
              <Compass size={48} className="animate-spin-slow" />
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="bg-pink-500 text-white font-extrabold text-xs md:text-sm uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-pink-500/20 border-2 border-white animate-pulse"
            >
              👋 ¡Bienvenido Juanpi! 🌟
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-serif font-bold text-gray-900 leading-[0.9] tracking-tight mb-8 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            El Gran Viaje <br/><span className="text-orange-500 italic">del Sol</span>
          </motion.h1>

          <motion.div 
            className="inline-block bg-white/80 backdrop-blur-md rounded-full px-8 py-3 shadow-sm border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-xl md:text-2xl text-gray-700 font-light">
              Una Exploración interactiva por los Climas
            </p>
          </motion.div>

          <motion.div 
            className="mt-8 p-1 bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 rounded-[28px] shadow-xl shadow-pink-500/10 max-w-xl mx-auto overflow-hidden"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-[calc(28px-0.25rem)] p-6 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-rose-500/5 to-red-500/5 pointer-events-none" />
              <div className="text-4xl select-none animate-bounce">💝</div>
              <p className="text-left text-xs md:text-sm text-rose-950 font-display font-extrabold leading-relaxed relative z-10">
                Esta aplicación la creó tu papá con amor para que estudies y seas el mejor de todo el mundo. ❤️
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="animate-bounce text-orange-500 mt-16"
          >
            <div className="text-sm font-semibold uppercase tracking-widest flex flex-col items-center gap-2">
              <span>El Viaje Comienza</span>
              <div className="w-[2px] h-16 bg-gradient-to-b from-orange-400 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro & Didactic Note */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto -mt-10 relative z-20">
        <FadeIn>
          <div className="double-bezel-outer p-2.5 rounded-[40px] w-full">
            <div className="double-bezel-inner rounded-[calc(40px-0.625rem)] p-8 md:p-14 flex flex-col md:flex-row gap-12 items-center">
              <div className="bg-blue-50 w-32 h-32 rounded-full flex items-center justify-center shrink-0 border-8 border-white shadow-inner">
                <Globe2 className="text-blue-500 w-16 h-16 animate-pulse" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900">
                  El Secreto del Clima
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6 font-light">
                  ¡Explorador! No necesitamos aviones, solo curiosidad. Un pequeño secreto antes de volar: el <strong>"tiempo"</strong> es lo que pasa hoy (si llueve ahora), pero el <strong>"clima"</strong> es la personalidad de la región sostenida por años. 
                  <br /><br />
                  En este viaje interactivo, descubre cómo la luz solar da forma a la vida del planeta.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Punto de Partida */}
      <section id="simulador" className="py-32 bg-[#1a1a1a] text-[#f5f2ed] border-y-8 border-orange-500/20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
              Latitud 0°
            </div>
            <h2 className="text-5xl md:text-7xl font-serif font-light mb-12 leading-[1.1]">
              El Corazón <span className="italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Cálido</span> de la Tierra
            </h2>
            
            <div className="mb-20">
              <SunInteractive />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Zona Calida */}
      <section id="calida" className="py-32 bg-[#fffaf5] border-b border-orange-100 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-[0.2em]">
                <ThermometerSun size={18} /> Parada 1
              </span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mt-8 mb-6">La Zona Cálida</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                Entre los trópicos, las estaciones se desdibujan. Explora los tres grandes paisajes tocando cada tarjeta.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {interactiveCards.map((card, idx) => (
              <FadeIn key={card.id} delay={idx * 0.1} className="h-[450px]">
                <div className="group relative w-full h-full rounded-[32px] overflow-hidden shadow-lg cursor-pointer">
                  <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/90 group-hover:bg-black/60 transition-colors duration-500" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-white mb-6 border border-white/30 group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <h3 className="text-4xl font-serif font-bold text-white mb-2">{card.title}</h3>
                    <p className="text-orange-300 font-bold tracking-widest text-sm uppercase mb-4 opacity-100 transform translate-y-0 transition-all">{card.subtitle}</p>
                    <p className="text-gray-200 font-light leading-relaxed h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="double-bezel-outer p-2.5 rounded-[36px] bg-orange-100/30 border-orange-200/40">
              <div className="double-bezel-inner rounded-[calc(36px-0.625rem)] p-8 md:p-12 bg-white/95">
                <h3 className="text-2xl font-display font-bold mb-8 text-gray-900 text-center">Toca para abrir tu maleta tropical 🌴</h3>
                <PackingInteractive />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Zona Templada */}
      <section id="templada" className="py-32 bg-[#eaf4ec] scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="text-center mb-16">
               <span className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-[0.2em]">
                <Compass size={18} /> Parada 2
              </span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-teal-950 mt-8 mb-6">La Zona Templada</h2>
              <p className="text-xl text-teal-800 max-w-2xl mx-auto font-light">
                Los rayos llegan semi-inclinados, creando el equilibrio perfecto. Toca las estaciones para ver cómo se transforma el paisaje.
              </p>
            </div>
            
            <div className="mb-24">
              <SeasonsInteractive />
            </div>
          </FadeIn>

          <FadeIn>
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl h-[400px] group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80" alt="Montaña" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a34]/90 to-transparent" />
              
              <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-center max-w-2xl">
                <div className="bg-white/10 backdrop-blur-md w-max px-4 py-1 rounded-full text-teal-100 text-xs font-bold uppercase tracking-widest border border-white/20 mb-6 flex items-center gap-2">
                  <Info size={14} /> Dato Azonal
                </div>
                <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white text-shadow-sm">La Alta Montaña</h3>
                <p className="text-xl leading-relaxed font-light text-teal-50 drop-shadow-md">
                  ¿Sabías que el clima frío no sólo está en los polos? Al escalar, la atmósfera se vuelve más fina y retiene menos calor. ¡Subir una alta montaña es como viajar cientos de kilómetros hacia el norte, pero en vertical!
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="mt-16">
              <TemperateGearInteractive />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Zona Fría */}
      <section id="fria" className="py-32 bg-[#0a192f] text-[#e2f1f8] relative overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-[#0a192f] to-[#0a192f] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700 text-blue-300 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-[0.2em] mb-8">
                <Snowflake size={18} /> Parada Final
              </span>
              <h2 className="text-5xl md:text-8xl font-serif font-light mb-6">
                El Reino <span className="italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-200">del Hielo</span>
              </h2>
              <p className="text-2xl font-light leading-relaxed text-blue-200/80 max-w-3xl mx-auto">
                Los rayos apenas rozan la superficie. Descubre los misterios de los extremos pasando el ratón sobre los paisajes.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Arctic Card */}
            <FadeIn delay={0.1}>
               <div className="relative group overflow-hidden rounded-[40px] h-[500px] cursor-crosshair border-4 border-blue-900/30">
                <img src="./arctic.png" alt="Ártico" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/70 transition-colors duration-500" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-4xl opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-500">
                    🐻‍❄️
                   </div>
                   <Navigation className="text-blue-300 w-12 h-12 mb-6" />
                   <h3 className="text-4xl font-serif font-bold text-white mb-4">La Tundra (Ártico)</h3>
                   <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500">
                     <p className="text-blue-100 text-lg leading-relaxed mb-4 font-light">
                       Un paisaje helado de vegetación baja. Aquí sobreviven osos polares, morsas e inuits asombrosamente adaptados.
                     </p>
                     <p className="bg-red-500/20 text-red-200 text-sm py-2 px-4 rounded-xl border border-red-500/40 inline-block font-semibold">
                       Mito: Aquí NO hay pingüinos.
                     </p>
                   </div>
                </div>
              </div>
            </FadeIn>
            
            {/* Antarctic Card */}
            <FadeIn delay={0.2}>
               <div className="relative group overflow-hidden rounded-[40px] h-[500px] cursor-crosshair border-4 border-blue-900/30">
                <img src="./antarctic.png" alt="Antártica" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/70 transition-colors duration-500" />
                
                <div className="absolute inset-0 p-10 flex flex-col justify-end transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-4xl opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-500">
                    🐧
                   </div>
                   <Navigation className="text-blue-300 w-12 h-12 mb-6 transform rotate-180" />
                   <h3 className="text-4xl font-serif font-bold text-white mb-4">El Hielo Polar (Antártica)</h3>
                   <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500">
                     <p className="text-blue-100 text-lg leading-relaxed mb-4 font-light">
                       Un continente de roca cubierto de glaciares. Es mucho más frío que el Norte, ¡el verdadero reino del hielo, de los pingüinos y las orcas!
                     </p>
                     <p className="bg-blue-500/20 text-blue-200 text-sm py-2 px-4 rounded-xl border border-blue-500/40 inline-block font-semibold">
                       Naturaleza: Animales con gruesas capas de grasa.
                     </p>
                   </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="mt-16">
              <PolarGearInteractive />
            </div>
          </FadeIn>

        </div>
      </section>

      <ExplorerGamesHub />

      {/* Resumen Final */}
      <section className="py-32 bg-[#f5f2ed] border-t-8 border-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <FadeIn>
            <Compass className="w-20 h-20 text-orange-500 mx-auto mb-8 bg-white p-4 rounded-[2rem] shadow-lg" />
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">¡Haz completado el Viaje!</h2>
            <p className="text-2xl text-gray-600 font-light max-w-3xl mx-auto mb-16 leading-relaxed">
              La Tierra no está coloreada al azar. Es un gran lienzo pintado por la intensidad del Sol y la forma increíble en la que la naturaleza decide adaptarse y prosperar.
            </p>
            
            <div className="bg-gradient-to-r from-orange-100 via-teal-50 to-blue-100 p-10 rounded-[40px] shadow-sm">
              <h3 className="text-2xl font-serif italic text-gray-900 mb-4 font-bold">Bitácora Oficial de Explorador</h3>
              <p className="text-gray-800 text-lg max-w-xl mx-auto font-light">
                Ahora comprendes por qué el mundo se viste de tantos colores y temperaturas. Eres un experto meteorólogo listo para proteger y seguir explorando nuestro planeta.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
      
    </div>
  );
}
