// Regression net for the matching engine: archetype profiles must land
// sensible top-3 results. Run with:  npx tsx scripts/matching-sanity.ts
import { calculateResults } from "../src/lib/matching";
import type { QuestionnaireAnswers } from "../src/lib/store";

const BUDGET = "I'm open to moderate costs, including some international options";

interface Archetype {
  name: string;
  answers: QuestionnaireAnswers;
  /** At least one of these majors must appear in the top 3. */
  expectAny: string[];
  /** None of these majors may appear in the top 3. */
  forbid?: string[];
}

const archetypes: Archetype[] = [
  {
    name: "Pure creative (no science)",
    answers: {
      subjects: ["Art / Design", "Literature / Languages"],
      interests: ["Creating visual art & design"],
      strengths: ["Thinking creatively and originally"],
      workStyle: "Designing and creating something new",
      careerEnv: "A creative studio or agency",
      learningApproach: "Creative exploration and play",
      workOrientation: "Bring beauty and meaning into the world",
      futureGoals: ["Using my creativity freely"],
      budgetLevel: BUDGET,
    },
    expectAny: ["Creative Arts & Graphic Design"],
    forbid: ["Medicine & Health Sciences", "Mechanical & Civil Engineering", "Finance & Economics"],
  },
  {
    name: "Science + care (future doctor)",
    answers: {
      subjects: ["Biology", "Chemistry"],
      interests: ["Helping people with health & wellbeing", "Advancing science through research"],
      strengths: ["Researching and digging into topics", "Staying calm and finding solutions"],
      workStyle: "Working independently on focused tasks",
      careerEnv: "A hospital or healthcare setting",
      learningApproach: "Reading deeply and theorizing",
      workOrientation: "Directly improve people's lives day to day",
      futureGoals: ["Helping people directly every day"],
      budgetLevel: BUDGET,
    },
    expectAny: ["Medicine & Health Sciences", "Pharmacy & Biomedical Sciences", "Nursing & Allied Health"],
    forbid: ["Creative Arts & Graphic Design", "Marketing & Advertising", "Game Design & Interactive Media"],
  },
  {
    name: "Builder / coder",
    answers: {
      subjects: ["Computer Science", "Mathematics", "Physics"],
      interests: ["Building technology & software", "Engineering innovative systems"],
      strengths: ["Technical or digital skills", "Breaking down complex problems"],
      workStyle: "Analyzing data and patterns",
      careerEnv: "My own startup or business",
      learningApproach: "Hands-on practice and experimentation",
      workOrientation: "Build products that millions of people use",
      futureGoals: ["Building systems and technology"],
      budgetLevel: BUDGET,
    },
    expectAny: ["Computer Science & Software Engineering"],
    forbid: ["Medicine & Health Sciences", "Nursing & Allied Health", "Law & Political Science"],
  },
  {
    name: "Entrepreneur / leader",
    answers: {
      subjects: ["Economics", "Mathematics"],
      interests: ["Launching businesses & startups"],
      strengths: ["Leading and motivating others", "Organizing and planning effectively"],
      workStyle: "Managing a team toward a shared goal",
      careerEnv: "A fast-paced corporate environment",
      learningApproach: "Group projects and discussion",
      workOrientation: "Lead teams and shape organizations",
      futureGoals: ["Earning well and building financial security"],
      budgetLevel: BUDGET,
    },
    expectAny: ["Business Administration & Management", "Finance & Economics"],
    forbid: ["Medicine & Health Sciences", "Creative Arts & Graphic Design"],
  },
  {
    name: "People-centered helper (no science)",
    answers: {
      subjects: ["Literature / Languages", "History"],
      interests: ["Supporting communities & social causes", "Shaping minds through education"],
      strengths: ["Connecting with and understanding people", "Explaining things clearly to others"],
      workStyle: "Collaborating and connecting with people",
      careerEnv: "A school, hospital, or community space",
      learningApproach: "Group projects and discussion",
      workOrientation: "Directly improve people's lives day to day",
      futureGoals: ["Helping people directly every day"],
      budgetLevel: BUDGET,
    },
    expectAny: ["Psychology & Social Sciences", "Education & Teaching"],
    forbid: ["Mechanical & Civil Engineering", "Cybersecurity & Network Engineering", "Data Science & Statistics"],
  },
  {
    name: "Policy / justice mind",
    answers: {
      subjects: ["History", "Literature / Languages", "Economics"],
      interests: ["Defending justice & policy"],
      strengths: ["Breaking down complex problems", "Explaining things clearly to others"],
      workStyle: "Collaborating and connecting with people",
      careerEnv: "A government or policy institution",
      learningApproach: "Reading deeply and theorizing",
      workOrientation: "Lead teams and shape organizations",
      futureGoals: ["Influencing policy and social change"],
      budgetLevel: BUDGET,
    },
    expectAny: ["Law & Political Science", "International Relations & Global Affairs"],
    forbid: ["Pharmacy & Biomedical Sciences", "Mechanical & Civil Engineering"],
  },
  {
    name: "Nature / environment scientist",
    answers: {
      subjects: ["Biology", "Geography", "Chemistry"],
      interests: ["Protecting the environment", "Advancing science through research"],
      strengths: ["Researching and digging into topics"],
      workStyle: "Working independently on focused tasks",
      careerEnv: "Outdoors or in the field",
      learningApproach: "Hands-on practice and experimentation",
      workOrientation: "Push the boundaries of scientific knowledge",
      futureGoals: ["Having meaningful impact in the world"],
      budgetLevel: BUDGET,
    },
    expectAny: ["Environmental Science & Sustainability"],
    forbid: ["Marketing & Advertising", "Finance & Economics", "Business Administration & Management"],
  },
  {
    name: "Select-all sceptic (everything picked)",
    answers: {
      subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Literature / Languages", "Computer Science", "Art / Design", "Economics", "Physical Education"],
      interests: ["Building technology & software", "Launching businesses & startups", "Creating visual art & design", "Advancing science through research", "Helping people with health & wellbeing", "Shaping minds through education", "Defending justice & policy", "Protecting the environment", "Supporting communities & social causes", "Engineering innovative systems"],
      strengths: ["Breaking down complex problems", "Thinking creatively and originally", "Connecting with and understanding people", "Leading and motivating others", "Technical or digital skills", "Organizing and planning effectively", "Researching and digging into topics", "Explaining things clearly to others", "Staying calm and finding solutions"],
      workStyle: "Analyzing data and patterns",
      careerEnv: "A research lab or university",
      learningApproach: "Data analysis and structured reasoning",
      workOrientation: "Find patterns that explain complex phenomena",
      futureGoals: ["Having meaningful impact in the world", "Earning well and building financial security", "Using my creativity freely", "Helping people directly every day", "Being at the cutting edge of innovation", "Building systems and technology", "Influencing policy and social change", "Understanding the world at a deep level"],
      budgetLevel: BUDGET,
    },
    // Whatever wins must not claim an implausibly perfect score when the signal is diluted.
    expectAny: [],
  },
  {
    name: "Detailed mode: creative likert flips a mixed profile",
    answers: {
      subjects: ["Art / Design", "Computer Science"],
      interests: ["Creating visual art & design", "Building technology & software"],
      strengths: ["Thinking creatively and originally"],
      workStyle: "Designing and creating something new",
      careerEnv: "A creative studio or agency",
      learningApproach: "Creative exploration and play",
      workOrientation: "Bring beauty and meaning into the world",
      futureGoals: ["Using my creativity freely"],
      budgetLevel: BUDGET,
      likert: {
        solveLogic: 3, buildThings: 2, expressArt: 5, helpPeople: 2,
        leadGroup: 2, curiousScience: 2, ventureSpirit: 2, fixTech: 3,
        dataPatterns: 3, empathize: 3, publicSpeak: 3, experiment: 3,
        aesthetics: 5, organizeEvents: 2, debateIdeas: 2, natureOutdoors: 2,
      },
      scenarios: ["Design the look, feel, and story", "Drawing, making music, or editing videos"],
      mode: "detailed",
    },
    expectAny: ["Creative Arts & Graphic Design", "Game Design & Interactive Media"],
    forbid: ["Medicine & Health Sciences", "Finance & Economics"],
  },
];

