import {
  QuestionnaireAnswers, MatchResult, ProfileType,
  HiddenMatch, WhyNotEntry, PathwayBranch, TwelveMonthPlan, AlternativeRoute,
} from "./store";

export const MAJORS = [
  "Computer Science & Software Engineering",
  "Business Administration & Management",
  "Medicine & Health Sciences",
  "Creative Arts & Graphic Design",
  "Environmental Science & Sustainability",
  "Psychology & Social Sciences",
  "Law & Political Science",
  "Mechanical & Civil Engineering",
  "Data Science & Statistics",
  "Education & Teaching",
  "Finance & Economics",
  "Architecture & Urban Design",
  "Pharmacy & Biomedical Sciences",
  "Communication & Media Studies",
  "International Relations & Global Affairs",
  "Cybersecurity & Network Engineering",
  "Game Design & Interactive Media",
  "Nursing & Allied Health",
  "Marketing & Advertising",
  "Linguistics & Translation",
] as const;
export type Major = (typeof MAJORS)[number];

// ─── Budget tiers ─────────────────────────────────────────────────────────────
type BudgetTier = 1 | 2 | 3;

function getBudgetTier(budgetLevel: string): BudgetTier {
  if (budgetLevel.includes("affordable") || budgetLevel.includes("lower-cost")) return 1;
  if (budgetLevel.includes("moderate"))  return 2;
  return 3;
}

// ─── Per-major static data ────────────────────────────────────────────────────
export interface MajorData {
  skills: string[];
  careers: string[];
  nextSteps: string[];
  strengthKeywords: string[];
  countries: { name: string; flag: string }[];
  universitiesByBudget: Record<BudgetTier, string[]>;
  pathways: PathwayBranch[];
  twelveMonthPlan: TwelveMonthPlan;
  studyCostLabel: string;
  studyCostColor: string;
  alternativeRoute: AlternativeRoute;
  miniProject: string;
}

