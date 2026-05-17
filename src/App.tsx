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
  ChevronRight
} from "lucide-react";

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
      } else {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: true } : g));
        setPackedCount(prev => prev + 1);
        setFeedback(`¡Excelente! ${item.desc}`);
        setFeedbackType("success");
      }
    } else {
      setFeedback(`🚨 ¡Alerta de Calor Absoluto! ${item.desc}`);
      setFeedbackType("error");
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
      } else {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: true } : g));
        setPackedCount(prev => prev + 1);
        setFeedback(`¡Excelente! ${item.desc}`);
        setFeedbackType("success");
      }
    } else {
      setFeedback(`🚨 ¡Alerta de Congelación! ${item.desc}`);
      setFeedbackType("error");
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
      } else {
        setGearList(prev => prev.map(g => g.id === id ? { ...g, packed: true } : g));
        setPackedCount(prev => prev + 1);
        setFeedback(`¡Excelente! ${item.desc}`);
        setFeedbackType("success");
      }
    } else {
      setFeedback(`🚨 ¡Alerta de Ropa Inadecuada! ${item.desc}`);
      setFeedbackType("error");
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
      if (!earnedBadges.includes(question.badge)) {
        setEarnedBadges(prev => [...prev, question.badge]);
      }
    } else {
      setIsAnswerCorrect(false);
      setAnswerFeedback("⚠️ ¡Oh! Esa no es la correcta. ¡Inténtalo de nuevo para aprender!");
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
                  
                  <p className="text-gray-600 font-light max-w-md mb-8 leading-relaxed text-sm md:text-base">
                    Has completado el Gran Tablero Climático y recolectado todas las insignias de aprendizaje. ¡Ahora eres un experto oficial certificado en los climas de la Tierra!
                  </p>

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

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="bg-[#f5f2ed] text-gray-900 font-sans selection:bg-orange-200 selection:text-orange-900 pb-20">
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-teal-400 to-blue-600 origin-left z-50 shadow-sm"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=2000&q=20')] bg-cover bg-center">
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
            className="flex justify-center mb-6 text-orange-500"
          >
            <div className="bg-white shadow-xl rounded-full p-4">
              <Compass size={48} className="animate-spin-slow" />
            </div>
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
          <div className="bg-white rounded-[32px] p-8 md:p-14 shadow-2xl border border-gray-50 flex flex-col md:flex-row gap-12 items-center">
            <div className="bg-blue-50 w-32 h-32 rounded-full flex items-center justify-center shrink-0 border-8 border-white shadow-inner">
              <Globe2 className="text-blue-500 w-16 h-16" />
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
        </FadeIn>
      </section>

      {/* Punto de Partida */}
      <section className="py-32 bg-[#1a1a1a] text-[#f5f2ed] border-y-8 border-orange-500/20">
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
      <section className="py-32 bg-[#fffaf5] border-b border-orange-100">
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
            <div className="bg-orange-50 rounded-[32px] p-8 md:p-12 border border-orange-200">
              <h3 className="text-2xl font-serif font-bold mb-8 text-gray-900 text-center">Toca para abrir tu maleta tropical</h3>
              <PackingInteractive />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Zona Templada */}
      <section className="py-32 bg-[#eaf4ec]">
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
      <section className="py-32 bg-[#0a192f] text-[#e2f1f8] relative overflow-hidden">
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

      <FadeIn>
        <ClimaticBoardGame />
      </FadeIn>

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
