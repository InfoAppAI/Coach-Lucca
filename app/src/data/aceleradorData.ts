// Content of the "Protocolo Acelerador Glúteos 3X VIP" upsell (unlocked by the Hotmart purchase)

export interface NightMove {
  exerciseId: string; // id in ALL_16_EXERCISES (image + technique reference)
  name: string;
  prescription: string;
  howTo: string;
}

export interface NightRoutine {
  id: string;
  title: string;
  focus: string;
  minutes: number;
  rounds: string;
  moves: NightMove[];
}

// Bodyweight only, on the bed or a mat. Rotate A → B → C on training nights.
export const NIGHT_ROUTINES: NightRoutine[] = [
  {
    id: 'noche-a',
    title: 'Noche A · Activación del Glúteo Mayor',
    focus: 'Puentes y bombeos para "encender" el glúteo antes de dormir',
    minutes: 10,
    rounds: '2 vueltas · 30 s de descanso entre ejercicios',
    moves: [
      {
        exerciseId: 'ex-3',
        name: 'Puente de glúteos en el suelo',
        prescription: '15 repeticiones · pausa de 2 s arriba',
        howTo: 'Boca arriba, pies apoyados al ancho de caderas. Empuja con los talones y sube la pelvis apretando los glúteos, sin arquear la espalda baja.',
      },
      {
        exerciseId: 'ex-4',
        name: 'Frog pumps',
        prescription: '20 repeticiones rápidas',
        howTo: 'Junta las plantas de los pies y abre las rodillas. Eleva la pelvis en impulsos cortos, apretando el glúteo en cada subida.',
      },
      {
        exerciseId: 'ex-13',
        name: 'Puente unilateral',
        prescription: '10 repeticiones por pierna',
        howTo: 'Una pierna extendida hacia el techo, la otra apoyada. Sube la pelvis con el talón apoyado sin dejar que la cadera se incline.',
      },
      {
        exerciseId: 'ex-3',
        name: 'Puente isométrico final',
        prescription: '30 segundos sostenidos',
        howTo: 'Quédate arriba en el puente apretando los glúteos y respirando de forma lenta.',
      },
    ],
  },
  {
    id: 'noche-b',
    title: 'Noche B · Glúteo Medio y Curva Lateral',
    focus: 'Trabajo lateral para la parte superior y los costados del glúteo',
    minutes: 10,
    rounds: '2 vueltas · 30 s de descanso entre ejercicios',
    moves: [
      {
        exerciseId: 'ex-11',
        name: 'Almejas (clamshells)',
        prescription: '15 repeticiones por lado · pausa de 3 s arriba',
        howTo: 'De lado, rodillas flexionadas y pies juntos. Abre la rodilla de arriba sin girar la cadera hacia atrás.',
      },
      {
        exerciseId: 'ex-12',
        name: 'Fire hydrant',
        prescription: '12 repeticiones por lado',
        howTo: 'En cuatro apoyos, eleva la rodilla hacia el costado manteniendo los 90°. La espalda queda quieta y recta.',
      },
      {
        exerciseId: 'ex-11',
        name: 'Elevación lateral de pierna acostada',
        prescription: '15 repeticiones por lado',
        howTo: 'De lado con la pierna de arriba recta, súbela un poco hacia atrás llevando el talón primero. Baja lento.',
      },
    ],
  },
  {
    id: 'noche-c',
    title: 'Noche C · Glúteo Inferior y Pliegue',
    focus: 'Patadas y extensiones para la zona baja del glúteo',
    minutes: 10,
    rounds: '2 vueltas · 30 s de descanso entre ejercicios',
    moves: [
      {
        exerciseId: 'ex-10',
        name: 'Patada en cuatro apoyos',
        prescription: '15 repeticiones por pierna',
        howTo: 'En cuatro apoyos, empuja el talón hacia el techo con la rodilla a 90°. No arquees la espalda baja.',
      },
      {
        exerciseId: 'ex-15',
        name: 'Elevación de piernas inversa sobre la cama',
        prescription: '12 repeticiones',
        howTo: 'Boca abajo con la cadera en el borde de la cama y los pies en el suelo. Eleva las piernas juntas hasta la línea del cuerpo y baja controlando.',
      },
      {
        exerciseId: 'ex-13',
        name: 'Puente unilateral con pausa',
        prescription: '8 repeticiones por pierna · pausa de 2 s',
        howTo: 'Igual que el puente unilateral, pero sosteniendo arriba 2 segundos en cada repetición.',
      },
    ],
  },
];

