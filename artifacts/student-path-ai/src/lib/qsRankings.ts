// QS World University Rankings 2025
// Maps university names exactly as they appear in universities.ts

export const QS_RANKINGS: Record<string, number | null> = {
  // ── Computer Science & Software Engineering ─────────────────────────────────
  "MIT": 1,
  "Stanford University": 5,
  "Carnegie Mellon University": 52,
  "UC Berkeley": 12,
  "University of Washington": null,

  "TU Munich (TUM)": 37,
  "RWTH Aachen University": 106,
  "KIT Karlsruhe": 131,
  "TU Berlin": 154,
  "University of Stuttgart": null,

  "Imperial College London": 8,
  "University of Cambridge": 2,
  "University of Edinburgh": 27,
  "UCL": 9,
  "University of Manchester": 34,

  "University of Toronto": 25,
  "University of Waterloo": 112,
  "University of British Columbia": 43,
  "McGill University": 30,
  "University of Alberta": 111,

  "TU Delft": 47,
  "University of Amsterdam": 67,
  "Eindhoven University of Technology": 123,
  "Vrije Universiteit Amsterdam": 185,
  "University of Twente": 183,

  "KTH Royal Institute of Technology": 98,
  "Chalmers University of Technology": 301,
  "Uppsala University": 175,
  "Lund University": 92,
  "Linköping University": 501,

  "ETH Zurich": 7,
  "EPFL": 39,
  "University of Zurich": 109,
  "University of Basel": 151,
  "University of Bern": 158,

  "University of Melbourne": 13,
  "University of Sydney": 18,
  "UNSW Sydney": 19,
  "ANU": 30,
  "Monash University": 37,

  // ── Medicine & Health Sciences ───────────────────────────────────────────────
  "University of Oxford": 3,
  "King's College London": 40,

  "Harvard Medical School": 4,
  "Johns Hopkins University": 30,
  "Stanford Medicine": 5,
  "Mayo Clinic Alix School": null,
  "UCSF": null,

  "Heidelberg University": 87,
  "LMU Munich": 63,
  "Charité — Universitätsmedizin Berlin": null,
  "TU Munich (Klinikum)": 37,
  "University of Göttingen": null,

  "Amsterdam UMC": null,
  "Erasmus MC": null,
  "Leiden University Medical Centre": null,
  "Maastricht University": 201,
  "Radboud University": 231,

  "University of Queensland": 53,
  "ANU Medical School": 30,

  "Karolinska Institute": 179,
  "University of Gothenburg": null,
  "Umeå University": null,

  "Paris Cité University (Paris Descartes)": null,
  "Sorbonne University": 83,
  "University of Strasbourg": null,
  "Aix-Marseille University": null,
  "University of Bordeaux": null,

  // ── Business Administration & Management ────────────────────────────────────
  "Wharton School (UPenn)": 11,
  "Harvard Business School": 4,
  "MIT Sloan": 1,
  "Columbia Business School": 22,
  "Booth School (UChicago)": 21,

  "London Business School": null,
  "Oxford Saïd Business School": 3,
  "Cambridge Judge Business School": 2,
  "Imperial College Business School": 8,
  "Warwick Business School": null,

  "HEC Paris": null,
  "INSEAD (Fontainebleau)": null,
  "ESSEC Business School": null,
  "Sciences Po (Paris)": 244,
  "EM Lyon Business School": null,

  "WHU – Otto Beisheim School": null,
  "Mannheim Business School": null,
  "Frankfurt School of Finance": null,
  "HHL Leipzig Graduate School": null,
  "ESMT Berlin": null,

  "Rotterdam School of Management (Erasmus)": 174,
  "Amsterdam Business School": null,
  "Tilburg University": 401,
  "University of Groningen": 151,
  "Maastricht University SBE": null,

  "IMD Business School (Lausanne)": null,
  "University of St. Gallen (HSG)": 511,
  "Geneva School of Economics": null,
  "HEC Lausanne (UNIL)": null,
  "ZHAW School of Management": null,

  "NUS Business School": 8,
  "NTU Nanyang Business School": 26,
  "INSEAD Asia Campus": null,
  "SMU Lee Kong Chian School": null,
  "Singapore Management University": null,

  "Ivey Business School (Western)": null,
  "Rotman School of Management (UofT)": 25,
  "McGill Desautels Faculty": 30,
  "Schulich School (York)": null,
  "HEC Montréal": null,

  // ── Law & Political Science ──────────────────────────────────────────────────
  "University of Oxford (Law)": 3,
  "University of Cambridge (Law)": 2,
  "London School of Economics": 59,
  "UCL Faculty of Laws": 9,

  "Yale Law School": 16,
  "Harvard Law School": 4,
  "Columbia Law School": 22,
  "NYU School of Law": 40,
  "University of Chicago Law": 21,

  "Humboldt University Berlin": 120,
  "LMU Munich (Law)": 63,
  "University of Heidelberg": 87,
  "University of Hamburg (Law)": null,
  "Freie Universität Berlin": 98,

  "Utrecht University (Law)": 137,
  "Leiden University (Law)": 146,
  "Maastricht University (Law)": null,
  "University of Amsterdam (Law)": 67,
  "Tilburg Law School": null,

  "University of Melbourne (Law)": 13,
  "University of Sydney Law School": 18,
  "ANU College of Law": 30,
  "Monash Law School": 37,
  "University of Queensland Law": 53,

  "Paris I Panthéon-Sorbonne": 83,
  "Sciences Po Paris (Law)": 244,
  "Université Paris II Assas": null,
  "University of Strasbourg (Law)": null,
  "University of Bordeaux (Law)": null,

  "Osgoode Hall Law School (York)": null,
  "McGill Faculty of Law": 30,
  "University of Toronto Law": 25,
  "University of British Columbia Law": 43,
  "Dalhousie Law School": null,

  // ── Mechanical & Civil Engineering ──────────────────────────────────────────
  "MIT (Engineering)": 1,
  "Caltech": 10,
  "Georgia Tech": 72,
  "University of Michigan": 23,

  "TU Munich": 37,
  "RWTH Aachen": 106,

  "University of Southampton": 100,
  "University of Bristol": 55,

  "Wageningen University": 166,

  "University of New South Wales": 19,
  "University of Adelaide": null,

  "University of Applied Sciences Lucerne": null,
  "ZHAW": null,

  // ── Psychology & Social Sciences ────────────────────────────────────────────
  "University College London": 9,
  "University of Exeter": null,

  "Harvard University (Psychology)": 4,
  "Yale University": 16,
  "UC San Diego": null,

  "Radboud University Nijmegen": 231,

  "University of Tübingen": null,

  "Australian National University": 30,

  "Stockholm University": 261,
  "Göteborg University": null,

  // ── Creative Arts & Graphic Design ──────────────────────────────────────────
  "Royal College of Art (London)": null,
  "Goldsmiths (University of London)": null,
  "Central Saint Martins (UAL)": null,
  "University of the Arts London": null,
  "Falmouth University": null,

  "Rhode Island School of Design (RISD)": null,
  "Pratt Institute": null,
  "Parsons School of Design (The New School)": null,
  "ArtCenter College of Design": null,
  "SCAD (Savannah)": null,

  "Design Academy Eindhoven": null,
  "Gerrit Rietveld Academie (Amsterdam)": null,
  "ArtEZ University of the Arts": null,
  "Royal Academy of Art The Hague": null,
  "HKU University of the Arts Utrecht": null,

  "Bauhaus-Universität Weimar": null,
  "HfG Offenbach": null,
  "Berlin University of the Arts": null,
  "KISD Cologne": null,
  "Academy of Fine Arts Munich": null,

  "Politecnico di Milano (Design)": null,
  "Istituto Marangoni (Milan)": null,
  "Accademia di Belle Arti Firenze": null,
  "NABA (Milan)": null,
  "ISIA Roma Design": null,

  "RMIT University (Design)": 186,
  "University of Technology Sydney": 133,
  "Griffith College of Art": null,
  "University of Melbourne (Fine Arts)": null,
  "Queensland College of Art": null,

  "IED Madrid (Istituto Europeo di Design)": null,
  "ELISAVA Barcelona": null,
  "Escola Massana (Barcelona)": null,
  "ESDESIGN Barcelona": null,
  "ESDIP Madrid": null,

  // ── Environmental Science & Sustainability ───────────────────────────────────
  "University of Cambridge (Environmental)": 2,
  "University of Leeds": 92,

  "Yale School of the Environment": 16,
  "UC Berkeley (Environmental Sciences)": 12,
  "University of Michigan (SNRE)": 23,
  "Duke Nicholas School": 64,
  "Colorado State University": null,

  "Leuphana University Lüneburg": null,
  "University of Freiburg (Environmental)": null,
  "TU Berlin (Environmental Planning)": null,
  "KIT (Environmental Engineering)": null,
  "University of Greifswald": null,

  "Wageningen University (WUR)": 166,
  "Utrecht University (Geosciences)": 137,
  "Leiden University (CML)": 146,
  "VU Amsterdam": 185,

  "Stockholm University (Stockholm Resilience Centre)": null,
  "Lund University (LUCSUS)": null,

  "UNSW Sydney (Environmental)": 19,
  "James Cook University (Marine)": 401,
  "Murdoch University": null,

  "McGill University (Environment)": 30,
  "UBC (Institute for Resources, Environment)": 43,
  "Dalhousie University": null,
  "University of Victoria": null,

  // ── Data Science & Statistics ────────────────────────────────────────────────
  "MIT (EECS / Statistics)": 1,
  "Stanford (Statistics)": 5,
  "Carnegie Mellon (Machine Learning)": 52,
  "UC Berkeley (CDSS)": 12,
  "University of Chicago (Statistics)": 21,

  "University of Oxford (Statistics)": 3,
  "University of Cambridge (MPhil Statistics)": 2,
  "UCL (CS / Stats)": 9,

  "LMU Munich (Statistics / Data Science)": 63,
  "Humboldt University Berlin (Education)": 120,
  "University of Mannheim": null,

  "ETH Zurich (Data Science)": 7,
  "EPFL (Computer and Communication Sciences)": 39,
  "University of Lausanne": null,

  "University of Waterloo (Statistics)": 112,
  "Simon Fraser University": null,

  "ANU (Statistics)": 30,
  "Monash University (Data Science)": 37,

  "NUS (Statistics & Data Science)": 8,
  "NTU (Data Science)": 26,
  "Singapore Management University (IS)": null,
  "Singapore Institute of Technology": null,
  "SUTD": null,

  // ── Education & Teaching ─────────────────────────────────────────────────────
  "UCL Institute of Education": 9,
  "University of Cambridge (Faculty of Education)": 2,
  "University of Oxford (Dept of Education)": 3,

  "Harvard Graduate School of Education": 4,
  "Stanford Graduate School of Education": 5,
  "Teachers College Columbia": 22,
  "University of Michigan (Education)": 23,
  "Vanderbilt Peabody College": null,

  "Leiden University (Education Science)": 146,
  "University of Amsterdam (Education)": 67,
  "Utrecht University": 137,

  "University of Munich (Teacher Training)": null,
  "University of Hamburg": null,
  "University of Cologne (Education)": null,
  "University of Frankfurt": null,

  "University of Helsinki (Faculty of Educational Sciences)": null,
  "University of Tampere": null,
  "University of Jyväskylä": null,
  "University of Turku": null,
  "Åbo Akademi University": null,

  "University of Melbourne (Graduate School of Education)": 13,
  "Monash University (Education)": 37,
  "Queensland University of Technology": 230,
  "Australian Catholic University": null,

  "OISE — University of Toronto": 25,
  "University of British Columbia (Faculty of Education)": 43,
  "McGill Faculty of Education": 30,
  "York Faculty of Education": null,
  "University of Alberta (Education)": 111,

  // ── Extra variants referenced in task description ─────────────────────────────
  "Georgetown": null,
  "Sciences Po Paris": 244,
  "RMIT University": 186,
};

