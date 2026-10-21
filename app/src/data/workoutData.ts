import { IMAGES, FALLBACK_IMAGES } from './mockData';

export type ExerciseGroup = 'tension' | 'stretch' | 'lateral' | 'sculpt';

export interface ExerciseItem {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  group: ExerciseGroup;
  groupTitle: string;
  targetMuscle: string;
  secondaryMuscle: string;
  defaultSets: number;
  defaultReps: string;
  recommendedRestSeconds: number;
  recommendedCadence: string; // Ex: '2-2-1-0'
  primaryImageUrl: string;
  fallbackImageUrl: string;
  cueNote: string;
  executionSteps: string[];
  mistakesToAvoid: string[];
  homeAlternative: {
    name: string;
    description: string;
    imageUrl: string;
  };
}

export interface WorkoutGroupMeta {
  id: ExerciseGroup;
  title: string;
  shortTitle: string;
  description: string;
  badge: string;
  emoji: string;
  color: string;
  count: number;
}

export const EXERCISE_GROUPS: WorkoutGroupMeta[] = [
  {
    id: 'tension',
    title: 'Grupo 1: Tensión & Densidad (Acortamiento)',
    shortTitle: 'Tensión & Densidad',
    description: 'Máxima activación del glúteo mayor en contracción pico (Hip Thrust y Puentes)',
    badge: 'Máximo Empuje',
    emoji: '🍑',
    color: '#FF3377',
    count: 4,
  },
  {
    id: 'stretch',
    title: 'Grupo 2: Estiramiento & Proyección (Hipertrofia)',
    shortTitle: 'Estiramiento & Proyección',
    description: 'Tensión mecánica en rango alargado para redondez y pliegue glúteo inferior',
    badge: 'Hipertrofia 3D',
    emoji: '🔥',
    color: '#FF6B00',
    count: 4,
  },
  {
    id: 'lateral',
    title: 'Grupo 3: Curva Lateral & Anti-Hoyuelos (Abducción)',
    shortTitle: 'Curva Lateral',
    description: 'Desarrollo de la cresta superior y glúteo medio para silueta reloj de arena',
    badge: 'Cintura de Avispa',
    emoji: '💎',
    color: '#8000FF',
    count: 4,
  },
  {
    id: 'sculpt',
    title: 'Grupo 4: Escultura 3D, Bombeo & Corrección',
    shortTitle: 'Escultura & Bombeo',
    description: 'Aislamiento metabólico sin fatiga articular para eliminar amnesia glútea',
    badge: 'Pump Extremo',
    emoji: '⚡',
    color: '#00A859',
    count: 4,
  },
];