export const MAJOR_DATA: Record<Major, MajorData> = {

  "Computer Science & Software Engineering": {
    skills: ["Algorithms & Data Structures", "System Design", "Version Control (Git)", "Cloud Architecture", "Agile Development"],
    careers: ["Software Engineer", "Full-Stack Developer", "ML Engineer", "DevOps Engineer", "Product Manager (Technical)", "Startup Founder"],
    nextSteps: [
      "Complete Harvard's free CS50 course or freeCodeCamp's JavaScript path.",
      "Build one real project — a portfolio site, simple web app, or command-line tool.",
      "Explore CS, Software Engineering, or AI programs at universities that interest you.",
    ],
    strengthKeywords: ["logical", "systematic", "technical", "builder"],
    countries: [
      { name: "United States", flag: "🇺🇸" }, { name: "Germany", flag: "🇩🇪" },
      { name: "Canada", flag: "🇨🇦" }, { name: "United Kingdom", flag: "🇬🇧" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Sweden", flag: "🇸🇪" },
    ],
    universitiesByBudget: {
      1: ["TU Munich (Germany — low/no fees)", "KTH Royal Institute of Technology (Sweden)", "University of Helsinki (Finland)", "TU Delft (Netherlands)"],
      2: ["University of Toronto (Canada)", "University of Edinburgh (UK)", "EPFL (Switzerland)", "University of Melbourne (Australia)"],
      3: ["MIT (USA)", "Stanford University (USA)", "ETH Zurich (Switzerland)", "Imperial College London (UK)", "Carnegie Mellon (USA)"],
    },
    pathways: [
      { name: "Industry Track", description: "Join a tech company and build software used by millions of people.", roles: ["Junior Developer", "Senior Engineer", "Staff/Principal Engineer", "Engineering Manager"] },
      { name: "Research & AI Track", description: "Pursue graduate school and contribute to cutting-edge AI or systems research.", roles: ["Research Assistant", "PhD Researcher", "Research Scientist", "AI Lab Lead"] },
      { name: "Founder Track", description: "Build your own product or startup, combining technical and entrepreneurial skill.", roles: ["Solo Developer", "CTO / Co-founder", "Startup Founder", "Venture-backed CEO"] },
    ],
    studyCostLabel: "Moderate–High",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Build the Foundation", focus: ["Complete CS50 (free, Harvard) or a beginner Python course", "Understand how the internet works (HTTP, servers, APIs)", "Set up a GitHub account and learn Git basics"] },
      q2: { title: "Apr–Jun: Start Building", focus: ["Build your first real project — a personal website or simple web app", "Learn HTML, CSS, and JavaScript basics if not already done", "Join a coding community (Discord, Reddit r/learnprogramming)"] },
      q3: { title: "Jul–Sep: Go Deeper", focus: ["Learn data structures and basic algorithms", "Add a second project — a database-connected app or API integration", "Explore one advanced area: machine learning, mobile apps, or web frameworks"] },
      q4: { title: "Oct–Dec: Prepare & Apply", focus: ["Polish 2–3 projects and document them well on GitHub", "Research university programs in CS, SE, or AI that interest you", "Draft your personal statement and prepare for any entrance requirements"] },
    },
    alternativeRoute: { major: "Data Science & Statistics", reason: "If pure software engineering feels too rigid, Data Science blends mathematical thinking with real-world storytelling — equally powerful and flexible in the careers it opens." },
    miniProject: "Build a simple weather app or to-do list using HTML, CSS, and JavaScript. Host it free on GitHub Pages so you have a live, shareable portfolio piece from day one.",
  },

  "Business Administration & Management": {
    skills: ["Strategic Planning", "Financial Literacy", "Negotiation & Communication", "Data-Driven Decision Making", "Leadership"],
    careers: ["Business Analyst", "Marketing Manager", "Entrepreneur", "Strategy Consultant", "Operations Director", "Financial Advisor"],
    nextSteps: [
      "Read 'The Lean Startup' or 'Zero to One' to start building entrepreneurial thinking.",
      "Join a debate team, student council, or school entrepreneurship club.",
      "Research BBA, Finance, or International Business programs at universities.",
    ],
    strengthKeywords: ["organized", "strategic", "communicator", "decisive"],
    countries: [
      { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" },
      { name: "France", flag: "🇫🇷" }, { name: "Singapore", flag: "🇸🇬" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Canada", flag: "🇨🇦" },
    ],
    universitiesByBudget: {
      1: ["University of Groningen (Netherlands)", "Maastricht University (Netherlands)", "University of Helsinki (Finland)", "Tilburg University (Netherlands)"],
      2: ["University of Toronto Rotman (Canada)", "University of Edinburgh Business School (UK)", "Melbourne Business School (Australia)", "Frankfurt School of Finance (Germany)"],
      3: ["Harvard Business School (USA)", "London Business School (UK)", "INSEAD (France/Singapore)", "Wharton School, UPenn (USA)", "University of St. Gallen (Switzerland)"],
    },
    pathways: [
      { name: "Corporate Track", description: "Join a multinational company, grow through structured management programs.", roles: ["Graduate Trainee", "Business Analyst", "Senior Manager", "VP / C-Suite"] },
      { name: "Entrepreneurship Track", description: "Build your own venture, from idea to product to scale.", roles: ["Freelancer / Consultant", "Startup Co-founder", "CEO", "Serial Entrepreneur"] },
      { name: "Consulting Track", description: "Work across industries solving complex organizational problems.", roles: ["Analyst", "Consultant", "Senior Consultant", "Partner"] },
    ],
    studyCostLabel: "Moderate–High",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Develop Business Thinking", focus: ["Read one business book (e.g. 'The Lean Startup' or 'How to Win Friends and Influence People')", "Analyze a company you admire — how do they make money?", "Start following business news (BBC Business, Financial Times free articles)"] },
      q2: { title: "Apr–Jun: Build Core Skills", focus: ["Learn Excel or Google Sheets for basic data analysis", "Practice public speaking — join Toastmasters or school debate", "Start a small venture (sell something, organize an event, run a social page)"] },
      q3: { title: "Jul–Sep: Get Exposure", focus: ["Interview a local entrepreneur or business owner", "Attend a business or entrepreneurship event (many are free online)", "Start a blog, newsletter, or YouTube channel on a topic you know"] },
      q4: { title: "Oct–Dec: Position Yourself", focus: ["Create a LinkedIn profile and start building your professional network", "Research university BBA, Finance, or Management programs", "Write and refine your personal statement with examples of initiative"] },
    },
    alternativeRoute: { major: "Law & Political Science", reason: "If you're drawn to strategy and argumentation, law offers the same intellectual rigour — especially valuable in corporate, policy, or international careers." },
    miniProject: "Launch a micro-venture: sell something online, offer a service, or organize a paid school event. Track every income and expense, then write a one-page reflection on what you learned.",
  },

  "Medicine & Health Sciences": {
    skills: ["Biomedical Science Fundamentals", "Clinical Reasoning", "Research Methodology", "Medical Ethics", "Patient Communication"],
    careers: ["Medical Doctor", "Surgeon", "Pharmacist", "Biomedical Researcher", "Public Health Officer", "Medical Scientist"],
    nextSteps: [
      "Strengthen your Biology and Chemistry — they're non-negotiable prerequisites for medicine.",
      "Volunteer at a clinic, hospital, or community health program to gain exposure.",
      "Research medicine entry requirements carefully — most require entrance exams (BMAT, UCAT, MCAT).",
    ],
    strengthKeywords: ["detail-oriented", "resilient", "empathetic", "scientifically rigorous"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Germany", flag: "🇩🇪" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Australia", flag: "🇦🇺" },
      { name: "Canada", flag: "🇨🇦" }, { name: "United States", flag: "🇺🇸" },
    ],
    universitiesByBudget: {
      1: ["Charité – Universitätsmedizin Berlin (Germany — low fees)", "University of Helsinki (Finland)", "Radboud University (Netherlands)", "Maastricht University (Netherlands)"],
      2: ["University of Melbourne (Australia)", "McGill University (Canada)", "University of Edinburgh (UK)", "University College Dublin (Ireland)"],
      3: ["University of Oxford (UK)", "University of Cambridge (UK)", "Johns Hopkins University (USA)", "Harvard Medical School (USA)", "Imperial College London (UK)"],
    },
    pathways: [
      { name: "Clinical Practice", description: "Become a practicing physician and work directly with patients.", roles: ["Medical Student", "Junior Doctor / Resident", "Specialist / Consultant", "Senior Attending Physician"] },
      { name: "Research & Academia", description: "Advance medical knowledge through clinical trials and lab research.", roles: ["Research Assistant", "Clinical Researcher", "Principal Investigator", "Professor of Medicine"] },
      { name: "Public Health", description: "Work at a systems level to improve population health and policy.", roles: ["Public Health Officer", "Epidemiologist", "Health Policy Advisor", "WHO / NGO Director"] },
    ],
    studyCostLabel: "High (Long Study Duration)",
    studyCostColor: "text-red-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Strengthen Academic Foundations", focus: ["Focus deeply on Biology and Chemistry — aim for top grades", "Begin exploring free anatomy resources (Khan Academy Medicine)", "Research what the UCAT, BMAT, or MCAT involves and when you'll need them"] },
      q2: { title: "Apr–Jun: Gain Direct Exposure", focus: ["Volunteer at a hospital, clinic, or care home — even 1–2 hours/week counts", "Shadow a GP or doctor if possible through school or family connections", "Start a reading list: medical ethics, case studies, healthcare news"] },
      q3: { title: "Jul–Sep: Prepare & Deepen", focus: ["Begin UCAT or BMAT prep if applying to UK, or MCAT for US", "Study research methodology basics — medical school values evidence-based thinking", "Reflect on and document your motivations for medicine with specific examples"] },
      q4: { title: "Oct–Dec: Apply Strategically", focus: ["Research entry requirements for medical schools you're interested in — they vary widely", "Finalize your personal statement focusing on patient exposure, resilience, and empathy", "Apply early — medicine programs are highly competitive and have strict deadlines"] },
    },
    alternativeRoute: { major: "Psychology & Social Sciences", reason: "Psychology lets you explore the human mind and wellbeing with equal depth, without the decade-long training timeline — opening diverse doors in therapy, research, and public health." },
    miniProject: "Create an illustrated infographic explaining how a common condition (e.g. anxiety, diabetes, or the immune response) works, written clearly for a non-scientific audience. Share it with classmates for feedback.",
  },

  "Creative Arts & Graphic Design": {
    skills: ["UI/UX Design Principles", "Visual Hierarchy & Typography", "Brand Identity Design", "Digital Prototyping (Figma)", "Motion & Animation"],
    careers: ["Graphic Designer", "UX/UI Designer", "Art Director", "Motion Designer", "Creative Director", "Brand Strategist"],
    nextSteps: [
      "Learn Figma (free) — it's the industry standard design tool and has great tutorials.",
      "Build a portfolio of 3–5 original projects showcasing different styles.",
      "Explore Fine Arts, Graphic Design, or Media Arts programs at universities or design schools.",
    ],
    strengthKeywords: ["visually sharp", "imaginative", "expressive", "detail-focused"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Netherlands", flag: "🇳🇱" },
      { name: "Italy", flag: "🇮🇹" }, { name: "Germany", flag: "🇩🇪" },
      { name: "Japan", flag: "🇯🇵" }, { name: "United States", flag: "🇺🇸" },
    ],
    universitiesByBudget: {
      1: ["Design Academy Eindhoven (Netherlands)", "Aalto University (Finland)", "HfG Offenbach (Germany — low fees)", "Weissensee School of Art (Germany)"],
      2: ["Politecnico di Milano (Italy)", "Musashino Art University (Japan)", "RMIT University (Australia)", "Emily Carr University (Canada)"],
      3: ["Royal College of Art (UK)", "Parsons School of Design (USA)", "Central Saint Martins (UK)", "RISD (USA)", "Pratt Institute (USA)"],
    },
    pathways: [
      { name: "Agency Track", description: "Work in a creative or branding agency serving multiple clients.", roles: ["Junior Designer", "Mid Designer", "Senior Designer", "Creative Director"] },
      { name: "In-House / Product Track", description: "Design products and brand identities inside a tech or product company.", roles: ["UI Designer", "UX Designer", "Product Designer", "Head of Design"] },
      { name: "Independent / Freelance Track", description: "Build your own client base and creative practice.", roles: ["Freelance Designer", "Design Consultant", "Studio Owner", "Artist / Creative Director"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Build Visual Foundations", focus: ["Study the basics: color theory, typography, and visual hierarchy (free resources on YouTube)", "Learn Figma — work through its free 'Design with Figma' beginner course", "Observe and analyze the design of brands, apps, and posters around you daily"] },
      q2: { title: "Apr–Jun: Create Your First Projects", focus: ["Design 3 original pieces: a logo, a poster, and a simple app screen", "Document each project on Behance or a personal website", "Follow designers on Dribbble and Behance — study what makes great work great"] },
      q3: { title: "Jul–Sep: Expand Your Range", focus: ["Add 2 more portfolio pieces in different styles or formats", "Learn one more tool: Adobe Illustrator, Photoshop, or After Effects (free trials)", "Enter a design challenge — Briefz, Daily UI, or local competitions"] },
      q4: { title: "Oct–Dec: Polish & Apply", focus: ["Curate your portfolio to your 5 best, most diverse pieces", "Research art & design school programs — most require a portfolio for admission", "Prepare your artist statement and tailor your portfolio to each school's style"] },
    },
    alternativeRoute: { major: "Business Administration & Management", reason: "If you love creative thinking but also crave structure, marketing and brand management sits at the intersection — giving your creative instincts a commercial direction and a clear career path." },
    miniProject: "Choose a real local business with an outdated brand and redesign their logo, color palette, and one social media post using Figma (free). Present your rationale in a short written brief.",
  },

  "Environmental Science & Sustainability": {
    skills: ["Environmental Impact Assessment", "Climate Data Analysis", "Policy & Regulation", "Field Research Methods", "Science Communication"],
    careers: ["Environmental Scientist", "Sustainability Consultant", "Climate Policy Analyst", "Conservation Biologist", "Urban Sustainability Planner"],
    nextSteps: [
      "Follow IPCC reports and climate journalism to understand the field's biggest challenges.",
      "Join or start an environmental initiative at your school or in your community.",
      "Explore Environmental Science, Ecology, or Sustainability programs at universities.",
    ],
    strengthKeywords: ["systemic thinker", "purpose-driven", "scientific", "action-oriented"],
    countries: [
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Sweden", flag: "🇸🇪" },
      { name: "Germany", flag: "🇩🇪" }, { name: "Canada", flag: "🇨🇦" },
      { name: "New Zealand", flag: "🇳🇿" }, { name: "Denmark", flag: "🇩🇰" },
    ],
    universitiesByBudget: {
      1: ["Wageningen University (Netherlands)", "Uppsala University (Sweden)", "University of Copenhagen (Denmark)", "University of Groningen (Netherlands)"],
      2: ["University of British Columbia (Canada)", "University of Auckland (New Zealand)", "Lund University (Sweden)", "University of Exeter (UK)"],
      3: ["ETH Zurich (Switzerland)", "Yale School of the Environment (USA)", "UC Berkeley (USA)", "University of Oxford (UK)"],
    },
    pathways: [
      { name: "Policy & Government", description: "Shape environmental regulation and public policy at local or international level.", roles: ["Policy Researcher", "Environmental Advisor", "Government Officer", "International Climate Negotiator"] },
      { name: "Research & Academia", description: "Study ecosystems, climate data, and biodiversity through field and lab research.", roles: ["Research Technician", "Environmental Scientist", "Ecologist", "Professor / Research Lead"] },
      { name: "Private Sector & Consulting", description: "Help businesses and cities reduce environmental impact and meet sustainability goals.", roles: ["Sustainability Analyst", "ESG Consultant", "Corporate Sustainability Manager", "Director of Sustainability"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Build Awareness", focus: ["Read one key climate book ('The Ministry for the Future' or 'Drawdown')", "Follow 3 environmental organizations (WWF, Greenpeace, ClientEarth)", "Identify a real environmental issue in your local area"] },
      q2: { title: "Apr–Jun: Take Action", focus: ["Join or start an environmental club at school or in your community", "Volunteer in a conservation or clean-up initiative", "Start a journal or blog documenting your environmental observations"] },
      q3: { title: "Jul–Sep: Build Scientific Skills", focus: ["Learn basic ecology and environmental science (Khan Academy or Coursera free)", "Analyze public climate or air quality data — find a dataset and explore it", "Study research methods: how to collect, analyze, and present field data"] },
      q4: { title: "Oct–Dec: Apply Purposefully", focus: ["Build a project that shows your commitment (campaign, report, proposal)", "Research Environmental Science, Sustainability, or Ecology programs", "Write a personal statement focused on impact, initiative, and scientific thinking"] },
    },
    alternativeRoute: { major: "Law & Political Science", reason: "Environmental law and climate policy are among the fastest-growing legal fields. If you care about the planet but love debate, this path lets you fight for it through legal and political systems." },
    miniProject: "Track the waste generated in your home or school cafeteria for one week. Present your findings in a one-page visual report with three specific, actionable recommendations.",
  },

  "Psychology & Social Sciences": {
    skills: ["Behavioral Research Methods", "Statistical Analysis", "Active Listening & Counseling", "Report Writing", "Interpersonal Communication"],
    careers: ["Counselor / Therapist", "HR & Organizational Psychologist", "Social Researcher", "Community Officer", "Child Psychologist", "UX Researcher"],
    nextSteps: [
      "Read 'Thinking, Fast and Slow' by Daniel Kahneman — an essential introduction to psychology.",
      "Practice active listening in daily conversations and reflect on what you observe.",
      "Look into Psychology, Sociology, Social Work, or Cognitive Science programs.",
    ],
    strengthKeywords: ["empathetic", "observant", "analytical", "people-first"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Netherlands", flag: "🇳🇱" },
      { name: "United States", flag: "🇺🇸" }, { name: "Canada", flag: "🇨🇦" },
      { name: "Australia", flag: "🇦🇺" }, { name: "Germany", flag: "🇩🇪" },
    ],
    universitiesByBudget: {
      1: ["University of Amsterdam (Netherlands)", "University of Groningen (Netherlands)", "Leiden University (Netherlands)", "University of Helsinki (Finland)"],
      2: ["University of Edinburgh (UK)", "McGill University (Canada)", "University of Melbourne (Australia)", "University of Vienna (Austria)"],
      3: ["Harvard University (USA)", "University College London (UK)", "University of Oxford (UK)", "Stanford University (USA)"],
    },
    pathways: [
      { name: "Clinical & Therapeutic", description: "Work directly with individuals, families, or groups to support mental health.", roles: ["Psychology Graduate", "Clinical Psychologist Trainee", "Therapist / Counselor", "Clinical Psychologist"] },
      { name: "Organizational & HR", description: "Apply behavioral science in workplace settings and talent development.", roles: ["HR Generalist", "Organizational Psychologist", "L&D Specialist", "Head of People"] },
      { name: "Research & Academia", description: "Advance our understanding of human behavior through rigorous study.", roles: ["Research Coordinator", "Research Psychologist", "Lecturer", "Professor / Director of Research"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Develop Insight", focus: ["Read 'Thinking Fast and Slow' (Kahneman) or 'Influence' (Cialdini)", "Practice active listening every day — observe and note what people really mean", "Keep a behavioral diary: write what you observe about human behavior around you"] },
      q2: { title: "Apr–Jun: Get Involved", focus: ["Volunteer with a community organization, mental health charity, or youth group", "Practice empathy in difficult conversations — notice assumptions and reactions", "Explore mindfulness or emotional intelligence frameworks"] },
      q3: { title: "Jul–Sep: Build Research Skills", focus: ["Take a free introductory statistics course (Khan Academy or Coursera)", "Design a simple survey and analyze the results — what patterns emerge?", "Explore research methods: surveys, interviews, observational studies"] },
      q4: { title: "Oct–Dec: Apply Strategically", focus: ["Research Psychology, Cognitive Science, or Social Work programs", "Write a personal statement that references specific human observations or experiences", "Prepare for any interview processes — psychology programs often interview applicants"] },
    },
    alternativeRoute: { major: "Medicine & Health Sciences", reason: "If you're drawn to the clinical side and want to diagnose, prescribe, or lead patient care, psychiatry within medicine gives you all of that — with deeper biological and neuroscientific foundations." },
    miniProject: "Design and run a simple experiment testing a psychological effect on 5–10 willing participants (e.g. the Stroop effect or confirmation bias). Write up your method, results, and what surprised you.",
  },

  "Law & Political Science": {
    skills: ["Legal Research & Reasoning", "Argumentation & Debate", "Policy Analysis", "Ethical Judgment", "Precise Academic Writing"],
    careers: ["Lawyer / Solicitor", "Barrister / Advocate", "Policy Analyst", "Diplomat", "Human Rights Officer", "Legal Researcher"],
    nextSteps: [
      "Join a debate club or moot court — argument skills are the core of legal training.",
      "Study a landmark legal case and try to argue both sides of it in writing.",
      "Research Law, Political Science, or International Relations programs (look at entry requirements early).",
    ],
    strengthKeywords: ["articulate", "principled", "analytical", "persuasive"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Netherlands", flag: "🇳🇱" },
      { name: "France", flag: "🇫🇷" }, { name: "Germany", flag: "🇩🇪" },
      { name: "Canada", flag: "🇨🇦" }, { name: "United States", flag: "🇺🇸" },
    ],
    universitiesByBudget: {
      1: ["Leiden University (Netherlands)", "University of Groningen (Netherlands)", "Heidelberg University (Germany)", "Humboldt University Berlin (Germany)"],
      2: ["Sciences Po (France)", "University of Edinburgh (UK)", "University of Toronto (Canada)", "University of Melbourne (Australia)"],
      3: ["University of Oxford (UK)", "University of Cambridge (UK)", "Yale Law School (USA)", "Harvard Law School (USA)", "London School of Economics (UK)"],
    },
    pathways: [
      { name: "Private Practice", description: "Represent clients in corporate, criminal, or civil matters at a law firm.", roles: ["Trainee Solicitor / Law Clerk", "Associate", "Senior Associate", "Partner"] },
      { name: "Public Service & Policy", description: "Work in government, NGOs, or international bodies to shape policy and uphold rights.", roles: ["Policy Researcher", "Government Legal Advisor", "Diplomat", "International Human Rights Lawyer"] },
      { name: "Academia & Research", description: "Study and teach law, contribute to its development through academic publications.", roles: ["Legal Research Assistant", "Lecturer", "Senior Lecturer", "Professor of Law"] },
    ],
    studyCostLabel: "Moderate",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Think Like a Lawyer", focus: ["Read one landmark case and try to argue both sides (e.g. Brown v Board of Education)", "Study your own country's constitution or legal system basics", "Start reading a quality newspaper critically — analyze political arguments for logic and bias"] },
      q2: { title: "Apr–Jun: Sharpen Communication", focus: ["Join a debate society or school debating team — argue unfamiliar positions", "Write one well-structured argument per week on a current affairs topic", "Practice reading dense text quickly and accurately (contracts, reports, legal documents)"] },
      q3: { title: "Jul–Sep: Build Exposure", focus: ["Attend a public court hearing (most are open to observers)", "Read 'Just Mercy' by Bryan Stevenson or a political biography", "Research human rights organizations and volunteer or intern if possible"] },
      q4: { title: "Oct–Dec: Prepare & Apply", focus: ["Research law programs — check entry grades, interview formats, and application requirements", "Build a portfolio of written arguments and debate achievements", "Draft a personal statement that shows critical thinking, not just interest in justice"] },
    },
    alternativeRoute: { major: "Business Administration & Management", reason: "Corporate law and commercial strategy are closely linked. A business degree with electives in contract or commercial law gives you the analytical flexibility of both worlds." },
    miniProject: "Choose a current real-world legal case or policy debate. Write a structured 2-page argument presenting both sides, then defend one position out loud to someone who disagrees with you.",
  },

  "Mechanical & Civil Engineering": {
    skills: ["CAD Design (AutoCAD / SolidWorks)", "Applied Physics & Structural Mechanics", "Project Management", "Materials Science", "Systems Thinking"],
    careers: ["Mechanical Engineer", "Civil Engineer", "Structural Engineer", "Robotics Engineer", "Aerospace Engineer", "Construction Manager"],
    nextSteps: [
      "Participate in robotics competitions, maker clubs, or engineering challenges at school.",
      "Strengthen your Physics and Mathematics — they're the core of any engineering program.",
      "Explore Mechanical, Civil, Aerospace, or Manufacturing Engineering programs.",
    ],
    strengthKeywords: ["methodical", "hands-on", "precise", "structured thinker"],
    countries: [
      { name: "Germany", flag: "🇩🇪" }, { name: "Netherlands", flag: "🇳🇱" },
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Japan", flag: "🇯🇵" },
      { name: "South Korea", flag: "🇰🇷" }, { name: "Canada", flag: "🇨🇦" },
    ],
    universitiesByBudget: {
      1: ["TU Munich (Germany — low fees)", "TU Berlin (Germany)", "TU Delft (Netherlands)", "KTH Royal Institute of Technology (Sweden)"],
      2: ["University of Waterloo (Canada)", "University of Edinburgh (UK)", "KAIST (South Korea)", "Tokyo Institute of Technology (Japan)"],
      3: ["MIT (USA)", "Imperial College London (UK)", "ETH Zurich (Switzerland)", "Caltech (USA)", "University of Cambridge (UK)"],
    },
    pathways: [
      { name: "Manufacturing & Industry", description: "Design and optimize the physical systems and products that industries depend on.", roles: ["Graduate Engineer", "Design Engineer", "Senior Mechanical Engineer", "Engineering Director"] },
      { name: "Research & Innovation", description: "Push the frontiers of materials, robotics, or energy systems through applied research.", roles: ["R&D Engineer", "Research Engineer", "Innovation Lead", "Chief Technical Officer"] },
      { name: "Infrastructure & Construction", description: "Design, build, and maintain bridges, roads, buildings, and urban infrastructure.", roles: ["Civil Engineering Graduate", "Structural Engineer", "Project Engineer", "Principal Civil Engineer"] },
    ],
    studyCostLabel: "Moderate",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Strengthen Foundations", focus: ["Focus on Physics and Mathematics — especially mechanics, calculus, and geometry", "Watch 3Blue1Brown or CrashCourse Physics to deepen your intuition", "Build or fix something at home — understanding how things work physically matters"] },
      q2: { title: "Apr–Jun: Get Practical", focus: ["Learn basic CAD with Tinkercad (free, browser-based) or Fusion 360 (free for students)", "Join a robotics club, STEM competition, or school engineering team", "Study how a real product is designed and manufactured — reverse-engineer something"] },
      q3: { title: "Jul–Sep: Build Something Real", focus: ["Design and build a project that solves a real problem, however small", "Enter an engineering challenge (e.g. F1 in Schools, bridge-building competitions)", "Explore CAD software more deeply or learn basic programming for microcontrollers (Arduino)"] },
      q4: { title: "Oct–Dec: Prepare & Apply", focus: ["Research engineering programs — compare specializations (mechanical, civil, aerospace, etc.)", "Build a short portfolio showing your projects with photos and explanations", "Prepare for technical interviews or entrance tests if required"] },
    },
    alternativeRoute: { major: "Computer Science & Software Engineering", reason: "If you love systematic thinking but prefer digital systems over physical ones, CS offers the same rigour — applied to software, robotics, and the platforms that power modern industry." },
    miniProject: "Design and build a bridge or structure from craft sticks that can hold maximum weight. Document your design process with sketches, note what failed and why, and calculate your load-to-weight ratio.",
  },

  "Data Science & Statistics": {
    skills: ["Python / R Programming", "Machine Learning Fundamentals", "Statistical Modeling", "Data Visualization (Tableau / Plotly)", "SQL & Databases"],
    careers: ["Data Analyst", "Data Scientist", "ML Engineer", "Business Intelligence Analyst", "Quantitative Researcher", "AI Product Manager"],
    nextSteps: [
      "Start Python for data with Kaggle's free beginner track — it's practical and project-based.",
      "Find a dataset you're genuinely curious about and try to answer a question with it.",
      "Look into Data Science, Statistics, Applied Mathematics, or AI programs.",
    ],
    strengthKeywords: ["analytical", "pattern-seeking", "methodical", "precision-driven"],
    countries: [
      { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" },
      { name: "Canada", flag: "🇨🇦" }, { name: "Germany", flag: "🇩🇪" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Singapore", flag: "🇸🇬" },
    ],
    universitiesByBudget: {
      1: ["TU Munich (Germany)", "LMU Munich (Germany)", "University of Amsterdam (Netherlands)", "University of Helsinki (Finland)"],
      2: ["University of Toronto (Canada)", "University of Edinburgh (UK)", "University of Melbourne (Australia)", "Frankfurt School (Germany)"],
      3: ["Stanford University (USA)", "MIT (USA)", "University of Cambridge (UK)", "National University of Singapore", "ETH Zurich (Switzerland)"],
    },
    pathways: [
      { name: "Tech Industry Track", description: "Join a tech or product company as a data scientist, ML engineer, or analyst.", roles: ["Data Analyst", "Data Scientist", "ML Engineer", "Head of Data"] },
      { name: "Finance & Quant Track", description: "Apply statistical modeling in investment banks, hedge funds, or fintech.", roles: ["Quantitative Analyst", "Risk Analyst", "Portfolio Analyst", "Quant Researcher"] },
      { name: "Research & Academia Track", description: "Contribute to AI/ML research or statistical methodology through academic study.", roles: ["Research Intern", "PhD Researcher", "Research Scientist", "Professor of Statistics"] },
    ],
    studyCostLabel: "Moderate",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Learn the Tools", focus: ["Complete Kaggle's free Python for Data Science beginner course", "Learn how to use a spreadsheet for basic data analysis (sorting, filtering, pivot tables)", "Understand the basics of statistics: mean, median, standard deviation, correlation"] },
      q2: { title: "Apr–Jun: Work with Real Data", focus: ["Download a public dataset on a topic you find interesting and explore it", "Create simple visualizations (bar charts, scatter plots) using Python (matplotlib/seaborn)", "Learn basic SQL to query data from databases (Mode Analytics free course)"] },
      q3: { title: "Jul–Sep: Build Machine Learning Intuition", focus: ["Take fast.ai or Kaggle's ML Intro course (both free)", "Build one machine learning project — predict something using a public dataset", "Learn about model evaluation: what makes a good or bad model?"] },
      q4: { title: "Oct–Dec: Showcase & Apply", focus: ["Document your projects clearly on GitHub with good README files", "Research Data Science, Statistics, or AI university programs", "Prepare your personal statement — show specific curiosity about patterns and systems"] },
    },
    alternativeRoute: { major: "Computer Science & Software Engineering", reason: "If you want to build the systems behind data — the pipelines, models, and platforms that data scientists rely on — a CS degree with an ML or AI specialization is a powerful and in-demand route." },
    miniProject: "Download a free public dataset from Kaggle or Our World in Data. Use Google Sheets or Python to answer one specific question, and create three visualizations that tell a clear story with your findings.",
  },

  "Education & Teaching": {
    skills: ["Curriculum & Lesson Design", "Classroom Facilitation", "Learning Psychology", "Mentoring & Conflict Resolution", "Educational Technology"],
    careers: ["Secondary School Teacher", "Curriculum Designer", "School Counselor", "Educational Researcher", "Corporate Trainer", "EdTech Product Manager"],
    nextSteps: [
      "Volunteer as a tutor or mentor for younger students — even informally.",
      "Reflect on the teachers who made the biggest impact on you, and study what made them effective.",
      "Explore Education, Teaching, or Instructional Design programs at universities.",
    ],
    strengthKeywords: ["patient", "communicative", "empathetic", "inspiring"],
    countries: [
      { name: "Finland", flag: "🇫🇮" }, { name: "Netherlands", flag: "🇳🇱" },
      { name: "Canada", flag: "🇨🇦" }, { name: "Australia", flag: "🇦🇺" },
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Germany", flag: "🇩🇪" },
    ],
    universitiesByBudget: {
      1: ["University of Helsinki (Finland)", "University of Amsterdam (Netherlands)", "University of Oulu (Finland)", "Stockholm University (Sweden)"],
      2: ["OISE, University of Toronto (Canada)", "University of Melbourne (Australia)", "University of Auckland (New Zealand)", "University of Edinburgh (UK)"],
      3: ["UCL Institute of Education (UK)", "Teachers College, Columbia University (USA)", "University of Oxford (UK)", "Harvard Graduate School of Education (USA)"],
    },
    pathways: [
      { name: "Classroom Teaching", description: "Directly teach and mentor students across a specific subject or age group.", roles: ["Student Teacher", "NQT / Newly Qualified Teacher", "Subject Lead", "Head of Department"] },
      { name: "Curriculum & EdTech", description: "Design learning experiences and educational products for schools or businesses.", roles: ["Curriculum Developer", "Instructional Designer", "EdTech Product Manager", "Head of Learning Design"] },
      { name: "Educational Research", description: "Study how people learn and inform policy through evidence-based research.", roles: ["Research Assistant", "Educational Psychologist", "Policy Researcher", "Professor of Education"] },
    ],
    studyCostLabel: "Low",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Observe & Reflect", focus: ["List the qualities of your 3 best teachers and what made them effective", "Read 'Mindset' by Carol Dweck — essential for understanding how students grow", "Start tutoring a younger student, sibling, or friend on a subject you know well"] },
      q2: { title: "Apr–Jun: Teach & Facilitate", focus: ["Organize a small workshop or study group on a topic you enjoy", "Volunteer at a community center, library, or youth group", "Study basic learning science: spaced repetition, retrieval practice, zone of proximal development"] },
      q3: { title: "Jul–Sep: Build Learning Design Skills", focus: ["Design a simple 3-lesson plan on a topic of your choice with clear objectives", "Explore educational platforms (Khan Academy, Duolingo) and analyze what makes them effective", "Practice explaining a complex topic in a 2-minute video or presentation"] },
      q4: { title: "Oct–Dec: Apply With Purpose", focus: ["Research Education, Teaching, or Instructional Design university programs", "Build a mini teaching portfolio: lesson plan, reflection, tutor feedback", "Write a personal statement that shows your belief in education as a tool for change"] },
    },
    alternativeRoute: { major: "Psychology & Social Sciences", reason: "If you love working with people and want to understand the science behind how they learn and grow, educational psychology bridges research and direct practice — opening doors in both." },
    miniProject: "Plan and teach a 45-minute mini-lesson on any topic you know well to a younger sibling, friend, or classmate. Afterwards, write a short reflection: what worked, what confused them, and what you would change.",
  },

  "Finance & Economics": {
    skills: ["Financial Modeling", "Economic Analysis", "Investment Valuation", "Risk Management", "Quantitative Research"],
    careers: ["Investment Banker", "Financial Analyst", "Economist", "Portfolio Manager", "Financial Consultant", "Central Banker"],
    nextSteps: [
      "Read 'The Intelligent Investor' by Benjamin Graham or 'Freakonomics' to develop economic intuition.",
      "Learn Excel and basic financial modeling — it's the industry's core tool.",
      "Explore Finance, Economics, or Accounting programs at universities.",
    ],
    strengthKeywords: ["analytical", "financially literate", "strategic", "detail-oriented"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "United States", flag: "🇺🇸" },
      { name: "Switzerland", flag: "🇨🇭" }, { name: "Singapore", flag: "🇸🇬" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Germany", flag: "🇩🇪" },
    ],
    universitiesByBudget: {
      1: ["Erasmus University Rotterdam (Netherlands)", "University of Mannheim (Germany)", "University of Vienna (Austria)", "Tilburg University (Netherlands)"],
      2: ["University of Edinburgh (UK)", "University of Toronto (Canada)", "University of Melbourne (Australia)", "HEC Montréal (Canada)"],
      3: ["London School of Economics (UK)", "University of Oxford (UK)", "New York University Stern (USA)", "University of Chicago Booth (USA)", "ETH Zurich (Switzerland)"],
    },
    pathways: [
      { name: "Investment & Finance", description: "Work in banking, asset management, or financial markets.", roles: ["Financial Analyst", "Associate Banker", "Portfolio Manager", "Chief Investment Officer"] },
      { name: "Corporate Finance", description: "Lead financial strategy, budgeting, and analysis within organizations.", roles: ["Finance Analyst", "Financial Controller", "CFO", "Group Finance Director"] },
      { name: "Economic Research & Policy", description: "Study economic trends and advise governments, central banks, or NGOs.", roles: ["Research Economist", "Policy Analyst", "Senior Economist", "Chief Economist"] },
    ],
    studyCostLabel: "Moderate–High",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Build Financial Literacy", focus: ["Read 'The Intelligent Investor' or follow Investopedia's free beginner guides", "Track a stock or index fund for 3 months — observe and note what drives changes", "Learn basic Excel: formulas, pivot tables, and simple charts"] },
      q2: { title: "Apr–Jun: Explore Economic Thinking", focus: ["Read Freakonomics or listen to the podcast — economics is everywhere", "Study supply and demand, inflation, and interest rates through Khan Academy", "Analyze one company's annual report — revenue, profit, debt, and what the numbers tell you"] },
      q3: { title: "Jul–Sep: Practice Financial Modeling", focus: ["Build a simple financial model in Excel (e.g. personal budgeting or a mock business)", "Complete a free financial modeling introduction course (CFI or Coursera)", "Follow financial news: Bloomberg, FT, or WSJ — summarize one article per week"] },
      q4: { title: "Oct–Dec: Prepare & Apply", focus: ["Research Finance, Economics, or Accounting programs and their entry requirements", "Join an investing club or school economics competition", "Draft a personal statement emphasizing analytical thinking and financial awareness"] },
    },
    alternativeRoute: { major: "Data Science & Statistics", reason: "Quantitative finance and data science overlap heavily. If you love the numbers side of economics, a data science degree opens doors in fintech, investment analytics, and economic modeling." },
    miniProject: "Pick a publicly traded company and write a 1-page investment case: What does the company do? Is it growing? Is it profitable? Would you invest at the current price, and why?",
  },

  "Architecture & Urban Design": {
    skills: ["Architectural Drawing & CAD", "3D Modeling (Revit / SketchUp)", "Urban Planning Principles", "Structural Awareness", "Sustainable Design"],
    careers: ["Architect", "Urban Planner", "Interior Designer", "Landscape Architect", "Construction Project Manager", "Heritage Conservationist"],
    nextSteps: [
      "Start sketching buildings, interiors, and spaces you find inspiring — daily observation sharpens your eye.",
      "Learn SketchUp Free or AutoCAD LT basics — the tools of the profession.",
      "Explore Architecture, Urban Design, or Interior Architecture programs at universities and design schools.",
    ],
    strengthKeywords: ["spatial thinker", "detail-oriented", "creative", "technically precise"],
    countries: [
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Italy", flag: "🇮🇹" },
      { name: "Spain", flag: "🇪🇸" }, { name: "Germany", flag: "🇩🇪" },
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "United States", flag: "🇺🇸" },
    ],
    universitiesByBudget: {
      1: ["TU Delft (Netherlands)", "TU Berlin (Germany)", "Politecnico di Milano (Italy — EU fees)", "University of Navarra (Spain)"],
      2: ["Politecnico di Milano (Italy — international fees)", "University of Edinburgh (UK)", "RMIT University (Australia)", "Carleton University (Canada)"],
      3: ["Bartlett School of Architecture, UCL (UK)", "ETH Zurich (Switzerland)", "Harvard GSD (USA)", "MIT School of Architecture (USA)", "AA School of Architecture (UK)"],
    },
    pathways: [
      { name: "Private Practice", description: "Work in architecture firms on residential, commercial, or public building projects.", roles: ["Architectural Assistant", "Part II Architect", "Project Architect", "Principal / Director"] },
      { name: "Urban & Landscape Planning", description: "Shape cities, public spaces, and communities at a large scale.", roles: ["Urban Design Assistant", "Urban Planner", "City Planning Director", "Chief Urban Designer"] },
      { name: "Sustainable & Research Design", description: "Push forward environmentally responsible and innovative building methods.", roles: ["Sustainability Researcher", "Green Building Specialist", "Design Researcher", "Professor of Architecture"] },
    ],
    studyCostLabel: "Moderate",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Train Your Eye", focus: ["Sketch one building or space per week — focus on proportion, light, and detail", "Study architectural history: from ancient Greece to Modernism to today", "Visit a building or public space and write a one-page critique: what works, what doesn't?"] },
      q2: { title: "Apr–Jun: Learn the Tools", focus: ["Learn SketchUp Free — model your bedroom or a simple building", "Study basic technical drawing: floor plans, elevations, sections", "Explore sustainable design principles: passive cooling, natural light, material choices"] },
      q3: { title: "Jul–Sep: Design a Project", focus: ["Design a small structure from scratch: a bus shelter, garden pavilion, or tiny house", "Document your design process with sketches, models, and written rationale", "Visit or photograph interesting buildings and analyze their spatial qualities"] },
      q4: { title: "Oct–Dec: Build Your Portfolio", focus: ["Compile your sketches, drawings, and projects into a presentation portfolio", "Research architecture schools — most require a portfolio for admission", "Write your design statement: what draws you to architecture and why does space matter to you?"] },
    },
    alternativeRoute: { major: "Mechanical & Civil Engineering", reason: "If you love the structural and technical side of buildings more than design and aesthetics, civil engineering focuses on the systems, physics, and construction that make architecture possible." },
    miniProject: "Design a small public space — a park bench, a bus stop, or a small plaza. Sketch your design from three perspectives (plan, elevation, and 3D view) and write a brief explaining your decisions about materials, light, and how people will use it.",
  },

  "Pharmacy & Biomedical Sciences": {
    skills: ["Pharmacology & Drug Mechanisms", "Laboratory Techniques", "Clinical Biochemistry", "Regulatory Affairs", "Patient Counseling"],
    careers: ["Pharmacist", "Biomedical Scientist", "Clinical Research Associate", "Drug Development Researcher", "Pharmaceutical Consultant", "Medical Science Liaison"],
    nextSteps: [
      "Focus on Chemistry and Biology — both are essential foundations for pharmacy and biomedical science.",
      "Volunteer or shadow at a community pharmacy to understand patient-facing work.",
      "Research Pharmacy, Biomedical Science, or Biochemistry programs — note that Pharmacy is a regulated profession with specific entry requirements.",
    ],
    strengthKeywords: ["precise", "scientifically rigorous", "detail-oriented", "patient-focused"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Germany", flag: "🇩🇪" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Australia", flag: "🇦🇺" },
      { name: "Canada", flag: "🇨🇦" }, { name: "United States", flag: "🇺🇸" },
    ],
    universitiesByBudget: {
      1: ["University of Groningen (Netherlands)", "Heidelberg University (Germany)", "University of Helsinki (Finland)", "Ghent University (Belgium)"],
      2: ["University of Toronto (Canada)", "University of Melbourne (Australia)", "University of Nottingham (UK)", "University College Dublin (Ireland)"],
      3: ["University College London (UK)", "University of Cambridge (UK)", "University of Michigan (USA)", "Monash University (Australia)", "King's College London (UK)"],
    },
    pathways: [
      { name: "Clinical Pharmacy", description: "Work in hospitals, community pharmacies, or healthcare settings advising patients on medication.", roles: ["Pre-registration Pharmacist", "Community Pharmacist", "Hospital Pharmacist", "Lead Clinical Pharmacist"] },
      { name: "Pharmaceutical Industry", description: "Work in drug development, regulatory affairs, or medical sales within pharma companies.", roles: ["Research Associate", "Clinical Research Associate", "Regulatory Affairs Specialist", "Medical Science Liaison"] },
      { name: "Research & Academia", description: "Advance biomedical knowledge through laboratory and clinical research.", roles: ["Research Technician", "PhD Researcher", "Principal Investigator", "Professor of Pharmacology"] },
    ],
    studyCostLabel: "Moderate–High",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Strengthen Science Foundations", focus: ["Focus on Chemistry (organic chemistry especially) and Biology — core to pharmacy", "Explore Khan Academy's chemistry and biology series for free revision", "Research what pharmacists and biomedical scientists do day to day"] },
      q2: { title: "Apr–Jun: Get Exposure", focus: ["Volunteer or shadow at a community pharmacy — patient interaction is central to the role", "Study how drugs work: receptors, mechanisms, and side effects at a basic level", "Read about a recent drug development story — from research to approval to patient use"] },
      q3: { title: "Jul–Sep: Explore Laboratory Work", focus: ["If available, take part in science lab work at school or a summer program", "Study the drug approval process: how medicines go from lab to pharmacy shelf", "Learn about clinical trials: phases, ethics, and how safety is tested"] },
      q4: { title: "Oct–Dec: Apply With Purpose", focus: ["Research Pharmacy and Biomedical Science programs — Pharmacy requires specific grades and often interviews", "Write a personal statement that shows scientific rigor and care for patients", "Prepare for interviews: pharmacist programs often assess communication and ethical reasoning"] },
    },
    alternativeRoute: { major: "Medicine & Health Sciences", reason: "If your passion is for clinical care and diagnosis rather than medication management, medicine offers the full patient journey — with pharmacology as just one part of a broader clinical education." },
    miniProject: "Choose a common medication (e.g. paracetamol, ibuprofen, or aspirin) and write a one-page explainer: what it does, how it works in the body, its side effects, and who should avoid it. Write it clearly enough for a patient to understand.",
  },

  "Communication & Media Studies": {
    skills: ["Storytelling & Narrative Construction", "Digital Content Production", "Media Ethics & Criticism", "Social Media Strategy", "Broadcast & Journalism Techniques"],
    careers: ["Journalist", "PR Specialist", "Content Strategist", "Broadcast Producer", "Social Media Manager", "Communications Director"],
    nextSteps: [
      "Start creating content — write a blog, launch a podcast, or produce short videos on a topic you care about.",
      "Read widely: quality journalism, opinion pieces, and media criticism to sharpen your eye.",
      "Explore Journalism, Media Studies, Communication, or Public Relations programs.",
    ],
    strengthKeywords: ["communicative", "persuasive", "curious", "storyteller"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "United States", flag: "🇺🇸" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Australia", flag: "🇦🇺" },
      { name: "Denmark", flag: "🇩🇰" }, { name: "Canada", flag: "🇨🇦" },
    ],
    universitiesByBudget: {
      1: ["University of Amsterdam (Netherlands)", "Aarhus University (Denmark)", "University of Copenhagen (Denmark)", "Stockholm University (Sweden)"],
      2: ["University of Toronto (Canada)", "University of Melbourne (Australia)", "University of Nottingham (UK)", "Dublin City University (Ireland)"],
      3: ["Columbia University Graduate School of Journalism (USA)", "London School of Economics (UK)", "Northwestern University Medill (USA)", "University of Oxford (UK)", "City, University of London (UK)"],
    },
    pathways: [
      { name: "Journalism & Media", description: "Report, investigate, and publish stories across print, broadcast, and digital platforms.", roles: ["Editorial Assistant", "Reporter / Correspondent", "Senior Journalist", "Editor / Bureau Chief"] },
      { name: "PR & Communications", description: "Shape how organizations communicate with the public, press, and stakeholders.", roles: ["PR Executive", "Communications Specialist", "Head of Communications", "PR Director"] },
      { name: "Digital Content & Strategy", description: "Create and distribute content across digital and social platforms to build audiences.", roles: ["Content Creator", "Social Media Manager", "Content Strategist", "Head of Digital"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Find Your Voice", focus: ["Start writing regularly: a blog, journal entries, or opinion pieces on topics you care about", "Read 3 different news sources daily and compare how they frame the same story", "Watch one documentary and write a one-page analysis of its storytelling techniques"] },
      q2: { title: "Apr–Jun: Create & Publish", focus: ["Launch a small media project: a podcast, YouTube channel, newsletter, or Instagram page", "Interview someone you find interesting — practice asking open-ended questions", "Study media ethics: what makes journalism trustworthy? What is bias?"] },
      q3: { title: "Jul–Sep: Expand Your Toolkit", focus: ["Learn basic video or audio editing (DaVinci Resolve or Audacity, both free)", "Practice writing for different formats: news article, opinion piece, script, social caption", "Submit a piece to your school newspaper, local publication, or an online platform"] },
      q4: { title: "Oct–Dec: Build a Portfolio", focus: ["Compile your best work: articles, videos, podcasts, or social campaigns", "Research Journalism, Media Studies, or Communication programs", "Write a personal statement highlighting your curiosity, ethical awareness, and storytelling examples"] },
    },
    alternativeRoute: { major: "Marketing & Advertising", reason: "If you love storytelling and communication but want a clear commercial focus, marketing channels your creativity into audience strategy, brand building, and measurable campaigns." },
    miniProject: "Pick a story happening in your local community that hasn't been covered. Research it, interview at least one person involved, and write a 500-word news article or produce a 3-minute video report.",
  },

  "International Relations & Global Affairs": {
    skills: ["Geopolitical Analysis", "Diplomatic Communication", "International Law & Policy", "Cross-Cultural Competency", "Research & Report Writing"],
    careers: ["Diplomat", "Policy Analyst", "NGO Program Manager", "International Trade Specialist", "Think-Tank Researcher", "UN / EU Affairs Officer"],
    nextSteps: [
      "Follow global news closely — The Economist, BBC World, or Foreign Affairs are great starting points.",
      "Learn a second language or deepen one you already have — diplomacy runs on languages.",
      "Explore International Relations, Political Science, or Global Studies programs.",
    ],
    strengthKeywords: ["globally minded", "diplomatic", "analytical", "multilingual"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Belgium", flag: "🇧🇪" },
      { name: "Switzerland", flag: "🇨🇭" }, { name: "Netherlands", flag: "🇳🇱" },
      { name: "France", flag: "🇫🇷" }, { name: "United States", flag: "🇺🇸" },
    ],
    universitiesByBudget: {
      1: ["University of Groningen (Netherlands)", "Leiden University (Netherlands)", "University of Vienna (Austria)", "Charles University Prague (Czech Republic)"],
      2: ["Sciences Po (France)", "University of Edinburgh (UK)", "University of Toronto (Canada)", "KU Leuven (Belgium)"],
      3: ["London School of Economics (UK)", "University of Oxford (UK)", "Georgetown University Walsh School (USA)", "Columbia SIPA (USA)", "Graduate Institute Geneva (Switzerland)"],
    },
    pathways: [
      { name: "Diplomacy & Government", description: "Represent your country or work within government on international affairs.", roles: ["Foreign Service Officer", "Political Officer", "First Secretary", "Ambassador / Consul General"] },
      { name: "International Organizations", description: "Work within the UN, EU, WTO, or other international bodies.", roles: ["Programme Associate", "Policy Officer", "Senior Programme Manager", "Director General"] },
      { name: "Think Tanks & Research", description: "Analyze global trends, produce policy papers, and advise decision-makers.", roles: ["Research Analyst", "Policy Researcher", "Senior Fellow", "Director of Policy Research"] },
    ],
    studyCostLabel: "Moderate",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Build Global Awareness", focus: ["Read one quality international newspaper daily (The Economist, BBC, or Foreign Policy)", "Study a current global conflict or treaty — understand the history, interests, and key players", "Learn about one international organization (UN, EU, NATO, WTO) in depth"] },
      q2: { title: "Apr–Jun: Develop Key Skills", focus: ["Join or start a Model UN club — it develops diplomacy, research, and public speaking simultaneously", "Improve or begin a second language — even basic conversational skills signal global commitment", "Write a position paper on an international issue from two opposing national perspectives"] },
      q3: { title: "Jul–Sep: Explore the Field", focus: ["Volunteer with an internationally-focused NGO, charity, or human rights organization", "Interview someone who works in diplomacy, development, or international policy", "Study the basics of international law and human rights frameworks (UN Charter, Geneva Conventions)"] },
      q4: { title: "Oct–Dec: Prepare & Apply", focus: ["Research International Relations, Global Affairs, or Political Science programs", "Build a portfolio of research papers, Model UN positions, or opinion pieces", "Write a personal statement that shows genuine global curiosity, language skills, and policy engagement"] },
    },
    alternativeRoute: { major: "Law & Political Science", reason: "International law and political science provide the legal and governance frameworks that underpin diplomacy. If you're drawn to institutions and legal systems rather than cultural dynamics, this route is equally powerful." },
    miniProject: "Choose an ongoing international dispute or treaty negotiation. Write a two-page briefing document as if you were advising a government: background, key parties, interests, risks, and your recommended policy position.",
  },

  "Cybersecurity & Network Engineering": {
    skills: ["Network Architecture & Protocols", "Ethical Hacking & Penetration Testing", "Cryptography Fundamentals", "Threat Detection & Incident Response", "Security Auditing"],
    careers: ["Cybersecurity Analyst", "Penetration Tester", "Security Engineer", "Network Engineer", "CISO (Chief Information Security Officer)", "Forensic Analyst"],
    nextSteps: [
      "Start with CompTIA Security+ or Google's free Cybersecurity Certificate on Coursera.",
      "Set up a home lab using free tools like VirtualBox and practice ethical hacking on legal platforms like TryHackMe.",
      "Look into Cybersecurity, Computer Science, or Network Engineering programs.",
    ],
    strengthKeywords: ["analytical", "technical", "security-minded", "problem solver"],
    countries: [
      { name: "United States", flag: "🇺🇸" }, { name: "United Kingdom", flag: "🇬🇧" },
      { name: "Israel", flag: "🇮🇱" }, { name: "Germany", flag: "🇩🇪" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Australia", flag: "🇦🇺" },
    ],
    universitiesByBudget: {
      1: ["TU Delft (Netherlands)", "Ruhr University Bochum (Germany)", "University of Helsinki (Finland)", "TU Berlin (Germany)"],
      2: ["University of Edinburgh (UK)", "University of Waterloo (Canada)", "Deakin University (Australia)", "Royal Holloway, University of London (UK)"],
      3: ["Carnegie Mellon University (USA)", "MIT (USA)", "University of Oxford (UK)", "Georgia Tech (USA)", "Imperial College London (UK)"],
    },
    pathways: [
      { name: "Offensive Security", description: "Find vulnerabilities before attackers do — as a penetration tester or red team specialist.", roles: ["Junior Penetration Tester", "Security Consultant", "Senior Pen Tester", "Red Team Lead"] },
      { name: "Defensive Security", description: "Protect systems and respond to breaches as a security analyst or engineer.", roles: ["SOC Analyst", "Security Engineer", "Incident Response Lead", "CISO"] },
      { name: "Research & Governance", description: "Advance cybersecurity knowledge or shape policy and compliance frameworks.", roles: ["Security Researcher", "Compliance Analyst", "Cyber Policy Advisor", "Head of Information Security"] },
    ],
    studyCostLabel: "Moderate",
    studyCostColor: "text-amber-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Learn the Fundamentals", focus: ["Complete Google's free Cybersecurity Certificate (Coursera) or CompTIA Security+ prep", "Understand how the internet works: IP addresses, DNS, HTTP, TCP/IP", "Create a free TryHackMe account and complete the beginner learning path"] },
      q2: { title: "Apr–Jun: Build Practical Skills", focus: ["Set up a virtual machine using VirtualBox (free) and practice safely in isolated environments", "Learn basic Linux commands — most security tools run on Linux", "Complete 5 TryHackMe or HackTheBox beginner rooms"] },
      q3: { title: "Jul–Sep: Go Deeper", focus: ["Study a real-world cyberattack (e.g. SolarWinds, WannaCry) — what went wrong and why?", "Learn basic Python scripting for security automation", "Explore cryptography basics: how encryption, hashing, and certificates work"] },
      q4: { title: "Oct–Dec: Prepare & Apply", focus: ["Earn a beginner certification (CompTIA Security+ or Google Cybersecurity Certificate)", "Document your labs and projects on a GitHub portfolio", "Research Cybersecurity or Computer Science programs with strong security specializations"] },
    },
    alternativeRoute: { major: "Computer Science & Software Engineering", reason: "All cybersecurity is built on software foundations. A CS degree with a security specialization gives you the deep technical base to tackle the most complex security challenges in the industry." },
    miniProject: "Set up a free TryHackMe account and complete the 'Pre-Security' learning path. Write a one-page reflection on what you learned: what surprised you about how systems can be attacked and what basic defences matter most.",
  },

  "Game Design & Interactive Media": {
    skills: ["Game Mechanics & Level Design", "Unity / Unreal Engine Basics", "Narrative & Storytelling for Games", "User Experience in Interactive Systems", "Rapid Prototyping"],
    careers: ["Game Designer", "Level Designer", "Narrative Designer", "UX Designer (Digital)", "Interactive Media Artist", "VR/AR Developer"],
    nextSteps: [
      "Download Unity (free) and follow their official beginner tutorials — build your first game in a weekend.",
      "Play games critically — analyze why they're fun, frustrating, or compelling.",
      "Explore Game Design, Interactive Media, or Computer Science programs with a game development focus.",
    ],
    strengthKeywords: ["creative", "playful systems thinker", "imaginative", "technically curious"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Canada", flag: "🇨🇦" },
      { name: "Finland", flag: "🇫🇮" }, { name: "Sweden", flag: "🇸🇪" },
      { name: "United States", flag: "🇺🇸" }, { name: "Netherlands", flag: "🇳🇱" },
    ],
    universitiesByBudget: {
      1: ["Aalto University (Finland)", "Malmö University (Sweden)", "University of Skövde (Sweden)", "Breda University of Applied Sciences (Netherlands)"],
      2: ["Abertay University (UK)", "University of the Arts London (UK)", "Queensland University of Technology (Australia)", "NSCAD University (Canada)"],
      3: ["DigiPen Institute of Technology (USA)", "Ringling College of Art and Design (USA)", "Goldsmiths, University of London (UK)", "USC School of Cinematic Arts (USA)"],
    },
    pathways: [
      { name: "Studio Game Development", description: "Work within a game studio as a designer, developer, or artist.", roles: ["Junior Game Designer", "Level Designer", "Senior Game Designer", "Creative Director"] },
      { name: "Independent / Indie Development", description: "Build and publish your own games independently.", roles: ["Indie Developer", "Solo Creator", "Game Studio Founder", "Published Game Designer"] },
      { name: "Interactive Media & XR", description: "Design experiences beyond games: VR, AR, interactive installations, and simulations.", roles: ["XR Designer", "Interactive Media Artist", "UX Designer", "Innovation Lead"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Learn the Tools", focus: ["Install Unity (free) and complete the 'Roll-a-Ball' and 'Karting Microgame' beginner tutorials", "Study basic game design theory: core loops, feedback systems, and player motivation", "Play 3 games critically — write notes on what makes each one enjoyable or frustrating"] },
      q2: { title: "Apr–Jun: Build Your First Game", focus: ["Build a small complete game from scratch — even a simple puzzle or platformer counts", "Learn the basics of C# scripting in Unity or Blueprints in Unreal (both free)", "Share your game with friends and watch them play without explaining — observe silently"] },
      q3: { title: "Jul–Sep: Expand Skills", focus: ["Add more mechanics to your game or start a second, more ambitious project", "Study narrative design: how games tell stories through mechanics, not just cutscenes", "Participate in a game jam (itch.io hosts free 48-hour jams monthly) — ship something under pressure"] },
      q4: { title: "Oct–Dec: Build a Portfolio", focus: ["Polish and publish at least one game on itch.io — free hosting for indie games", "Document your design process: decisions, prototypes, and lessons learned", "Research Game Design programs — many require a portfolio or design documentation for admission"] },
    },
    alternativeRoute: { major: "Computer Science & Software Engineering", reason: "If the technical and engineering challenges of game development excite you more than design and narrative, a CS degree with game development electives gives you the deepest technical foundation for the industry." },
    miniProject: "Build and publish a playable game on itch.io. It could be a text adventure, a simple platformer, or a puzzle. Include a short design document explaining your core mechanic and one decision you made to improve the player experience.",
  },

  "Nursing & Allied Health": {
    skills: ["Clinical Assessment & Care Planning", "Patient Communication & Advocacy", "Medical Procedures & Safety", "Evidence-Based Practice", "Interdisciplinary Teamwork"],
    careers: ["Registered Nurse", "Midwife", "Physiotherapist", "Occupational Therapist", "Paramedic", "Nurse Practitioner / Advanced Practice Nurse"],
    nextSteps: [
      "Volunteer at a care home, hospital, or health charity to gain direct patient experience.",
      "Study Biology and Chemistry — both are required for most nursing and allied health programs.",
      "Research Nursing, Physiotherapy, Midwifery, or Occupational Therapy programs — many have specific entry requirements and limited places.",
    ],
    strengthKeywords: ["compassionate", "resilient", "action-oriented", "patient-centered"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Australia", flag: "🇦🇺" },
      { name: "Canada", flag: "🇨🇦" }, { name: "Ireland", flag: "🇮🇪" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Germany", flag: "🇩🇪" },
    ],
    universitiesByBudget: {
      1: ["HAN University of Applied Sciences (Netherlands)", "Charité Berlin (Germany)", "University of Helsinki (Finland)", "University College Cork (Ireland)"],
      2: ["University of Toronto (Canada)", "Queensland University of Technology (Australia)", "University of Edinburgh (UK)", "University College Dublin (Ireland)"],
      3: ["King's College London (UK)", "University of Melbourne (Australia)", "University of Pennsylvania (USA)", "University of Sydney (Australia)", "McMaster University (Canada)"],
    },
    pathways: [
      { name: "Clinical Nursing", description: "Provide direct patient care in hospitals, community settings, or specialist units.", roles: ["Student Nurse", "Registered Nurse", "Senior Nurse / Charge Nurse", "Nurse Consultant / Nurse Practitioner"] },
      { name: "Allied Health & Therapy", description: "Support patient recovery and wellbeing as a physio, OT, paramedic, or specialist.", roles: ["Allied Health Student", "Physiotherapist / OT", "Senior Clinician", "Department Lead / Specialist"] },
      { name: "Healthcare Leadership & Policy", description: "Move into management, education, or health policy to improve systems at scale.", roles: ["Charge Nurse / Ward Manager", "Clinical Educator", "Director of Nursing", "Chief Nursing Officer"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Build Foundations", focus: ["Strengthen Biology (anatomy, physiology) — essential for all health programs", "Learn about the nursing and allied health professions: day-in-the-life videos, NMC standards", "Explore the difference between nursing, midwifery, physiotherapy, OT, and paramedicine"] },
      q2: { title: "Apr–Jun: Gain Experience", focus: ["Volunteer at a care home, hospital, or hospice — even 2 hours/week is valuable", "Shadow a nurse or allied health professional if possible through school or personal connections", "Learn basic first aid (many courses are free or low cost)"] },
      q3: { title: "Jul–Sep: Develop Soft Skills", focus: ["Practice active listening and communication — essential in all clinical roles", "Reflect on a challenging situation where you supported someone — write about it", "Learn about patient safety: what are the most common clinical errors and how are they prevented?"] },
      q4: { title: "Oct–Dec: Apply With Purpose", focus: ["Research nursing and allied health programs — many require documented patient experience in your application", "Write a personal statement that shows empathy, resilience, and specific patient-facing examples", "Prepare for any interviews: health programs often test ethical reasoning and communication skills"] },
    },
    alternativeRoute: { major: "Medicine & Health Sciences", reason: "If you want greater clinical autonomy, prescribing rights, and diagnostic responsibility, medicine is the natural progression — though it requires a longer training path and higher academic entry requirements." },
    miniProject: "Spend one day volunteering or shadowing in a healthcare setting. Afterwards, write a one-page reflection: What did you observe? What surprised you? What skill would you most need to develop to work effectively in that environment?",
  },

  "Marketing & Advertising": {
    skills: ["Brand Strategy & Positioning", "Consumer Psychology", "Digital Marketing (SEO / Paid Media)", "Campaign Planning & Analytics", "Creative Copywriting"],
    careers: ["Marketing Manager", "Brand Strategist", "Digital Marketing Specialist", "Advertising Creative", "Market Research Analyst", "Chief Marketing Officer"],
    nextSteps: [
      "Complete Google's free Digital Marketing Certificate on Skillshop — it's industry-recognized and practical.",
      "Launch a social media page or small campaign on a topic you care about and analyze what works.",
      "Explore Marketing, Advertising, Business, or Communications programs.",
    ],
    strengthKeywords: ["persuasive", "creative", "data-driven", "audience-aware"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "United States", flag: "🇺🇸" },
      { name: "Netherlands", flag: "🇳🇱" }, { name: "Australia", flag: "🇦🇺" },
      { name: "Canada", flag: "🇨🇦" }, { name: "Germany", flag: "🇩🇪" },
    ],
    universitiesByBudget: {
      1: ["University of Amsterdam (Netherlands)", "Tilburg University (Netherlands)", "Maastricht University (Netherlands)", "University of Mannheim (Germany)"],
      2: ["University of Edinburgh (UK)", "University of Melbourne (Australia)", "McGill University (Canada)", "Dublin City University (Ireland)"],
      3: ["London Business School (UK)", "Northwestern University Kellogg (USA)", "HEC Paris (France)", "University of Oxford (UK)", "New York University Stern (USA)"],
    },
    pathways: [
      { name: "Brand & Strategy", description: "Shape how companies position themselves and connect with their audiences.", roles: ["Marketing Coordinator", "Brand Manager", "Marketing Director", "Chief Marketing Officer"] },
      { name: "Digital & Performance Marketing", description: "Drive measurable results through SEO, paid media, email, and analytics.", roles: ["Digital Marketing Exec", "PPC / SEO Specialist", "Performance Manager", "Head of Digital"] },
      { name: "Creative & Advertising", description: "Develop campaigns, copy, and creative concepts that move audiences.", roles: ["Junior Copywriter / Creative", "Advertising Executive", "Creative Director", "Executive Creative Director"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Understand Marketing Basics", focus: ["Complete Google's free Digital Marketing Fundamentals certificate (Skillshop)", "Study one brand you admire — how do they position themselves vs. competitors?", "Learn the 4 Ps of marketing and apply them to a real brand"] },
      q2: { title: "Apr–Jun: Create & Test", focus: ["Launch a social media account on a topic you care about — grow it intentionally", "Write 10 pieces of copy (ads, captions, taglines) and analyze what performs best", "Learn basic analytics: Google Analytics (free), social media insights, email open rates"] },
      q3: { title: "Jul–Sep: Study Consumer Psychology", focus: ["Read 'Influence' by Cialdini — understanding persuasion is central to marketing", "Analyze 5 advertising campaigns: what emotional trigger does each one use?", "Learn SEO basics using Moz's free Beginner's Guide to SEO"] },
      q4: { title: "Oct–Dec: Build a Portfolio", focus: ["Document your campaigns, copy, and analytics results in a marketing portfolio", "Research Marketing, Communications, or Business programs", "Write a personal statement that highlights your creativity, commercial awareness, and analytical approach"] },
    },
    alternativeRoute: { major: "Communication & Media Studies", reason: "If you love storytelling and public discourse more than commercial strategy, media studies opens doors in journalism, PR, and content creation — where influence is measured in reach and trust rather than conversion." },
    miniProject: "Create a mock marketing campaign for a local business or cause you care about. Include: a target audience profile, a key message, two social media posts with visuals, and a one-paragraph rationale explaining why your approach will resonate.",
  },

  "Linguistics & Translation": {
    skills: ["Phonology, Syntax & Semantics", "Second Language Acquisition", "Translation Theory & Practice", "Computational Linguistics Basics", "Cross-Cultural Communication"],
    careers: ["Translator / Interpreter", "Linguistic Researcher", "Language Teacher", "Localization Specialist", "Computational Linguist", "Speech & Language Therapist"],
    nextSteps: [
      "Study a second or third language seriously — fluency and cultural insight are the core of this field.",
      "Read 'The Language Instinct' by Steven Pinker — a fascinating introduction to linguistic science.",
      "Explore Linguistics, Modern Languages, or Translation programs.",
    ],
    strengthKeywords: ["linguistically sharp", "culturally aware", "precise", "analytical"],
    countries: [
      { name: "United Kingdom", flag: "🇬🇧" }, { name: "Netherlands", flag: "🇳🇱" },
      { name: "Germany", flag: "🇩🇪" }, { name: "France", flag: "🇫🇷" },
      { name: "Canada", flag: "🇨🇦" }, { name: "Switzerland", flag: "🇨🇭" },
    ],
    universitiesByBudget: {
      1: ["Leiden University (Netherlands)", "Humboldt University Berlin (Germany)", "Uppsala University (Sweden)", "University of Helsinki (Finland)"],
      2: ["KU Leuven (Belgium)", "University of Edinburgh (UK)", "McGill University (Canada)", "University of Vienna (Austria)"],
      3: ["University of Cambridge (UK)", "University of Oxford (UK)", "SOAS University of London (UK)", "Georgetown University (USA)", "ETH Zurich (Switzerland)"],
    },
    pathways: [
      { name: "Translation & Interpretation", description: "Bridge language barriers in legal, medical, diplomatic, and literary contexts.", roles: ["Junior Translator", "Conference Interpreter", "Senior Translator", "Head of Translation"] },
      { name: "Linguistic Research & Academia", description: "Study how language works, evolves, and interacts with cognition and culture.", roles: ["Research Assistant", "PhD Linguist", "Senior Researcher", "Professor of Linguistics"] },
      { name: "Language Technology", description: "Apply linguistic knowledge to AI, NLP, and computational language systems.", roles: ["Computational Linguist", "NLP Engineer", "Language Data Analyst", "Head of Language Technology"] },
    ],
    studyCostLabel: "Low–Moderate",
    studyCostColor: "text-green-600",
    twelveMonthPlan: {
      q1: { title: "Jan–Mar: Explore Language Scientifically", focus: ["Read 'The Language Instinct' (Pinker) or listen to the 'Lingthusiasm' podcast", "Study one linguistic concept per week: phonemes, morphemes, syntax trees, pragmatics", "Choose a language to study seriously and set a weekly practice goal"] },
      q2: { title: "Apr–Jun: Practice Translation", focus: ["Translate a short article from one language to another and analyze every choice you made", "Compare different published translations of the same text — why did translators choose differently?", "Study a language you find structurally fascinating — Japanese, Arabic, or Finnish for their unique features"] },
      q3: { title: "Jul–Sep: Connect Language to Technology", focus: ["Explore how AI translation (Google Translate, DeepL) works and where it still fails", "Learn basic Python — it's the gateway to natural language processing (NLP)", "Take a free NLP introduction course (Coursera or fast.ai)"] },
      q4: { title: "Oct–Dec: Apply With Focus", focus: ["Research Linguistics, Translation, or Modern Languages programs", "Build a small portfolio: translation samples, a linguistic analysis paper, or a language learning journal", "Write a personal statement demonstrating your love of language systems and cross-cultural awareness"] },
    },
    alternativeRoute: { major: "International Relations & Global Affairs", reason: "Language and culture are at the heart of diplomacy. If you want to apply your linguistic skills at a political and policy level, international relations values multilingualism and cross-cultural expertise deeply." },
    miniProject: "Take a 500-word newspaper article and translate it into another language you know — even partially. Then write a one-page reflection: which words were hardest to translate and why? What does that tell you about how language shapes meaning?",
  },
};

// ─── Dimension scoring ────────────────────────────────────────────────────────
interface Dims {
  analytical: number; creative: number; social: number;
  technical: number; leadership: number; research: number; business: number;
}

function scoreDimensions(a: QuestionnaireAnswers): Dims {
  const d: Dims = { analytical: 0, creative: 0, social: 0, technical: 0, leadership: 0, research: 0, business: 0 };
  const { subjects, interests, strengths, workStyle, careerEnv, learningApproach, workOrientation, futureGoals } = a;

  // Subjects
  if (subjects.includes("Mathematics"))            { d.analytical += 2; d.technical += 1; }
  if (subjects.includes("Computer Science"))       { d.technical += 3; d.analytical += 1; }
  if (subjects.includes("Physics"))                { d.technical += 2; d.analytical += 1; }
  if (subjects.includes("Biology"))                { d.research += 2; d.social += 1; }
  if (subjects.includes("Chemistry"))              { d.research += 2; d.technical += 1; }
  if (subjects.includes("History"))                { d.analytical += 1; d.research += 1; }
  if (subjects.includes("Economics"))              { d.business += 2; d.analytical += 1; }
  if (subjects.includes("Art / Design"))           { d.creative += 3; }
  if (subjects.includes("Literature / Languages")) { d.creative += 1; d.social += 2; }
  if (subjects.includes("Geography"))              { d.research += 1; d.analytical += 1; }

  // Interests (new strings)
  if (interests.includes("Building technology & software"))      { d.technical += 3; d.analytical += 1; }
  if (interests.includes("Launching businesses & startups"))     { d.business += 3; d.leadership += 1; }
  if (interests.includes("Creating visual art & design"))        { d.creative += 3; }
  if (interests.includes("Advancing science through research"))  { d.research += 3; d.analytical += 1; }
  if (interests.includes("Helping people with health & wellbeing")) { d.social += 2; d.research += 1; }
  if (interests.includes("Shaping minds through education"))     { d.social += 3; }
  if (interests.includes("Defending justice & policy"))          { d.analytical += 2; d.social += 1; }
  if (interests.includes("Protecting the environment"))          { d.research += 2; d.social += 1; }
  if (interests.includes("Supporting communities & social causes")) { d.social += 3; }
  if (interests.includes("Engineering innovative systems"))      { d.technical += 3; d.analytical += 1; }

  // Strengths (new strings)
  if (strengths.includes("Breaking down complex problems"))      { d.analytical += 3; }
  if (strengths.includes("Thinking creatively and originally"))  { d.creative += 3; }
  if (strengths.includes("Connecting with and understanding people")) { d.social += 3; }
  if (strengths.includes("Leading and motivating others"))       { d.leadership += 3; d.business += 1; }
  if (strengths.includes("Technical or digital skills"))         { d.technical += 3; }
  if (strengths.includes("Organizing and planning effectively")) { d.business += 2; d.analytical += 1; }
  if (strengths.includes("Researching and digging into topics")) { d.research += 3; d.analytical += 1; }
  if (strengths.includes("Explaining things clearly to others")) { d.social += 2; d.leadership += 1; }
  if (strengths.includes("Staying calm and finding solutions"))  { d.analytical += 2; d.technical += 1; }

  // Work style (new strings)
  if (workStyle === "Analyzing data and patterns")              { d.analytical += 2; d.technical += 1; }
  if (workStyle === "Collaborating and connecting with people") { d.social += 3; d.leadership += 1; }
  if (workStyle === "Building or fixing physical things")       { d.technical += 2; }
  if (workStyle === "Designing and creating something new")     { d.creative += 3; }
  if (workStyle === "Working independently on focused tasks")   { d.research += 2; d.analytical += 1; }
  if (workStyle === "Managing a team toward a shared goal")     { d.leadership += 3; d.business += 1; }

  // Career environment (new strings)
  if (careerEnv === "A research lab or university")             { d.research += 3; d.analytical += 1; }
  if (careerEnv === "A fast-paced corporate environment")       { d.business += 3; d.leadership += 1; }
  if (careerEnv === "My own startup or business")               { d.business += 2; d.leadership += 2; d.technical += 1; }
  if (careerEnv === "A creative studio or agency")              { d.creative += 3; }
  if (careerEnv === "A school, hospital, or community space")   { d.social += 3; }
  if (careerEnv === "Outdoors or in the field")                 { d.research += 2; }
  if (careerEnv === "A hospital or healthcare setting")         { d.social += 2; d.research += 1; }
  if (careerEnv === "A government or policy institution")       { d.analytical += 2; d.social += 1; d.leadership += 1; }

  // Learning approach (new strings)
  if (learningApproach === "Reading deeply and theorizing")         { d.research += 2; d.analytical += 1; }
  if (learningApproach === "Hands-on practice and experimentation") { d.technical += 2; }
  if (learningApproach === "Creative exploration and play")         { d.creative += 2; }
  if (learningApproach === "Group projects and discussion")         { d.social += 2; d.leadership += 1; }
  if (learningApproach === "Solo deep-dives and self-study")        { d.research += 2; d.analytical += 1; }
  if (learningApproach === "Data analysis and structured reasoning") { d.analytical += 2; d.technical += 1; }

  // Work orientation (new strings)
  if (workOrientation === "Push the boundaries of scientific knowledge") { d.research += 3; d.analytical += 1; }
  if (workOrientation === "Build products that millions of people use")  { d.technical += 3; }
  if (workOrientation === "Lead teams and shape organizations")           { d.leadership += 3; d.business += 1; }
  if (workOrientation === "Bring beauty and meaning into the world")     { d.creative += 3; }
  if (workOrientation === "Directly improve people's lives day to day")  { d.social += 3; }
  if (workOrientation === "Find patterns that explain complex phenomena") { d.analytical += 3; d.research += 1; }

  // Future goals (new strings)
  if (futureGoals.includes("Having meaningful impact in the world"))    { d.social += 1; d.leadership += 1; }
  if (futureGoals.includes("Earning well and building financial security")) { d.business += 2; }
  if (futureGoals.includes("Using my creativity freely"))              { d.creative += 2; }
  if (futureGoals.includes("Helping people directly every day"))        { d.social += 2; }
  if (futureGoals.includes("Being at the cutting edge of innovation")) { d.technical += 1; d.leadership += 1; }
  if (futureGoals.includes("Building systems and technology"))          { d.technical += 2; }
  if (futureGoals.includes("Influencing policy and social change"))    { d.analytical += 1; d.leadership += 1; }
  if (futureGoals.includes("Understanding the world at a deep level")) { d.research += 2; d.analytical += 1; }

  return d;
}

// ─── Dimension → major score ──────────────────────────────────────────────────
function dimScores(d: Dims): Record<string, number> {
  return {
    "Computer Science & Software Engineering":  d.technical * 1.5 + d.analytical * 1.0,
    "Business Administration & Management":     d.business  * 1.5 + d.leadership * 1.2,
    "Medicine & Health Sciences":               d.social * 0.8 + d.research * 1.3,
    "Creative Arts & Graphic Design":           d.creative * 1.8,
    "Environmental Science & Sustainability":   d.research * 1.2 + d.social * 0.5,
    "Psychology & Social Sciences":             d.social * 1.5 + d.analytical * 0.5,
    "Law & Political Science":                  d.analytical * 1.2 + d.social * 0.6 + d.leadership * 0.5,
    "Mechanical & Civil Engineering":           d.technical * 1.3 + d.analytical * 0.8,
    "Data Science & Statistics":                d.analytical * 1.5 + d.technical * 0.8 + d.research * 0.6,
    "Education & Teaching":                     d.social * 1.2 + d.creative * 0.4 + d.leadership * 0.4,
    "Finance & Economics":                      d.business * 1.4 + d.analytical * 1.2,
    "Architecture & Urban Design":              d.creative * 1.2 + d.technical * 1.0 + d.analytical * 0.5,
    "Pharmacy & Biomedical Sciences":           d.research * 1.2 + d.technical * 0.8 + d.social * 0.5,
    "Communication & Media Studies":            d.creative * 1.2 + d.social * 1.0,
    "International Relations & Global Affairs": d.analytical * 1.0 + d.social * 0.8 + d.leadership * 0.8,
    "Cybersecurity & Network Engineering":      d.technical * 1.4 + d.analytical * 1.0,
    "Game Design & Interactive Media":          d.creative * 1.3 + d.technical * 0.8,
    "Nursing & Allied Health":                  d.social * 1.4 + d.research * 0.6,
    "Marketing & Advertising":                  d.creative * 1.0 + d.business * 1.0 + d.social * 0.5,
    "Linguistics & Translation":                d.analytical * 0.8 + d.creative * 0.6 + d.social * 0.8,
  };
}

// ─── Keyword scoring ──────────────────────────────────────────────────────────
function kwScores(a: QuestionnaireAnswers): Record<string, number> {
  const s: Record<string, number> = {};
  MAJORS.forEach(m => (s[m] = 0));
  const { subjects, interests, strengths, workStyle, futureGoals } = a;

  subjects.forEach(sub => {
    if (sub === "Computer Science")        { s["Computer Science & Software Engineering"] += 3; s["Data Science & Statistics"] += 2; s["Cybersecurity & Network Engineering"] += 2; s["Game Design & Interactive Media"] += 1; }
    if (sub === "Mathematics")             { s["Computer Science & Software Engineering"] += 2; s["Data Science & Statistics"] += 2; s["Mechanical & Civil Engineering"] += 1; s["Finance & Economics"] += 2; }
    if (sub === "Physics")                 { s["Mechanical & Civil Engineering"] += 2; s["Computer Science & Software Engineering"] += 1; s["Architecture & Urban Design"] += 1; }
    if (sub === "Chemistry")               { s["Medicine & Health Sciences"] += 2; s["Environmental Science & Sustainability"] += 1; s["Pharmacy & Biomedical Sciences"] += 3; s["Nursing & Allied Health"] += 1; }
    if (sub === "Biology")                 { s["Medicine & Health Sciences"] += 3; s["Environmental Science & Sustainability"] += 1; s["Psychology & Social Sciences"] += 1; s["Pharmacy & Biomedical Sciences"] += 2; s["Nursing & Allied Health"] += 2; }
    if (sub === "History")                 { s["Law & Political Science"] += 2; s["Psychology & Social Sciences"] += 1; s["International Relations & Global Affairs"] += 2; }
    if (sub === "Economics")               { s["Business Administration & Management"] += 2; s["Data Science & Statistics"] += 1; s["Law & Political Science"] += 1; s["Finance & Economics"] += 3; s["International Relations & Global Affairs"] += 1; s["Marketing & Advertising"] += 1; }
    if (sub === "Art / Design")            { s["Creative Arts & Graphic Design"] += 3; s["Education & Teaching"] += 1; s["Architecture & Urban Design"] += 2; s["Game Design & Interactive Media"] += 2; s["Marketing & Advertising"] += 1; }
    if (sub === "Literature / Languages")  { s["Law & Political Science"] += 2; s["Education & Teaching"] += 1; s["Psychology & Social Sciences"] += 1; s["Linguistics & Translation"] += 3; s["Communication & Media Studies"] += 2; s["International Relations & Global Affairs"] += 1; }
  });

  interests.forEach(i => {
    if (i === "Building technology & software")         { s["Computer Science & Software Engineering"] += 3; s["Data Science & Statistics"] += 2; s["Mechanical & Civil Engineering"] += 1; s["Cybersecurity & Network Engineering"] += 2; s["Game Design & Interactive Media"] += 1; }
    if (i === "Launching businesses & startups")        { s["Business Administration & Management"] += 3; s["Law & Political Science"] += 1; s["Finance & Economics"] += 2; s["Marketing & Advertising"] += 2; }
    if (i === "Creating visual art & design")           { s["Creative Arts & Graphic Design"] += 3; s["Education & Teaching"] += 1; s["Architecture & Urban Design"] += 2; s["Game Design & Interactive Media"] += 2; s["Marketing & Advertising"] += 1; }
    if (i === "Advancing science through research")     { s["Medicine & Health Sciences"] += 2; s["Data Science & Statistics"] += 2; s["Environmental Science & Sustainability"] += 1; s["Pharmacy & Biomedical Sciences"] += 2; }
    if (i === "Helping people with health & wellbeing") { s["Medicine & Health Sciences"] += 3; s["Psychology & Social Sciences"] += 1; s["Nursing & Allied Health"] += 3; s["Pharmacy & Biomedical Sciences"] += 2; }
    if (i === "Shaping minds through education")        { s["Education & Teaching"] += 3; s["Psychology & Social Sciences"] += 1; }
    if (i === "Defending justice & policy")             { s["Law & Political Science"] += 3; s["Psychology & Social Sciences"] += 1; s["International Relations & Global Affairs"] += 2; }
    if (i === "Protecting the environment")             { s["Environmental Science & Sustainability"] += 3; s["Medicine & Health Sciences"] += 1; }
    if (i === "Supporting communities & social causes") { s["Psychology & Social Sciences"] += 3; s["Education & Teaching"] += 1; s["Law & Political Science"] += 1; s["Nursing & Allied Health"] += 2; s["International Relations & Global Affairs"] += 1; s["Communication & Media Studies"] += 1; }
    if (i === "Engineering innovative systems")         { s["Mechanical & Civil Engineering"] += 3; s["Computer Science & Software Engineering"] += 2; s["Cybersecurity & Network Engineering"] += 1; s["Architecture & Urban Design"] += 1; }
  });

  strengths.forEach(st => {
    if (st === "Breaking down complex problems")       { s["Data Science & Statistics"] += 2; s["Computer Science & Software Engineering"] += 1; s["Law & Political Science"] += 1; }
    if (st === "Thinking creatively and originally")   { s["Creative Arts & Graphic Design"] += 2; s["Education & Teaching"] += 1; }
    if (st === "Connecting with and understanding people") { s["Psychology & Social Sciences"] += 2; s["Education & Teaching"] += 1; s["Medicine & Health Sciences"] += 1; }
    if (st === "Leading and motivating others")        { s["Business Administration & Management"] += 2; s["Law & Political Science"] += 1; }
    if (st === "Technical or digital skills")          { s["Computer Science & Software Engineering"] += 2; s["Mechanical & Civil Engineering"] += 2; }
    if (st === "Organizing and planning effectively")  { s["Business Administration & Management"] += 2; s["Data Science & Statistics"] += 1; }
    if (st === "Researching and digging into topics")  { s["Medicine & Health Sciences"] += 2; s["Data Science & Statistics"] += 1; s["Environmental Science & Sustainability"] += 1; }
    if (st === "Explaining things clearly to others")  { s["Education & Teaching"] += 2; s["Law & Political Science"] += 1; }
    if (st === "Staying calm and finding solutions")   { s["Mechanical & Civil Engineering"] += 1; s["Medicine & Health Sciences"] += 1; }
  });

  if (workStyle === "Analyzing data and patterns")            { s["Data Science & Statistics"] += 2; s["Computer Science & Software Engineering"] += 1; }
  if (workStyle === "Collaborating and connecting with people") { s["Psychology & Social Sciences"] += 2; s["Business Administration & Management"] += 1; s["Education & Teaching"] += 1; }
  if (workStyle === "Building or fixing physical things")      { s["Mechanical & Civil Engineering"] += 2; }
  if (workStyle === "Designing and creating something new")    { s["Creative Arts & Graphic Design"] += 2; s["Education & Teaching"] += 1; }
  if (workStyle === "Working independently on focused tasks")  { s["Data Science & Statistics"] += 1; s["Computer Science & Software Engineering"] += 1; }
  if (workStyle === "Managing a team toward a shared goal")   { s["Business Administration & Management"] += 2; }

  futureGoals.forEach(g => {
    if (g === "Building systems and technology")              { s["Computer Science & Software Engineering"] += 2; s["Data Science & Statistics"] += 1; }
    if (g === "Earning well and building financial security") { s["Business Administration & Management"] += 2; s["Data Science & Statistics"] += 1; }
    if (g === "Helping people directly every day")            { s["Medicine & Health Sciences"] += 2; s["Psychology & Social Sciences"] += 1; s["Education & Teaching"] += 1; }
    if (g === "Using my creativity freely")                   { s["Creative Arts & Graphic Design"] += 2; }
    if (g === "Having meaningful impact in the world")        { s["Environmental Science & Sustainability"] += 1; s["Law & Political Science"] += 1; s["Business Administration & Management"] += 1; }
    if (g === "Understanding the world at a deep level")      { s["Data Science & Statistics"] += 1; s["Medicine & Health Sciences"] += 1; }
    if (g === "Influencing policy and social change")         { s["Law & Political Science"] += 2; }
    if (g === "Being at the cutting edge of innovation")      { s["Mechanical & Civil Engineering"] += 1; s["Computer Science & Software Engineering"] += 1; }
  });

  return s;
}

// ─── Why-it-matches ───────────────────────────────────────────────────────────
function buildWhyItMatches(major: Major, a: QuestionnaireAnswers): string[] {
  const { subjects, interests, strengths, workStyle, workOrientation } = a;
  const reasons: string[] = [];

  const subjectMap: Partial<Record<Major, string[]>> = {
    "Computer Science & Software Engineering":  ["Computer Science", "Mathematics", "Physics"],
    "Business Administration & Management":     ["Economics"],
    "Medicine & Health Sciences":               ["Biology", "Chemistry"],
    "Creative Arts & Graphic Design":           ["Art / Design"],
    "Environmental Science & Sustainability":   ["Biology", "Chemistry", "Geography"],
    "Psychology & Social Sciences":             ["Biology", "History", "Literature / Languages"],
    "Law & Political Science":                  ["History", "Literature / Languages", "Economics"],
    "Mechanical & Civil Engineering":           ["Physics", "Mathematics"],
    "Data Science & Statistics":                ["Mathematics", "Computer Science", "Economics"],
    "Education & Teaching":                     ["Literature / Languages", "Art / Design"],
    "Finance & Economics":                      ["Economics", "Mathematics"],
    "Architecture & Urban Design":              ["Art / Design", "Physics", "Mathematics"],
    "Pharmacy & Biomedical Sciences":           ["Chemistry", "Biology"],
    "Communication & Media Studies":            ["Literature / Languages"],
    "International Relations & Global Affairs": ["History", "Literature / Languages", "Economics"],
    "Cybersecurity & Network Engineering":      ["Computer Science", "Mathematics"],
    "Game Design & Interactive Media":          ["Computer Science", "Art / Design"],
    "Nursing & Allied Health":                  ["Biology", "Chemistry"],
    "Marketing & Advertising":                  ["Economics", "Art / Design"],
    "Linguistics & Translation":                ["Literature / Languages"],
  };
  const matchedSubs = (subjectMap[major] ?? []).filter(s => subjects.includes(s));
  if (matchedSubs.length > 0) reasons.push(`Your strength in ${matchedSubs.join(" and ")} forms a natural foundation for this field.`);

  const interestMap: Partial<Record<Major, string[]>> = {
    "Computer Science & Software Engineering":  ["Building technology & software", "Engineering innovative systems"],
    "Business Administration & Management":     ["Launching businesses & startups"],
    "Medicine & Health Sciences":               ["Helping people with health & wellbeing", "Advancing science through research"],
    "Creative Arts & Graphic Design":           ["Creating visual art & design"],
    "Environmental Science & Sustainability":   ["Protecting the environment", "Advancing science through research"],
    "Psychology & Social Sciences":             ["Supporting communities & social causes", "Shaping minds through education"],
    "Law & Political Science":                  ["Defending justice & policy"],
    "Mechanical & Civil Engineering":           ["Engineering innovative systems"],
    "Data Science & Statistics":                ["Building technology & software", "Advancing science through research"],
    "Education & Teaching":                     ["Shaping minds through education", "Supporting communities & social causes"],
    "Finance & Economics":                      ["Launching businesses & startups", "Advancing science through research"],
    "Architecture & Urban Design":              ["Creating visual art & design", "Engineering innovative systems"],
    "Pharmacy & Biomedical Sciences":           ["Helping people with health & wellbeing", "Advancing science through research"],
    "Communication & Media Studies":            ["Creating visual art & design", "Supporting communities & social causes"],
    "International Relations & Global Affairs": ["Defending justice & policy", "Supporting communities & social causes"],
    "Cybersecurity & Network Engineering":      ["Building technology & software", "Engineering innovative systems"],
    "Game Design & Interactive Media":          ["Creating visual art & design", "Building technology & software"],
    "Nursing & Allied Health":                  ["Helping people with health & wellbeing", "Supporting communities & social causes"],
    "Marketing & Advertising":                  ["Launching businesses & startups", "Creating visual art & design"],
    "Linguistics & Translation":                ["Supporting communities & social causes", "Defending justice & policy"],
  };
  const matchedInt = (interestMap[major] ?? []).filter(i => interests.includes(i));
  if (matchedInt.length > 0) reasons.push(`Your genuine interest in ${matchedInt[0].toLowerCase()} reflects what this major is about at its core.`);

  if (strengths.length > 0) reasons.push(`Your strength in ${strengths.slice(0, 2).join(" and ").toLowerCase()} is a key trait of professionals who thrive in this area.`);
  if (workStyle) reasons.push(`Your preference for ${workStyle.toLowerCase()} matches the everyday reality of work in this field.`);
  if (workOrientation) reasons.push(`You want to ${workOrientation.toLowerCase()} — that drive is central to this career.`);

  return reasons.slice(0, 3).length > 0 ? reasons.slice(0, 3) : ["Your overall profile shows strong compatibility with this field of study."];
}

// ─── User strengths ───────────────────────────────────────────────────────────
function buildUserStrengths(major: Major, a: QuestionnaireAnswers): string[] {
  const { strengths, workStyle, workOrientation } = a;
  const derived: string[] = [];
  if (strengths.includes("Breaking down complex problems"))       derived.push("Strong analytical mindset");
  if (strengths.includes("Thinking creatively and originally"))   derived.push("Creative and original thinking");
  if (strengths.includes("Connecting with and understanding people")) derived.push("High emotional intelligence");
  if (strengths.includes("Leading and motivating others"))        derived.push("Natural leadership ability");
  if (strengths.includes("Technical or digital skills"))          derived.push("Technical aptitude");
  if (strengths.includes("Explaining things clearly to others"))  derived.push("Clear and effective communicator");
  if (strengths.includes("Researching and digging into topics"))  derived.push("Intellectually curious & research-driven");
  if (strengths.includes("Organizing and planning effectively"))  derived.push("Organized and detail-oriented");
  if (strengths.includes("Staying calm and finding solutions"))   derived.push("Strong problem-solving instinct");
  if (workStyle === "Managing a team toward a shared goal")       derived.push("Leadership-oriented thinker");
  if (workStyle === "Working independently on focused tasks")      derived.push("Self-directed and autonomous");
  if (workOrientation === "Push the boundaries of scientific knowledge") derived.push("Research-minded and disciplined");
  const fallback = MAJOR_DATA[major].strengthKeywords.slice(0, 2).map(k => k.charAt(0).toUpperCase() + k.slice(1) + " orientation");
  return (derived.length > 0 ? derived : fallback).slice(0, 3);
}

// ─── Profile type ─────────────────────────────────────────────────────────────
export function getProfileType(a: QuestionnaireAnswers): ProfileType {
  const d = scoreDimensions(a);
  const max = Math.max(d.technical, d.creative, d.business, d.leadership, d.social, d.analytical, d.research);
  if (max === d.technical && d.technical >= d.analytical) return { label: "Tech Builder",                    tagline: "You're driven by curiosity and love turning ideas into real systems and solutions.",                  icon: "⚡", color: "blue" };
  if (max === d.creative)                                  return { label: "Creative Strategist",             tagline: "You think visually, express boldly, and bring imagination to everything you touch.",               icon: "🎨", color: "purple" };
  if (max === d.business || max === d.leadership)          return { label: "Business-Oriented Innovator",     tagline: "You're naturally entrepreneurial — you lead, plan, and always see the bigger picture.",             icon: "🚀", color: "amber" };
  if (max === d.social)                                    return { label: "Social Problem Solver",           tagline: "You're empathetic and people-centered — motivated by making a lasting difference in others' lives.",icon: "🌱", color: "green" };
  if (max === d.research)                                  return { label: "Research & Science Explorer",     tagline: "You're methodical, curious, and thrive on investigating the unknown through evidence and data.",     icon: "🔬", color: "teal" };
  return                                                          { label: "Analytical Explorer",             tagline: "You're methodical, intellectually curious, and thrive on understanding how complex systems work.",   icon: "🔭", color: "indigo" };
}

// ─── Hidden match ─────────────────────────────────────────────────────────────
function buildHiddenMatch(top3majors: string[], combined: Record<string, number>): HiddenMatch {
  const HIDDEN_FLAVORS: Record<Major, { reason: string; icon: string; tag: string }> = {
    "Computer Science & Software Engineering":  { reason: "Your analytical thinking and love for solving problems map naturally to software — even if you've never thought of yourself as a 'coder'.", icon: "💻", tag: "Unexpected Tech Path" },
    "Business Administration & Management":     { reason: "Your ability to lead, organise, and communicate is the backbone of great business leadership — you might be a natural entrepreneur.", icon: "📊", tag: "Hidden Leader" },
    "Medicine & Health Sciences":               { reason: "Your empathy and curiosity about people and science make medicine a surprisingly strong fit — it's not just for textbook learners.", icon: "🩺", tag: "Surprising Science Match" },
    "Creative Arts & Graphic Design":           { reason: "Your creative and visual thinking could thrive in design — a field that values exactly the kind of original expression you might underestimate in yourself.", icon: "🎨", tag: "Overlooked Creative Path" },
    "Environmental Science & Sustainability":   { reason: "If you care about the future, environmental science lets you combine science, data, and purpose into a powerful career direction.", icon: "🌍", tag: "Purpose-Driven Surprise" },
    "Psychology & Social Sciences":             { reason: "Your people insight and observational mind are core to psychology — a versatile field that opens doors in health, business, and research.", icon: "🧠", tag: "People Science Path" },
    "Law & Political Science":                  { reason: "Your analytical and communication skills are exactly what the legal and policy world needs — even if it feels distant from your current path.", icon: "⚖️", tag: "Unexpected Advocacy Match" },
    "Mechanical & Civil Engineering":           { reason: "Your hands-on mindset and love for understanding how things work makes engineering a surprisingly natural fit.", icon: "⚙️", tag: "Builder's Hidden Path" },
    "Data Science & Statistics":                { reason: "Your pattern-seeking, analytical mind is exactly what drives successful data scientists — you may already think like one.", icon: "📈", tag: "The Data Mind" },
    "Education & Teaching":                     { reason: "Your communication skills and genuine care for others means you have the innate qualities of an exceptional teacher or mentor.", icon: "📚", tag: "Natural Educator" },
    "Finance & Economics":                      { reason: "Your analytical thinking and attention to patterns could translate powerfully into economics and finance — you may have an investor's mind without realizing it.", icon: "💰", tag: "Hidden Finance Mind" },
    "Architecture & Urban Design":              { reason: "Your combination of creative vision and spatial thinking could make architecture a surprisingly natural fit — it's design thinking applied to the physical world.", icon: "🏛️", tag: "Hidden Space Designer" },
    "Pharmacy & Biomedical Sciences":           { reason: "Your scientific curiosity and care for others could make pharmacy a strong fit — it sits at the intersection of science and patient care.", icon: "💊", tag: "Surprising Science Path" },
    "Communication & Media Studies":            { reason: "Your ability to connect with people and express ideas could make media and communications an unexpected but powerful match.", icon: "📱", tag: "Hidden Storyteller" },
    "International Relations & Global Affairs": { reason: "Your analytical mind and global curiosity might make you a natural diplomat or policy analyst — someone who sees the bigger picture.", icon: "🌐", tag: "Global Thinker" },
    "Cybersecurity & Network Engineering":      { reason: "Your problem-solving instincts and technical curiosity make cybersecurity a surprisingly strong match — it's detective work for the digital age.", icon: "🔒", tag: "Hidden Security Mind" },
    "Game Design & Interactive Media":          { reason: "Your creative thinking and love for systems make game design an unexpected but powerful fit — games are one of the most complex creative mediums there is.", icon: "🎮", tag: "Hidden Game Designer" },
    "Nursing & Allied Health":                  { reason: "Your empathy and action-oriented nature could make nursing or allied health a deeply fulfilling path — you'd thrive where every action directly helps someone.", icon: "🏥", tag: "Hidden Carer" },
    "Marketing & Advertising":                  { reason: "Your creativity and people-reading skills could make marketing a surprisingly strong fit — the best marketers are part psychologist, part storyteller.", icon: "📣", tag: "Hidden Marketer" },
    "Linguistics & Translation":                { reason: "Your love of communication and patterns in language may run deeper than you think — linguistics is the science of how humans connect across barriers.", icon: "🗣️", tag: "Hidden Language Mind" },
  };

  const sorted = Object.entries(combined)
    .sort((a, b) => b[1] - a[1])
    .filter(([m]) => !top3majors.includes(m));

  const hidden = sorted[0]?.[0] as Major ?? "Data Science & Statistics";
  const flavor = HIDDEN_FLAVORS[hidden];
  return {
    major: hidden,
    reason: flavor.reason,
    icon: flavor.icon,
    tag: flavor.tag,
    skills: MAJOR_DATA[hidden].skills.slice(0, 3),
  };
}

// ─── Why Not ─────────────────────────────────────────────────────────────────
function buildWhyNot(top3: string[], dims: Dims): WhyNotEntry[] {
  const POPULAR: Major[] = [
    "Computer Science & Software Engineering",
    "Business Administration & Management",
    "Medicine & Health Sciences",
    "Law & Political Science",
    "Data Science & Statistics",
  ];
  const notInTop = POPULAR.filter(m => !top3.includes(m));
  const WHY_NOT_REASONS: Record<Major, (d: Dims) => WhyNotEntry> = {
    "Computer Science & Software Engineering": d => ({
      major: "Computer Science & Software Engineering",
      reason: d.creative > d.technical + 2
        ? "Your creative strengths and expressive style are better suited to fields that center on human experience rather than technical systems."
        : "While you have analytical ability, your profile leans more toward research, people, or creative domains than core technical computing.",
      tip: "If you're curious, try one free coding tutorial — many students discover unexpected interest once they begin.",
    }),
    "Business Administration & Management": d => ({
      major: "Business Administration & Management",
      reason: d.research > d.business + 2 || d.creative > d.business + 2
        ? "Your profile points strongly toward exploration, research, or creative work rather than the commercial and organizational focus of business."
        : "Business requires high motivation for financial systems and leadership — your profile gravitates more toward another direction.",
      tip: "Business knowledge is always useful alongside any other field — even one course in entrepreneurship could add real value.",
    }),
    "Medicine & Health Sciences": d => ({
      major: "Medicine & Health Sciences",
      reason: d.technical > d.social + 2
        ? "Medicine prioritizes patient empathy and direct human care. Your profile leans more toward technical or analytical environments."
        : "Medicine demands a very long, demanding academic path. Your profile suggests you may find similar fulfillment through shorter, equally impactful routes.",
      tip: "Public health, biomedical science, or healthcare management can let you contribute to health outcomes without the full medical degree path.",
    }),
    "Law & Political Science": d => ({
      major: "Law & Political Science",
      reason: d.technical > d.analytical || d.creative > d.analytical
        ? "Law requires deep focus on argumentation and textual analysis — your profile suggests you're energized by building, creating, or discovering rather than debating."
        : "While you have analytical ability, your profile more strongly points toward systems, people, or creative challenges over legal reasoning.",
      tip: "Policy knowledge is valuable in many careers. Even a module or elective in law during your studies can sharpen your thinking significantly.",
    }),
    "Data Science & Statistics": d => ({
      major: "Data Science & Statistics",
      reason: d.creative > d.analytical + 2 || d.social > d.analytical + 2
        ? "Data science is deeply numbers and logic-driven. Your strengths in creativity and people-connection are better expressed in other directions."
        : "While data is everywhere, your profile suggests other priorities — human connection, physical creation, or artistic expression — take center stage for you.",
      tip: "Even in non-data roles, basic data literacy is a superpower. A short statistics or Excel course will benefit any career you choose.",
    }),
  };

  return notInTop.slice(0, 3).map(m => WHY_NOT_REASONS[m](dims));
}

// ─── Confidence level ─────────────────────────────────────────────────────────
function getConfidence(score: number, top: number, rank: number): "Strong Match" | "Good Match" | "Exploratory Match" {
  if (rank === 0 && score >= top * 0.85) return "Strong Match";
  if (rank === 0) return "Good Match";
  if (score >= top * 0.80) return "Strong Match";
  if (score >= top * 0.60) return "Good Match";
  return "Exploratory Match";
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function calculateResults(a: QuestionnaireAnswers): {
  results: MatchResult[];
  hiddenMatch: HiddenMatch;
  whyNot: WhyNotEntry[];
} {
  const kw = kwScores(a);
  const dims = scoreDimensions(a);
  const ds = dimScores(dims);
  const budget = getBudgetTier(a.budgetLevel);

  const combined: Record<string, number> = {};
  MAJORS.forEach(m => { combined[m] = (kw[m] ?? 0) * 0.6 + (ds[m] ?? 0) * 0.4; });

  const sorted = Object.entries(combined).sort((x, y) => y[1] - x[1]);
  const top3 = sorted.slice(0, 3);
  const topScore = top3[0]?.[1] ?? 1;

  const results: MatchResult[] = top3.map(([major, score], rank) => {
    const m = major as Major;
    const pct = Math.round((score / topScore) * 100);
    return {
      major,
      score,
      confidence: getConfidence(score, topScore, rank),
      explanation: `${pct}% profile match across subjects, interests, strengths, work preferences, and motivations.`,
      whyItMatches: buildWhyItMatches(m, a),
      userStrengths: buildUserStrengths(m, a),
      skills: MAJOR_DATA[m].skills.slice(0, 4),
      careers: MAJOR_DATA[m].careers,
      nextSteps: MAJOR_DATA[m].nextSteps,
      countries: MAJOR_DATA[m].countries,
      universities: MAJOR_DATA[m].universitiesByBudget[budget],
      pathways: MAJOR_DATA[m].pathways,
      twelveMonthPlan: rank === 0 ? MAJOR_DATA[m].twelveMonthPlan : null,
      studyCostLabel: MAJOR_DATA[m].studyCostLabel,
      studyCostColor: MAJOR_DATA[m].studyCostColor,
      alternativeRoute: MAJOR_DATA[m].alternativeRoute,
      miniProject: MAJOR_DATA[m].miniProject,
    };
  });

  const top3names = top3.map(([m]) => m);
  const hiddenMatch = buildHiddenMatch(top3names, combined);
  const whyNot = buildWhyNot(top3names, dims);

  return { results, hiddenMatch, whyNot };
}