// Aliases for names in matching.ts that differ from QS_RANKINGS keys
const QS_ALIASES: Record<string, string> = {
  "Carnegie Mellon":           "Carnegie Mellon University",
  "TU Munich":                 "TU Munich (TUM)",
  "University College London": "UCL",
  "ANU":                       "ANU",
  "Wharton School, UPenn":     "Wharton School (UPenn)",
  "Harvard Business School":   "Harvard Business School",
  "London Business School":    "London Business School",
  "INSEAD":                    "INSEAD (Fontainebleau)",
  "University of St. Gallen":  "University of St. Gallen (HSG)",
};

export function getQSRank(universityName: string): number | null {
  // 1. Exact match
  if (universityName in QS_RANKINGS) return QS_RANKINGS[universityName];

  // 2. Strip trailing " (Country...)" or " (info)" suffix, e.g. "MIT (USA)" → "MIT"
  const stripped = universityName.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (stripped !== universityName && stripped in QS_RANKINGS) return QS_RANKINGS[stripped];

  // 3. Check aliases on stripped name
  if (QS_ALIASES[stripped]) {
    const aliased = QS_ALIASES[stripped];
    if (aliased in QS_RANKINGS) return QS_RANKINGS[aliased];
  }

  // 4. Check aliases on original name
  if (QS_ALIASES[universityName]) {
    const aliased = QS_ALIASES[universityName];
    if (aliased in QS_RANKINGS) return QS_RANKINGS[aliased];
  }

  return null;
}

export function getRankLabel(rank: number): string {
  if (rank <= 10) return "Top 10";
  if (rank <= 50) return "Top 50";
  if (rank <= 100) return "Top 100";
  if (rank <= 200) return "Top 200";
  if (rank <= 500) return "Top 500";
  return `#${rank}`;
}