export const ALL_16_EXERCISES: ExerciseItem[] = [
  // =========================================================================
  // GRUPO 1: TENSIÓN & DENSIDAD (ACORTAMIENTO)
  // =========================================================================
  {
    id: 'ex-1',
    order: 1,
    name: 'Hip Thrust con Pausa Isométrica 2s',
    subtitle: 'Rey biomecánico para volumen y grosor del glúteo mayor',
    group: 'tension',
    groupTitle: 'Tensión & Densidad (Acortamiento)',
    targetMuscle: 'Glúteo Mayor',
    secondaryMuscle: 'Erectores Espinales & Isquios',
    defaultSets: 4,
    defaultReps: '10–12 reps',
    recommendedRestSeconds: 90,
    recommendedCadence: '2-2-1-0 (2s bajada, 2s apriete arriba, 1s subida)',
    primaryImageUrl: '/exercises/ex-1.jpg',
    fallbackImageUrl: '/exercises/ex-1.svg',
    cueNote: 'Empuja fuertemente con los talones y mantén la barbilla pegada al pecho en la cima.',
    executionSteps: [
      'Apoya la espalda media/baja contra el banco firme, justo por debajo de las escápulas.',
      'Coloca la mancuerna o barra acolchada sobre la cresta ilíaca sosteniéndola con ambas manos.',
      'Pies separados al ancho de hombros con puntas orientadas 15° hacia afuera.',
      'Empuja explosivamente desde los talones hasta alinear rodilla, cadera y hombros a 180°.',
      'Aprieta con máxima fuerza durante 2 segundos arriba realizando retroversión pélvica.',
      'Desciende de forma controlada en 2 segundos sin perder la tensión muscular.',
    ],
    mistakesToAvoid: [
      'Arquear la columna lumbar en vez de bascular la pelvis hacia arriba.',
      'Mirar hacia el techo: mantén la mirada al frente hacia tus rodillas en todo momento.',
      'Empujar con la punta de los pies en lugar de los talones.',
    ],
    homeAlternative: {
      name: 'Puente de Glúteos en Suelo con Carga',
      description: 'Acuéstate sobre una colchoneta, dobla rodillas a 90° y eleva cadera apretando 2s.',
      imageUrl: '/exercises/ex-1.svg',
    },
  },
  {
    id: 'ex-2',
    order: 2,
    name: 'Kas Glute Bridge en Banco (Rango Corto)',
    subtitle: 'Aislamiento 100% puro en contracción pico sin involucrar cuádriceps',
    group: 'tension',
    groupTitle: 'Tensión & Densidad (Acortamiento)',
    targetMuscle: 'Glúteo Mayor Superior',
    secondaryMuscle: 'Glúteo Medio Estabilizador',
    defaultSets: 3,
    defaultReps: '12–15 reps',
    recommendedRestSeconds: 75,
    recommendedCadence: '1-2-1-0 (Rango corto continuo con 2s bloqueo)',
    primaryImageUrl: '/exercises/ex-2.jpg',
    fallbackImageUrl: '/exercises/ex-2.svg',
    cueNote: 'A diferencia del Hip Thrust tradicional, solo bajas unos 15-20 cm para no perder jamás la tensión.',
    executionSteps: [
      'Posición idéntica al Hip Thrust con escápulas en banco.',
      'Parte desde la posición más alta con la cadera completamente extendida.',
      'Baja únicamente una cuarta parte del recorrido (hasta que las espinillas sigan verticales).',
      'Vuelve a empujar inmediatamente contrayendo como si quisieras partir una moneda entre los glúteos.',
    ],
    mistakesToAvoid: [
      'Bajar demasiado: el Kas Bridge busca eliminar la extensión de rodilla y enfocarse solo en la cadera.',
      'Perder la respiración diafragmática.',
    ],
    homeAlternative: {
      name: 'Puente en Suelo con Pies Elevados sobre Sofá',
      description: 'Eleva los talones sobre el borde de una silla o sofá para un rango corto de bombeo.',
      imageUrl: '/exercises/ex-2.svg',
    },
  },
  {
    id: 'ex-3',
    order: 3,
    name: 'Puente de Glúteos en el Suelo con Barra o Mancuerna',
    subtitle: 'Fuerza de extensión horizontal sin tensión en rodillas ni espalda',
    group: 'tension',
    groupTitle: 'Tensión & Densidad (Acortamiento)',
    targetMuscle: 'Glúteo Mayor',
    secondaryMuscle: 'Isquiosurales',
    defaultSets: 4,
    defaultReps: '12 reps',
    recommendedRestSeconds: 60,
    recommendedCadence: '2-1-1-0',
    primaryImageUrl: '/exercises/ex-3.jpg',
    fallbackImageUrl: '/exercises/ex-3.svg',
    cueNote: 'Mantén la pelvis neutra y empuja el ombligo hacia tu columna al subir.',
    executionSteps: [
      'Acuéstate boca arriba en la colchoneta con los pies apoyados firmemente.',
      'Coloca el peso sobre tu cadera sujetándolo con firmeza.',
      'Eleva la pelvis hasta crear una línea recta continua entre rodillas y hombros.',
      'Sostén 1 segundo en la cima y desciende rozando el suelo sin descansar.',
    ],
    mistakesToAvoid: [
      'Colocar los pies demasiado lejos de los glúteos (activa demasiado los femorales).',
    ],
    homeAlternative: {
      name: 'Puente en Suelo con Miniband en Rodillas',
      description: 'Añade una banda elástica para forzar una abducción constante durante el ascenso.',
      imageUrl: '/exercises/ex-3.svg',
    },
  },
  {
    id: 'ex-4',
    order: 4,
    name: 'Frog Pumps con Mancuerna en Pelvis',
    subtitle: 'Activación metabólica continua inhibiendo por completo los isquiotibiales',
    group: 'tension',
    groupTitle: 'Tensión & Densidad (Acortamiento)',
    targetMuscle: 'Glúteo Mayor (Pico Contráctil)',
    secondaryMuscle: 'Aductores Externos',
    defaultSets: 3,
    defaultReps: '20 reps bombeo',
    recommendedRestSeconds: 45,
    recommendedCadence: '1-1-1-0 (Ritmo fluido y bombeo constante)',
    primaryImageUrl: '/exercises/ex-4.svg',
    fallbackImageUrl: '/exercises/ex-4.svg',
    cueNote: 'Junta planta con planta de los pies como una rana; esto apaga los femorales y quema el glúteo.',
    executionSteps: [
      'Túmbate boca arriba y junta las plantas de los pies abriendo las rodillas a los lados.',
      'Coloca una mancuerna o disco sobre tu pelvis.',
      'Eleva la cadera apretando con fuerza los glúteos arriba.',
      'Desciende rápido y vuelve a elevarte en ritmo de bombeo constante.',
    ],
    mistakesToAvoid: [
      'Separar los talones o perder el contacto entre las plantas de los pies.',
    ],
    homeAlternative: {
      name: 'Frog Pumps con Banda de Resistencia',
      description: 'Realiza el bombeo sin carga externa concentrándote en el número de repeticiones.',
      imageUrl: '/exercises/ex-4.svg',
    },
  },

  // =========================================================================
  // GRUPO 2: ESTIRAMIENTO & PROYECCIÓN (HIPERTROFIA EXCÉNTRICA)
  // =========================================================================
  {
    id: 'ex-5',
    order: 5,
    name: 'Sentadilla Búlgara Unilateral (Inclinación 30°)',
    subtitle: 'El mejor ejercicio para eliminar asimetrías y redondear la caída del glúteo',
    group: 'stretch',
    groupTitle: 'Estiramiento & Proyección (Hipertrofia)',
    targetMuscle: 'Glúteo Mayor & Femoral',
    secondaryMuscle: 'Cuádriceps',
    defaultSets: 4,
    defaultReps: '10 reps por pierna',
    recommendedRestSeconds: 75,
    recommendedCadence: '3-0-1-0 (3s descenso lento, subida explosiva)',
    primaryImageUrl: '/exercises/ex-5.svg',
    fallbackImageUrl: '/exercises/ex-5.svg',
    cueNote: 'Inclina el torso 30° hacia adelante: esto traslada el 85% de la carga al glúteo de apoyo.',
    executionSteps: [
      'Coloca el empeine de una pierna sobre un banco o sofá detrás de ti.',
      'Da un paso amplio con la pierna delantera para mantener ángulo de 90° al flexionar.',
      'Inclina el torso 30° al frente manteniendo espalda recta.',
      'Desciende lentamente en 3 segundos sintiendo el estiramiento profundo del glúteo.',
      'Empuja con el talón delantero para subir de manera potente.',
    ],
    mistakesToAvoid: [
      'Torso vertical como bailarina (sobrecarga cuádriceps en vez de glúteo).',
      'Dejar que la rodilla delantera caiga hacia adentro.',
    ],
    homeAlternative: {
      name: 'Zancada Estática Trasera (Lunge sin Banco)',
      description: 'Paso largo hacia atrás sin elevar el pie, con torso inclinado hacia adelante.',
      imageUrl: '/exercises/ex-5.svg',
    },
  },
  {
    id: 'ex-6',
    order: 6,
    name: 'Peso Muerto Rumano Unilateral (RDL con Apoyo)',
    subtitle: 'Máxima tensión en estiramiento excéntrico para definir la línea inferior del glúteo',
    group: 'stretch',
    groupTitle: 'Estiramiento & Proyección (Hipertrofia)',
    targetMuscle: 'Glúteo Mayor & Isquiosurales',
    secondaryMuscle: 'Cadena Posterior & Lumbar',
    defaultSets: 3,
    defaultReps: '12 reps por pierna',
    recommendedRestSeconds: 60,
    recommendedCadence: '3-1-1-0 (3 segundos bajando con control total)',
    primaryImageUrl: '/exercises/ex-6.svg',
    fallbackImageUrl: '/exercises/ex-6.svg',
    cueNote: 'Empuja la cadera hacia la pared de atrás manteniendo la espinilla 100% vertical.',
    executionSteps: [
      'Sostén una mancuerna en la mano contraria a la pierna que trabaja.',
      'Apoya la punta del pie trasero como un trípode de apoyo.',
      'Lleva tu cadera hacia atrás realizando bisagra de cadera.',
      'Baja la mancuerna pegada a la pierna hasta justo debajo de la rodilla.',
      'Regresa empujando con el glúteo hacia adelante hasta erguirte.',
    ],
    mistakesToAvoid: [
      'Doblar las rodillas como sentadilla.',
      'Curvar la espalda lumbar hacia adelante.',
    ],
    homeAlternative: {
      name: 'Peso Muerto Rumano Bilateral con Banda',
      description: 'Pisa la banda con ambos pies y realiza la bisagra de cadera contra la resistencia.',
      imageUrl: '/exercises/ex-6.svg',
    },
  },
  {
    id: 'ex-7',
    order: 7,
    name: 'Step-Up Alto en Cajón con Inclinación',
    subtitle: 'Fuerza unilateral y elevación de la caída inferior del glúteo',
    group: 'stretch',
    groupTitle: 'Estiramiento & Proyección (Hipertrofia)',
    targetMuscle: 'Glúteo Mayor',
    secondaryMuscle: 'Glúteo Medio Estabilizador',
    defaultSets: 3,
    defaultReps: '10 reps por pierna',
    recommendedRestSeconds: 60,
    recommendedCadence: '2-1-1-0',
    primaryImageUrl: '/exercises/ex-7.svg',
    fallbackImageUrl: '/exercises/ex-7.svg',
    cueNote: 'No te impulses con el pie del suelo: todo el trabajo debe venir del glúteo de arriba.',
    executionSteps: [
      'Coloca un pie sobre un cajón o silla firme a la altura de tu rodilla.',
      'Inclina el torso ligeramente hacia adelante cargando el peso sobre el talón de arriba.',
      'Sube controladamente sin rebotar con la pierna de abajo.',
      'Baja en 2 segundos completos tocando apenas el suelo antes de la siguiente rep.',
    ],
    mistakesToAvoid: [
      'Impulsarse como con un resorte con el pie del suelo.',
    ],
    homeAlternative: {
      name: 'Step-Up en Escalón de Casa',
      description: 'Usa el primer o segundo escalón de una escalera con paso lento y controlado.',
      imageUrl: '/exercises/ex-7.svg',
    },
  },
  {
    id: 'ex-8',
    order: 8,
    name: 'Sentadilla Sumo Profunda con Mancuerna Pesada',
    subtitle: 'Apertura biomecánica que amplía la base glútea y activa fibras aductoras',
    group: 'stretch',
    groupTitle: 'Estiramiento & Proyección (Hipertrofia)',
    targetMuscle: 'Glúteo Mayor & Aductores',
    secondaryMuscle: 'Femoral',
    defaultSets: 3,
    defaultReps: '12 reps',
    recommendedRestSeconds: 60,
    recommendedCadence: '3-1-1-0',
    primaryImageUrl: '/exercises/ex-8.svg',
    fallbackImageUrl: '/exercises/ex-8.svg',
    cueNote: 'Punteras hacia afuera a 45° y rodillas siguiendo la misma dirección del dedo meñique.',
    executionSteps: [
      'Pies separados bastante más anchos que tus hombros.',
      'Gira las puntas de los pies a 45° hacia afuera.',
      'Sujeta una mancuerna o garrafa pesada entre tus piernas.',
      'Baja verticalmente empujando las rodillas hacia afuera hasta romper el paralelo.',
      'Sube contrayendo los glúteos fuertemente en la cima.',
    ],
    mistakesToAvoid: [
      'Dejar que las rodillas se cierren hacia adentro al levantarte.',
    ],
    homeAlternative: {
      name: 'Sentadilla Sumo con Mochila o Botellón',
      description: 'Usa una mochila cargada con libros sujeta frente al pecho.',
      imageUrl: '/exercises/ex-8.svg',
    },
  },

  // =========================================================================
  // GRUPO 3: CURVA LATERAL & ANTI-HOYUELOS (ABDUCCIÓN)
  // =========================================================================
  {
    id: 'ex-9',
    order: 9,
    name: 'Abducciones en Banco a 45° con Mini Band',
    subtitle: 'Esculpe la curva lateral superior (glúteo medio) y rellena los hoyuelos de la cadera',
    group: 'lateral',
    groupTitle: 'Curva Lateral & Anti-Hoyuelos (Abducción)',
    targetMuscle: 'Glúteo Medio & Menor',
    secondaryMuscle: 'Tensor de la Fascia Lata',
    defaultSets: 3,
    defaultReps: '20 reps con ardor',
    recommendedRestSeconds: 45,
    recommendedCadence: '2-1-2-0 (Control total en apertura y cierre)',
    primaryImageUrl: '/exercises/ex-9.svg',
    fallbackImageUrl: '/exercises/ex-9.svg',
    cueNote: 'Inclínate 45° adelante en el banco: esta angulación aísla el glúteo medio de forma quirúrgica.',
    executionSteps: [
      'Siéntate al borde del banco o silla con la miniband 3 cm por encima de las rodillas.',
      'Inclina tu torso a 45° hacia adelante con la columna neutral.',
      'Abre las rodillas hacia afuera venciendo la elasticidad hasta tu rango máximo.',
      'Sostén 1 segundo con fuerte quemazón y cierra frenando la vuelta elástica.',
    ],
    mistakesToAvoid: [
      'Cerrar las piernas de golpe dejando que la banda te gane.',
    ],
    homeAlternative: {
      name: 'Abducción Sentada en Silla de Comedor',
      description: 'Mismo ejercicio en una silla común con banda elástica alrededor de rodillas.',
      imageUrl: '/exercises/ex-9.svg',
    },
  },
  {
    id: 'ex-10',
    order: 10,
    name: 'Patada de Glúteo en Polea o Banda (Kickback a 30°)',
    subtitle: 'Extensión pura en diagonal que despierta las fibras superiores',
    group: 'lateral',
    groupTitle: 'Curva Lateral & Anti-Hoyuelos (Abducción)',
    targetMuscle: 'Glúteo Mayor Superior',
    secondaryMuscle: 'Glúteo Medio',
    defaultSets: 3,
    defaultReps: '15 reps por pierna',
    recommendedRestSeconds: 45,
    recommendedCadence: '2-1-1-0',
    primaryImageUrl: '/exercises/ex-10.svg',
    fallbackImageUrl: '/exercises/ex-10.svg',
    cueNote: 'Patea ligeramente hacia afuera (30° en diagonal), no recto hacia atrás, para seguir las fibras musculares.',
    executionSteps: [
      'Apoya los brazos firmes en la máquina o respaldo de una silla.',
      'Coloca la tobillera con polea o banda elástica en el tobillo.',
      'Lleva la pierna hacia atrás y ligeramente en diagonal hacia afuera.',
      'Aprieta 1 segundo arriba y regresa sin balancear la espalda baja.',
    ],
    mistakesToAvoid: [
      'Arquear la espalda lumbar para subir más la pierna (el movimiento solo ocurre en la cadera).',
    ],
    homeAlternative: {
      name: 'Patada en 4 Apoyos con Miniband en Colchoneta',
      description: 'En cuadrupedia, patea hacia atrás y arriba con la rodilla estirada.',
      imageUrl: '/exercises/ex-10.svg',
    },
  },
  {
    id: 'ex-11',
    order: 11,
    name: 'Almejas / Clamshells con Miniband en Colchoneta',
    subtitle: 'Rotación externa para la porción alta del glúteo medio sin impacto',
    group: 'lateral',
    groupTitle: 'Curva Lateral & Anti-Hoyuelos (Abducción)',
    targetMuscle: 'Glúteo Medio',
    secondaryMuscle: 'Piriforme & Rotadores Profundos',
    defaultSets: 3,
    defaultReps: '15 reps por lado',
    recommendedRestSeconds: 45,
    recommendedCadence: '2-1-1-0',
    primaryImageUrl: '/exercises/ex-11.svg',
    fallbackImageUrl: '/exercises/ex-11.svg',
    cueNote: 'Mantén los pies juntos pegados y la pelvis apuntando hacia el frente sin rotar hacia atrás.',
    executionSteps: [
      'Acuéstate de lado con las rodillas dobladas a 90° y los talones juntos.',
      'Coloca la miniband sobre tus rodillas.',
      'Abre la rodilla superior hacia el techo manteniendo los talones unidos.',
      'Siente la contracción en la zona alta de la cadera antes de descender suavemente.',
    ],
    mistakesToAvoid: [
      'Rodar la cadera hacia atrás para engañar el rango de movimiento.',
    ],
    homeAlternative: {
      name: 'Clamshells sin Banda con Pausa de 3s',
      description: 'Ideal para principiantes, manteniendo 3 segundos de apriete en cada rep.',
      imageUrl: '/exercises/ex-11.svg',
    },
  },
  {
    id: 'ex-12',
    order: 12,
    name: 'Fire Hydrant / Patada Lateral en Cuadrupedia',
    subtitle: 'Abducción pura en suelo que elimina grasa localizada en flancos',
    group: 'lateral',
    groupTitle: 'Curva Lateral & Anti-Hoyuelos (Abducción)',
    targetMuscle: 'Glúteo Medio & Menor',
    secondaryMuscle: 'Oblicuos & Core',
    defaultSets: 3,
    defaultReps: '15 reps por lado',
    recommendedRestSeconds: 45,
    recommendedCadence: '1-1-2-0',
    primaryImageUrl: '/exercises/ex-12.svg',
    fallbackImageUrl: '/exercises/ex-12.svg',
    cueNote: 'Mantén los brazos firmes y la rodilla doblada a 90° durante toda la trayectoria lateral.',
    executionSteps: [
      'Ponte en cuatro puntos de apoyo sobre la colchoneta con muñecas bajo hombros.',
      'Sin mover la espalda, levanta una rodilla lateralmente hacia arriba como si fueras un perro.',
      'Mantén el ángulo de 90° en la rodilla y aprieta el glúteo lateral en el punto alto.',
      'Baja lentamente sin apoyar del todo antes de la siguiente repetición.',
    ],
    mistakesToAvoid: [
      'Inclinar todo el cuerpo hacia el lado contrario para compensar la falta de fuerza.',
    ],
    homeAlternative: {
      name: 'Fire Hydrant con Miniband Suave',
      description: 'Añade una banda ligera sobre las rodillas para intensificar la contracción.',
      imageUrl: '/exercises/ex-12.svg',
    },
  },

  // =========================================================================
  // GRUPO 4: ESCULTURA 3D, BOMBERO & CORRECCIÓN
  // =========================================================================
  {
    id: 'ex-13',
    order: 13,
    name: 'Puente Glúteo Unilateral con Pierna Elevada a 90°',
    subtitle: 'Fuerza asimétrica que corrige el lado débil y tonifica en tiempo récord',
    group: 'sculpt',
    groupTitle: 'Escultura 3D, Bombeo & Corrección',
    targetMuscle: 'Glúteo Mayor Unilateral',
    secondaryMuscle: 'Estabilizadores Pélvicos',
    defaultSets: 3,
    defaultReps: '12 reps por pierna',
    recommendedRestSeconds: 60,
    recommendedCadence: '2-1-1-0',
    primaryImageUrl: '/exercises/ex-13.svg',
    fallbackImageUrl: '/exercises/ex-13.svg',
    cueNote: 'La pierna libre no se balancea: queda fija apuntando al techo.',
    executionSteps: [
      'Acuéstate sobre la espalda con una rodilla doblada y talón firme en el suelo.',
      'Extiende la otra pierna hacia arriba apuntando al techo.',
      'Empuja el suelo fuertemente con el talón de trabajo hasta alinear tu cadera.',
      'Sostén 1 segundo la máxima contracción y desciende controlada.',
    ],
    mistakesToAvoid: [
      'Desnivelar la pelvis; ambos lados de la cadera deben subir a la misma altura.',
    ],
    homeAlternative: {
      name: 'Puente Unilateral con Pie sobre Cojín',
      description: 'Añade inestabilidad para un mayor reclutamiento de fibras musculares.',
      imageUrl: '/exercises/ex-13.svg',
    },
  },
  {
    id: 'ex-14',
    order: 14,
    name: 'Buenos Días con Banda o Carga Ligera (Good Morning)',
    subtitle: 'Bisagra profunda que esculpe la unión del femoral con la base del glúteo',
    group: 'sculpt',
    groupTitle: 'Escultura 3D, Bombeo & Corrección',
    targetMuscle: 'Glúteo Mayor & Femoral',
    secondaryMuscle: 'Erectores Espinales',
    defaultSets: 3,
    defaultReps: '12 reps',
    recommendedRestSeconds: 60,
    recommendedCadence: '3-1-1-0',
    primaryImageUrl: '/exercises/ex-14.svg',
    fallbackImageUrl: '/exercises/ex-14.svg',
    cueNote: 'Rodillas suaves con ligera flexión mientras el trasero busca tocar la pared de atrás.',
    executionSteps: [
      'De pie con los pies al ancho de hombros y manos detrás de la nuca (o barra ligera sobre trapecios).',
      'Inicia el movimiento empujando la cadera hacia atrás con pecho orgulloso.',
      'Baja el torso hasta que quede casi paralelo al suelo sintiendo el estiramiento glúteo.',
      'Vuelve a la vertical empujando con los glúteos hacia adelante.',
    ],
    mistakesToAvoid: [
      'Redondear la espalda o bajar doblando el cuello.',
    ],
    homeAlternative: {
      name: 'Buenos Días con Banda Pisada y al Cuello',
      description: 'Pisa la banda con los pies y pasa el extremo superior por tus hombros.',
      imageUrl: '/exercises/ex-14.svg',
    },
  },
  {
    id: 'ex-15',
    order: 15,
    name: 'Hiperextensión Inversa en Banco (Reverse Hyper)',
    subtitle: 'Contracción de la parte alta del glúteo con 0% de compresión en las vértebras',
    group: 'sculpt',
    groupTitle: 'Escultura 3D, Bombeo & Corrección',
    targetMuscle: 'Glúteo Mayor Superior',
    secondaryMuscle: 'Lumbares & Femorales',
    defaultSets: 3,
    defaultReps: '15 reps',
    recommendedRestSeconds: 60,
    recommendedCadence: '2-2-1-0 (2 segundos de apriete en la cima)',
    primaryImageUrl: '/exercises/ex-15.svg',
    fallbackImageUrl: '/exercises/ex-15.svg',
    cueNote: 'Junta los talones y elévalos pensando en apretar los glúteos, no en balancear las piernas.',
    executionSteps: [
      'Acuéstate boca abajo sobre un banco alto con las caderas en el borde y piernas colgando.',
      'Sujétate con las manos firmemente del banco.',
      'Eleva ambas piernas juntas hacia atrás hasta que queden alineadas con tu torso.',
      'Aprieta con todas tus fuerzas los glúteos durante 2 segundos completos arriba.',
      'Baja con lentitud resistiendo la gravedad.',
    ],
    mistakesToAvoid: [
      'Usar impulso para lanzar las piernas hacia arriba.',
    ],
    homeAlternative: {
      name: 'Elevación de Piernas Inversa sobre la Cama',
      description: 'Acuéstate boca abajo sobre el borde de una cama firme y realiza la elevación.',
      imageUrl: '/exercises/ex-15.svg',
    },
  },
  {
    id: 'ex-16',
    order: 16,
    name: 'Abducción Seated 3 Ángulos (Drop-Set Final)',
    subtitle: 'El finalizador biomecánico definitivo: agota el 100% de las fibras del glúteo medio',
    group: 'sculpt',
    groupTitle: 'Escultura 3D, Bombeo & Corrección',
    targetMuscle: 'Glúteo Medio (Todas las Porciones)',
    secondaryMuscle: 'Glúteo Menor',
    defaultSets: 3,
    defaultReps: '30 reps (10 en cada ángulo)',
    recommendedRestSeconds: 60,
    recommendedCadence: '1-0-1-0 (Ritmo continuo sin descanso entre ángulos)',
    primaryImageUrl: '/exercises/ex-16.svg',
    fallbackImageUrl: '/exercises/ex-16.svg',
    cueNote: 'Haz 10 reps inclinada hacia adelante, 10 reps con el torso recto y 10 reps inclinada hacia atrás.',
    executionSteps: [
      'Coloca una banda tensa sobre tus rodillas sentada en un banco.',
      'Realiza 10 repeticiones con el torso inclinado a 45° hacia el frente.',
      'Sin parar, ponte con el torso vertical a 90° y realiza 10 repeticiones más.',
      'Inmediatamente reclínate 30° hacia atrás y finaliza con las últimas 10 repeticiones.',
    ],
    mistakesToAvoid: [
      'Descansar entre cada uno de los 3 ángulos: el objetivo es la acumulación de lactato muscular.',
    ],
    homeAlternative: {
      name: 'Abducción 3 Ángulos en Silla con Miniband',
      description: 'Mismo protocolo en cualquier silla de casa cambiando los 3 ángulos de inclinación.',
      imageUrl: '/exercises/ex-16.svg',
    },
  },
];

