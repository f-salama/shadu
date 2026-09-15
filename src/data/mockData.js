// ============================================================================
// شَدْوُ — Mock data for the parent-app prototype.
// Nothing here is fetched from a server: it is generated once, deterministically,
// when this module loads, so charts and tables stay stable across reloads.
// ============================================================================

// Small seeded PRNG (mulberry32) so the "randomized" mock data is reproducible.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1402);

// ----------------------------------------------------------------------------
// Parent account (mock)
// ----------------------------------------------------------------------------
export const parent = {
  name: 'أروى الحربي',
  email: 'arwa.h@example.com',
  phone: '966501234567',
  relation: 'الأم',
};

// ----------------------------------------------------------------------------
// Avatars — simple geometric icons on a pastel background. Deliberately not
// cartoonish or mascot-like, to match the calmer parent-app tone.
// ----------------------------------------------------------------------------
export const avatarOptions = [
  { id: 'wave', label: 'موجة', bg: 'var(--color-primary-100)', fg: 'var(--color-primary-700)' },
  { id: 'leaf', label: 'ورقة', bg: 'var(--color-mint-light)', fg: '#1c6b49' },
  { id: 'star', label: 'نجمة', bg: 'var(--color-amber-pale)', fg: '#8a6100' },
  { id: 'drop', label: 'قطرة', bg: 'var(--color-lavender)', fg: '#5b4a80' },
  { id: 'moon', label: 'هلال', bg: '#dbeafe', fg: '#2952a3' },
  { id: 'mountain', label: 'جبل', bg: '#f0f4f5', fg: '#52646a' },
];

// ----------------------------------------------------------------------------
// Target sound / disorder options (SDP1 scope)
// ----------------------------------------------------------------------------
export const soundOptions = [
  {
    id: 's',
    letter: 'س',
    name: 'صوت السين',
    parentPhrase: 'طفلي يواجه صعوبة في نطق صوت السين، مثل "سمكة" أو "شمس"',
    priority: 'أساسي',
  },
  {
    id: 'k',
    letter: 'ك',
    name: 'صوت الكاف',
    parentPhrase: 'طفلي يواجه صعوبة في نطق صوت الكاف، مثل "كتاب" أو "كوب"',
    priority: 'ثانوي',
  },
];

// ----------------------------------------------------------------------------
// Error types
// ----------------------------------------------------------------------------
export const ERROR_TYPES = {
  omission: { key: 'omission', label: 'حذف الصوت', color: 'var(--color-danger)' },
  substitution: { key: 'substitution', label: 'إبدال الصوت', color: 'var(--color-primary-500)' },
  distortion: { key: 'distortion', label: 'تحريف الصوت', color: 'var(--color-amber)' },
  addition: { key: 'addition', label: 'إضافة صوت', color: '#8b7bc7' },
};

const ERROR_KEYS = ['omission', 'substitution', 'distortion', 'addition'];

// ----------------------------------------------------------------------------
// Word banks per target sound
// ----------------------------------------------------------------------------
const wordBanks = {
  س: ['سمكة', 'سيارة', 'مسجد', 'كأس', 'سرير', 'سلة', 'سكر', 'فرس', 'مقص', 'جرس', 'مدرسة', 'أسد', 'شمس', 'بسكويت', 'سلحفاة'],
  ك: ['كتاب', 'كرة', 'كوب', 'سمك', 'ديك', 'كلب', 'كعكة', 'حديقة', 'كرسي', 'سكين', 'كنبة', 'بركة'],
};

const activityNames = [
  'تسمية الصور',
  'تكرار الكلمات',
  'إكمال الجملة',
  'القراءة الموجهة',
  'المطابقة الصوتية',
];

// ----------------------------------------------------------------------------
// Child profile (mock)
// ----------------------------------------------------------------------------
export const child = {
  id: 'child-1',
  name: 'سلمان',
  nickname: 'سلومي',
  age: 6,
  gender: 'ذكر',
  avatarId: 'leaf',
  targetSound: 'س',
  dateJoined: '2025-06-02',
  therapistNotes:
    'يُظهر سلمان تحسنًا تدريجيًا في نطق صوت السين ضمن الكلمات المفردة، وما زال يحتاج لتعزيز إضافي عند استخدام الصوت داخل الجمل الكاملة. يُنصح بالاستمرار بالتمارين المنزلية القصيرة يوميًا.',
};