let failures = 0;

for (const arch of archetypes) {
  const { results } = calculateResults(arch.answers);
  const top3 = results.map(r => r.major);
  const scores = results.map(r => `${r.major} (${r.score}%, ${r.confidence})`).join(" | ");

  const hitExpected = arch.expectAny.length === 0 || arch.expectAny.some(m => top3.includes(m));
  const hitForbidden = (arch.forbid ?? []).filter(m => top3.includes(m));
  const scoresValid = results.every(r => r.score >= 0 && r.score <= 100);
  // A fully diluted select-all profile should not produce a near-perfect top score.
  const dilutionOk = arch.name.startsWith("Select-all") ? results[0].score <= 80 : true;

  const ok = hitExpected && hitForbidden.length === 0 && scoresValid && dilutionOk;
  console.log(`${ok ? "✅" : "❌"} ${arch.name}\n   → ${scores}`);
  if (!hitExpected) console.log(`   expected one of: ${arch.expectAny.join(", ")}`);
  if (hitForbidden.length) console.log(`   forbidden major(s) in top 3: ${hitForbidden.join(", ")}`);
  if (!scoresValid) console.log("   score out of 0–100 range");
  if (!dilutionOk) console.log(`   select-all profile scored ${results[0].score}% — dilution failed`);
  if (!ok) failures++;
}

console.log(failures === 0 ? "\nAll archetype checks passed." : `\n${failures} archetype check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