export const NIGHT_ROUTINE_TIPS = [
  'Hazla de 3 a 5 noches por semana, alternando A → B → C.',
  'Termina al menos 30 minutos antes de dormir si sientes que te activa demasiado.',
  'El objetivo es sentir el glúteo trabajando, no los muslos ni la espalda baja. Si duele, para.',
];

export interface LymphaticStep {
  title: string;
  seconds: number;
  instructions: string;
}

// Gentle self-massage in the shower: always toward the lymph nodes (groin, back of the knee)
export const LYMPHATIC_STEPS: LymphaticStep[] = [
  {
    title: 'Abrir el camino (ingles)',
    seconds: 30,
    instructions:
      'Con la palma plana, haz 10 movimientos suaves en la zona de las ingles, como si "empujaras" la piel hacia adentro y arriba. Presión de caricia, no de masaje profundo.',
  },
  {
    title: 'Detrás de las rodillas',
    seconds: 30,
    instructions: 'Con los dedos, 10 bombeos suaves detrás de cada rodilla, siempre hacia arriba.',
  },
  {
    title: 'Muslos hacia arriba',
    seconds: 60,
    instructions:
      'Desde la rodilla hasta la ingle, desliza las dos manos con jabón o aceite en movimientos largos y lentos, cara frontal, lateral e interna. Siempre de abajo hacia arriba.',
  },
  {
    title: 'Glúteos hacia la ingle',
    seconds: 60,
    instructions:
      'Desde la parte baja del glúteo, lleva la piel en círculos suaves hacia los costados y luego hacia la ingle. 1 minuto entre los dos lados.',
  },
  {
    title: 'Cierre con agua',
    seconds: 60,
    instructions:
      'Termina con agua tibia o fresca (nunca muy caliente) recorriendo las piernas de los tobillos hacia arriba. Sécate dando toques, sin frotar.',
  },
];

export const LYMPHATIC_NOTES = {
  expectation:
    'Ayuda a la circulación local y deja la piel con aspecto más liso y menos hinchado. Funciona mejor combinado con el entrenamiento, buena hidratación y suficiente proteína. Los resultados varían en cada persona.',
  safety:
    'No lo hagas si tienes várices dolorosas, trombosis o antecedentes de ella, infección o heridas en la piel, estás embarazada o tienes problemas cardíacos o renales, sin hablar antes con tu médico.',
};

export interface ProteinCombo {
  meal: string;
  combo: string;
  protein: number; // grams, approximate
  why: string;
}

export const PROTEIN_TARGET_TEXT =
  'Para ganar músculo, la referencia más usada es de 1,6 g de proteína por kilo de peso al día, repartidos en 3 a 5 comidas de 25–40 g. Si tienes alguna condición de salud, confirma tu cantidad con un nutricionista.';

export const PROTEIN_COMBOS: ProteinCombo[] = [
  { meal: 'Desayuno', combo: '3 huevos + 2 rebanadas de pan integral + fruta', protein: 25, why: 'Proteína completa y carbohidrato para empezar el día con energía.' },
  { meal: 'Desayuno', combo: 'Yogur griego (200 g) + avena (40 g) + frutos rojos', protein: 26, why: 'Rápido de preparar, alto en proteína y fibra.' },
  { meal: 'Almuerzo', combo: 'Pechuga de pollo (150 g) + arroz + frijoles + ensalada', protein: 45, why: 'La combinación clásica: arroz y frijoles se complementan en aminoácidos.' },
  { meal: 'Almuerzo', combo: 'Atún (1 lata) + papa cocida + vegetales + aceite de oliva', protein: 30, why: 'Proteína magra y carbohidrato para recuperar después de entrenar.' },
  { meal: 'Merienda', combo: 'Queso cottage o requesón (150 g) + 1 fruta', protein: 18, why: 'Proteína de digestión lenta, ideal entre comidas.' },
  { meal: 'Merienda', combo: 'Batido: leche (300 ml) + plátano + 1 cda de mantequilla de maní', protein: 15, why: 'Práctico después del entrenamiento.' },
  { meal: 'Cena', combo: 'Salmón o pescado blanco (150 g) + camote + brócoli', protein: 35, why: 'Proteína y grasas buenas para la recuperación nocturna.' },
  { meal: 'Cena', combo: 'Lentejas (1 taza cocida) + arroz + huevo', protein: 28, why: 'Opción económica: legumbre + cereal + huevo forman proteína completa.' },
];