// ----------------------------------------------------------------------------
// Practice sessions — 19 sessions across the last ~33 days, oldest → newest.
// Accuracy trends upward with natural noise; error-type mix shifts from
// grosser errors (omission/distortion) early on toward substitution later,
// which is a common clinical pattern as articulation improves.
// ----------------------------------------------------------------------------
const dayOffsets = [33, 30, 28, 26, 24, 22, 20, 18, 16, 15, 13, 11, 10, 8, 6, 5, 3, 2, 1, 0];

function isoDateDaysAgo(offset) {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
}

function weightsForEra(progress) {
  // progress: 0 (oldest) → 1 (most recent)
  if (progress < 0.34) return { omission: 0.3, substitution: 0.3, distortion: 0.3, addition: 0.1 };
  if (progress < 0.7) return { omission: 0.2, substitution: 0.4, distortion: 0.25, addition: 0.15 };
  return { omission: 0.1, substitution: 0.55, distortion: 0.15, addition: 0.2 };
}

function pickWeighted(weights) {
  const r = rand();
  let acc = 0;
  for (const key of ERROR_KEYS) {
    acc += weights[key];
    if (r <= acc) return key;
  }
  return ERROR_KEYS[ERROR_KEYS.length - 1];
}

function buildSession(index, offset, total) {
  const progress = index / (total - 1);
  const base = 54 + 32 * progress;
  const noise = (rand() - 0.5) * 14;
  const accuracy = Math.max(42, Math.min(97, Math.round(base + noise)));

  const attemptsCount = 8 + Math.round(rand() * 3); // 8–11 attempts
  const incorrectCount = Math.max(0, Math.round(((100 - accuracy) / 100) * attemptsCount));
  const weights = weightsForEra(progress);

  const bank = wordBanks[child.targetSound];
  const attempts = [];
  const errorCounts = { omission: 0, substitution: 0, distortion: 0, addition: 0 };

  for (let i = 0; i < attemptsCount; i++) {
    const word = bank[Math.floor(rand() * bank.length)];
    const isError = i < incorrectCount;
    if (isError) {
      const type = pickWeighted(weights);
      errorCounts[type] += 1;
      attempts.push({ word, result: 'incorrect', errorType: type });
    } else {
      attempts.push({ word, result: 'correct', errorType: null });
    }
  }
  // Shuffle attempts so errors aren't all bunched at the start.
  for (let i = attempts.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [attempts[i], attempts[j]] = [attempts[j], attempts[i]];
  }

  const dominantErrorType = incorrectCount === 0
    ? null
    : ERROR_KEYS.reduce((a, b) => (errorCounts[b] > errorCounts[a] ? b : a));

  return {
    id: `s${index + 1}`,
    date: isoDateDaysAgo(offset),
    activityName: activityNames[index % activityNames.length],
    durationMinutes: 8 + Math.round(rand() * 9), // 8–17 minutes
    accuracy,
    attemptsCount,
    correctCount: attemptsCount - incorrectCount,
    errorCounts,
    dominantErrorType,
    attempts,
  };
}

export const sessions = dayOffsets.map((offset, i) => buildSession(i, offset, dayOffsets.length)).reverse();
// `sessions` is now newest → oldest, matching how a history table is usually read.

export function getSessionById(id) {
  return sessions.find((s) => s.id === id) || null;
}

// ----------------------------------------------------------------------------
// Derived stats for the dashboard
// ----------------------------------------------------------------------------
export function computeOverallAccuracy(sessionList = sessions, take = 7) {
  const recent = sessionList.slice(0, take);
  if (recent.length === 0) return 0;
  const sum = recent.reduce((acc, s) => acc + s.accuracy, 0);
  return Math.round(sum / recent.length);
}

