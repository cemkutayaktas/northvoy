// Canonical quiz option strings — single source of truth.
// Stored answers and every scoring key use these exact English strings;
// translation happens at display time via the i18n `options` map.

export const QUIZ_FIELDS = [
  "subjects", "interests", "strengths", "workStyle",
  "careerEnv", "learningApproach", "workOrientation", "futureGoals",
] as const;
export type QuizField = (typeof QUIZ_FIELDS)[number];

export const MULTI_FIELDS: readonly QuizField[] = ["subjects", "interests", "strengths", "futureGoals"];

export const QUIZ_OPTIONS: Record<QuizField | "budgetLevel", string[]> = {
  subjects: [
    "Mathematics", "Physics", "Chemistry", "Biology", "History",
    "Geography", "Literature / Languages", "Computer Science",
    "Art / Design", "Economics", "Physical Education",
  ],
  interests: [
    "Building technology & software",
    "Launching businesses & startups",
    "Creating visual art & design",
    "Advancing science through research",
    "Helping people with health & wellbeing",
    "Shaping minds through education",
    "Defending justice & policy",
    "Protecting the environment",
    "Supporting communities & social causes",
    "Engineering innovative systems",
  ],
  strengths: [
    "Breaking down complex problems",
    "Thinking creatively and originally",
    "Connecting with and understanding people",
    "Leading and motivating others",
    "Technical or digital skills",
    "Organizing and planning effectively",
    "Researching and digging into topics",
    "Explaining things clearly to others",
    "Staying calm and finding solutions",
  ],
  workStyle: [
    "Analyzing data and patterns",
    "Collaborating and connecting with people",
    "Building or fixing physical things",
    "Designing and creating something new",
    "Working independently on focused tasks",
    "Managing a team toward a shared goal",
  ],
  careerEnv: [
    "A research lab or university",
    "A fast-paced corporate environment",
    "My own startup or business",
    "A creative studio or agency",
    "A school, hospital, or community space",
    "Outdoors or in the field",
    "A hospital or healthcare setting",
    "A government or policy institution",
  ],
  learningApproach: [
    "Reading deeply and theorizing",
    "Hands-on practice and experimentation",
    "Creative exploration and play",
    "Group projects and discussion",
    "Solo deep-dives and self-study",
    "Data analysis and structured reasoning",
  ],
  workOrientation: [
    "Push the boundaries of scientific knowledge",
    "Build products that millions of people use",
    "Lead teams and shape organizations",
    "Bring beauty and meaning into the world",
    "Directly improve people's lives day to day",
    "Find patterns that explain complex phenomena",
  ],
  futureGoals: [
    "Having meaningful impact in the world",
    "Earning well and building financial security",
    "Using my creativity freely",
    "Helping people directly every day",
    "Being at the cutting edge of innovation",
    "Building systems and technology",
    "Influencing policy and social change",
    "Understanding the world at a deep level",
  ],
  budgetLevel: [
    "I prefer more affordable options — local or lower-cost universities",
    "I'm open to moderate costs, including some international options",
    "I'm fully open to top universities anywhere, regardless of cost",
  ],
};

// ─── Detailed mode: scenario questions ────────────────────────────────────────
// Single-choice; each option is a canonical string scored via OPTION_DIMS + affinities.

export const SCENARIO_FIELDS = ["scenarioProject", "scenarioFreeDay"] as const;
export type ScenarioField = (typeof SCENARIO_FIELDS)[number];

export const SCENARIO_OPTIONS: Record<ScenarioField, string[]> = {
  scenarioProject: [
    "Architect the app and write the code",
    "Design the look, feel, and story",
    "Run the numbers and analyze the data",
    "Organize the team, budget, and timeline",
    "Research the science behind the problem",
    "Interview people and present the findings",
  ],
  scenarioFreeDay: [
    "Building or tinkering with something technical",
    "Drawing, making music, or editing videos",
    "Volunteering or helping someone out",
    "Reading about science, history, or big ideas",
    "Playing sports or being outdoors",
    "Planning a small business or side hustle",
  ],
};

// ─── Detailed mode: Likert statements ─────────────────────────────────────────
// Rated 1 (strongly disagree) – 5 (strongly agree). Display text lives in the
// i18n `likert.{id}` namespace; ids are the stable scoring keys.

export const LIKERT_IDS = [
  "solveLogic", "buildThings", "expressArt", "helpPeople",
  "leadGroup", "curiousScience", "ventureSpirit", "fixTech",
  "dataPatterns", "empathize", "publicSpeak", "experiment",
  "aesthetics", "organizeEvents", "debateIdeas", "natureOutdoors",
] as const;
export type LikertId = (typeof LIKERT_IDS)[number];