export interface WorkoutRoutine {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  focus: string;
  level: string;
  estimatedMinutes: number;
  estimatedCalories: number;
  exercises: ExerciseItem[];
}

export const WORKOUT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-gluteos-completo',
    slug: 'gluteos-16',
    title: 'Desafío Completo 16 Estaciones',
    subtitle: 'Los 16 Ejercicios Biomecánicos divididos en 4 Grupos de Escultura',
    focus: '16 Ejercicios · 4 Grupos Biomecánicos',
    level: 'Completo · Todos los Niveles',
    estimatedMinutes: 45,
    estimatedCalories: 350,
    exercises: ALL_16_EXERCISES,
  },
  {
    id: 'routine-gluteos-a',
    slug: 'gluteos-a',
    title: 'Glúteos A: Tensión & Densidad',
    subtitle: 'Foco mecánico en acortamiento y estiramiento del glúteo mayor',
    focus: 'Grupos 1 y 2 (8 Ejercicios)',
    level: 'Intermedio · Progresivo',
    estimatedMinutes: 42,
    estimatedCalories: 280,
    exercises: ALL_16_EXERCISES.slice(0, 8),
  },
  {
    id: 'routine-gluteos-b',
    slug: 'gluteos-b',
    title: 'Glúteos B: Curva Lateral & Escultura',
    subtitle: 'Aislamiento de la cresta superior, abducción y eliminación de hoyuelos',
    focus: 'Grupos 3 y 4 (8 Ejercicios)',
    level: 'Intermedio · Escultura',
    estimatedMinutes: 38,
    estimatedCalories: 260,
    exercises: ALL_16_EXERCISES.slice(8, 16),
  },
];