export function computeCurrentStreak(sessionList = sessions) {
  // Count consecutive calendar days with at least one session, starting today.
  const datesWithSessions = new Set(sessionList.map((s) => s.date));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(9, 0, 0, 0);
  // If nothing logged today yet, still count backwards from yesterday.
  if (!datesWithSessions.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (datesWithSessions.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeErrorBreakdown(sessionList = sessions) {
  const totals = { omission: 0, substitution: 0, distortion: 0, addition: 0 };
  sessionList.forEach((s) => {
    ERROR_KEYS.forEach((k) => {
      totals[k] += s.errorCounts[k];
    });
  });
  return ERROR_KEYS.map((key) => ({
    key,
    label: ERROR_TYPES[key].label,
    color: ERROR_TYPES[key].color,
    value: totals[key],
  }));
}

export function computeTrend(sessionList = sessions, days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return sessionList
    .filter((s) => new Date(s.date) >= cutoff)
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((s) => ({ date: s.date, accuracy: s.accuracy }));
}

export const overallAccuracy = computeOverallAccuracy();
export const currentStreak = computeCurrentStreak();
export const errorBreakdown = computeErrorBreakdown();
export const trend30d = computeTrend();

// ----------------------------------------------------------------------------
// Guided Home Practice — evidence-based, parent-executable exercises
// ----------------------------------------------------------------------------
export const exercisesBySound = {
  س: [
    {
      id: 'ex-s-1',
      title: 'إحماء تسمية الصور',
      goal: 'تنشيط صوت السين في بداية الكلمات قبل بدء التمرين الرئيسي',
      durationMinutes: 5,
      materials: ['5-6 بطاقات أو صور لأشياء تبدأ بصوت السين (سمكة، سيارة، سلة...)'],
      steps: [
        'اجلسا معًا في مكان هادئ بعيدًا عن المشتتات.',
        'اعرضي على طفلك صورة واحدة، واطلبي منه تسميتها بصوت واضح.',
        'إذا نطقها بشكل صحيح، امدحيه بجملة بسيطة مثل "أحسنت، صوت السين واضح".',
        'إذا أخطأ، انطقي الكلمة ببطء مع التركيز على صوت السين، واطلبي منه إعادتها بعدك.',
        'كرري مع بقية الصور، ثم أعيدا الصور التي أخطأ فيها مرة أخرى في النهاية.',
      ],
      tip: 'اجعلي الجلسة قصيرة (٥ دقائق) حتى يحافظ طفلك على تركيزه وحماسه.',
    },
    {
      id: 'ex-s-2',
      title: 'التكرار أمام المرآة',
      goal: 'مساعدة الطفل على ملاحظة وضع اللسان والشفتين عند نطق السين',
      durationMinutes: 7,
      materials: ['مرآة يدوية أو مرآة الحمّام'],
      steps: [
        'اجلسا أمام المرآة بحيث يرى طفلك فمه بوضوح.',
        'انطقي كلمة تحتوي على صوت السين ببطء، واطلبي منه مراقبة فمك.',
        'اطلبي منه تقليد النطق أمام المرآة مع مراقبة فمه هو.',
        'كرري ٨-١٠ كلمات مختلفة تحتوي على صوت السين في بداية الكلمة ووسطها ونهايتها.',
        'اختمي بكلمة كان أداؤه فيها جيدًا لإنهاء التمرين بشعور إيجابي.',
      ],
      tip: 'التغذية البصرية الراجعة تساعد كثيرًا من الأطفال على تصحيح وضع اللسان دون تلقين مباشر.',
    },
    {
      id: 'ex-s-3',
      title: 'قراءة قصة قصيرة مع التوقف',
      goal: 'تدريب صوت السين ضمن سياق طبيعي أثناء القراءة المشتركة',
      durationMinutes: 10,
      materials: ['قصة قصيرة مناسبة للعمر تحتوي على عدة كلمات بصوت السين'],
      steps: [
        'اختاري قصة قصيرة يحبها طفلك، أو استخدمي إحدى قصصه المفضلة.',
        'اقرآ الصفحة الأولى بصوت عالٍ بشكل طبيعي.',
        'عند الوصول لكلمة تحتوي صوت السين، توقفي واطلبي من طفلك نطقها.',
        'امنحيه وقتًا كافيًا للمحاولة قبل التصحيح أو المساعدة.',
        'أكملا القصة بنفس الطريقة، مع تشجيعه بعد كل صفحة.',
      ],
      tip: 'لا يشترط تصحيح كل خطأ أثناء القراءة — التركيز على الاستمتاع بالقصة لا يقل أهمية عن دقة النطق.',
    },
    {
      id: 'ex-s-4',
      title: 'بناء جمل قصيرة',
      goal: 'الانتقال من الكلمة المفردة إلى استخدام الصوت داخل جملة كاملة',
      durationMinutes: 8,
      materials: ['قائمة الكلمات نفسها من تمرين تسمية الصور'],
      steps: [
        'اختاري ٤-٥ كلمات يتقنها طفلك بشكل جيد من التمارين السابقة.',
        'اطلبي منه تكوين جملة قصيرة تحتوي كل كلمة، مثل "السمكة تسبح في الماء".',
        'استمعي جيدًا لنطق صوت السين داخل الجملة، فهو أصعب من نطقه في كلمة منفردة.',
        'إذا واجه صعوبة، اطلبي منه إعادة الجملة بعدك جملة بجملة.',
        'دوّني أي كلمات ما زالت صعبة عليه ضمن الجملة لمشاركتها مع أخصائية النطق.',
      ],
      tip: 'النطق الصحيح داخل الجمل يستغرق وقتًا أطول من الكلمات المفردة، وهذا أمر طبيعي تمامًا.',
    },
    {
      id: 'ex-s-5',
      title: 'فرز البطاقات الصوتية',
      goal: 'تمييز صوت السين عن الأصوات المشابهة له (مثل الشين والثاء)',
      durationMinutes: 6,
      materials: ['بطاقات صور مختلطة: بعضها بصوت السين وبعضها بأصوات أخرى قريبة'],
      steps: [
        'ضعي البطاقات مبعثرة أمام طفلك على الطاولة.',
        'اطلبي منه أن يختار البطاقات التي تحتوي كلماتها على صوت السين فقط.',
        'بعد أن يفرز كل بطاقة، اطلبي منه نطق الكلمة بصوت عالٍ.',
        'صححي بلطف إذا اختار بطاقة لا تحتوي على صوت السين فعليًا.',
        'أنهيا التمرين بعدّ عدد البطاقات الصحيحة معًا.',
      ],
      tip: 'هذا التمرين يقوي "الوعي الصوتي" الذي يسبق النطق الصحيح غالبًا.',
    },
  ],
  ك: [
    {
      id: 'ex-k-1',
      title: 'إحماء تسمية الصور',
      goal: 'تنشيط صوت الكاف في بداية الكلمات قبل بدء التمرين الرئيسي',
      durationMinutes: 5,
      materials: ['5-6 بطاقات أو صور لأشياء تبدأ بصوت الكاف (كتاب، كوب، كرة...)'],
      steps: [
        'اجلسا معًا في مكان هادئ بعيدًا عن المشتتات.',
        'اعرضي على طفلك صورة واحدة، واطلبي منه تسميتها بصوت واضح.',
        'امدحيه عند النطق الصحيح، وأعيدي النطق ببطء عند الخطأ ليكرره بعدك.',
        'كرري مع بقية الصور، ثم راجعا الصور التي أخطأ فيها في النهاية.',
      ],
      tip: 'اجعلي الجلسة قصيرة حتى يحافظ طفلك على تركيزه وحماسه.',
    },
    {
      id: 'ex-k-2',
      title: 'التكرار أمام المرآة',
      goal: 'مساعدة الطفل على ملاحظة وضع اللسان الخلفي عند نطق الكاف',
      durationMinutes: 7,
      materials: ['مرآة يدوية أو مرآة الحمّام'],
      steps: [
        'اجلسا أمام المرآة بحيث يرى طفلك فمه بوضوح.',
        'انطقي كلمة تحتوي على صوت الكاف ببطء، واطلبي منه مراقبة فمك.',
        'اطلبي منه تقليد النطق أمام المرآة مع مراقبة فمه هو.',
        'كرري ٨-١٠ كلمات مختلفة تحتوي على صوت الكاف في مواضع مختلفة من الكلمة.',
      ],
      tip: 'صوت الكاف يُنطق من الحلق، فقد يحتاج طفلك وقتًا أطول ليشعر بموضعه الصحيح.',
    },
    {
      id: 'ex-k-3',
      title: 'قراءة قصة قصيرة مع التوقف',
      goal: 'تدريب صوت الكاف ضمن سياق طبيعي أثناء القراءة المشتركة',
      durationMinutes: 10,
      materials: ['قصة قصيرة تحتوي على عدة كلمات بصوت الكاف'],
      steps: [
        'اقرآ الصفحة الأولى بصوت عالٍ بشكل طبيعي.',
        'عند الوصول لكلمة تحتوي صوت الكاف، توقفي واطلبي من طفلك نطقها.',
        'امنحيه وقتًا كافيًا للمحاولة قبل التصحيح أو المساعدة.',
        'أكملا القصة بنفس الطريقة، مع تشجيعه بعد كل صفحة.',
      ],
      tip: 'الاستمتاع بالقصة لا يقل أهمية عن دقة النطق.',
    },
    {
      id: 'ex-k-4',
      title: 'بناء جمل قصيرة',
      goal: 'الانتقال من الكلمة المفردة إلى استخدام الصوت داخل جملة كاملة',
      durationMinutes: 8,
      materials: ['قائمة الكلمات نفسها من تمرين تسمية الصور'],
      steps: [
        'اختاري ٤-٥ كلمات يتقنها طفلك بشكل جيد.',
        'اطلبي منه تكوين جملة قصيرة تحتوي كل كلمة، مثل "الكرة كبيرة وملوّنة".',
        'استمعي جيدًا لنطق صوت الكاف داخل الجملة.',
        'دوّني أي كلمات ما زالت صعبة عليه لمشاركتها مع أخصائية النطق.',
      ],
      tip: 'النطق الصحيح داخل الجمل يستغرق وقتًا أطول من الكلمات المفردة، وهذا أمر طبيعي.',
    },
    {
      id: 'ex-k-5',
      title: 'فرز البطاقات الصوتية',
      goal: 'تمييز صوت الكاف عن الأصوات المشابهة له (مثل التاء والقاف)',
      durationMinutes: 6,
      materials: ['بطاقات صور مختلطة: بعضها بصوت الكاف وبعضها بأصوات أخرى قريبة'],
      steps: [
        'ضعي البطاقات مبعثرة أمام طفلك على الطاولة.',
        'اطلبي منه أن يختار البطاقات التي تحتوي كلماتها على صوت الكاف فقط.',
        'اطلبي منه نطق كل كلمة بصوت عالٍ بعد اختيارها.',
        'أنهيا التمرين بعدّ عدد البطاقات الصحيحة معًا.',
      ],
      tip: 'هذا التمرين يقوي الوعي الصوتي الذي يسبق النطق الصحيح غالبًا.',
    },
  ],
};

// ----------------------------------------------------------------------------
// AI Chatbot — pre-scripted example exchanges (static, no real AI behind it)
// ----------------------------------------------------------------------------
export const chatbotScript = [
  {
    id: 'q1',
    question: 'كم مرة يجب أن نمارس التمارين في الأسبوع؟',
    answer:
      'يُنصح عادةً بممارسة تمارين قصيرة (٥-١٠ دقائق) من ٤ إلى ٥ أيام في الأسبوع، أفضل من جلسة طويلة واحدة. الانتظام أهم من المدة.',
  },
  {
    id: 'q2',
    question: 'طفلي يشعر بالإحباط أثناء التمرين، ماذا أفعل؟',
    answer:
      'توقفي عن التمرين مؤقتًا وامنحيه استراحة قصيرة. حاولي جعل الجلسة أقصر، وركزي على الثناء على المحاولة نفسها وليس فقط على النطق الصحيح.',
  },
  {
    id: 'q3',
    question: 'متى يجب أن أتواصل مع أخصائية النطق؟',
    answer:
      'إذا لاحظتِ عدم وجود أي تحسن خلال ٣-٤ أسابيع من الممارسة المنتظمة، أو إذا زاد إحباط طفلك بشكل ملحوظ، فمن الأفضل التواصل مع الأخصائية لمراجعة الخطة.',
  },
  {
    id: 'q4',
    question: 'هل يسجل التطبيق صوت طفلي أو يحتفظ به؟',
    answer:
      'هذا نموذج أولي (Prototype) فقط لأغراض العرض، ولا يقوم حاليًا بأي تسجيل أو معالجة صوتية فعلية.',
  },
  {
    id: 'q5',
    question: 'كيف أقرأ تقرير التقدم في الرسم البياني؟',
    answer:
      'الخط الصاعد في الرسم البياني يعني تحسن نسبة الدقة بمرور الوقت. يمكنك أيضًا مراجعة أنواع الأخطاء الأكثر تكرارًا في قسم "تفصيل الأخطاء" أسفل الرسم.',
  },
];

export const chatbotFallback =
  'شكرًا لسؤالك! هذا نموذج أولي للعرض فقط، ولا يوجد رد آلي حقيقي بعد. جرّبي أحد الأسئلة المقترحة أعلاه.';
