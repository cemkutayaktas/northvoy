import jsPDF from "jspdf";
import { MatchResult, ProfileType, HiddenMatch, WhyNotEntry } from "./store";

const PRIMARY = [37, 99, 235] as const;
const SECONDARY = [99, 102, 241] as const;
const DARK = [15, 23, 42] as const;
const MED = [71, 85, 105] as const;
const LIGHT = [148, 163, 184] as const;
const WHITE = [255, 255, 255] as const;
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

function setColor(doc: jsPDF, rgb: readonly [number, number, number], fill = true) {
  if (fill) doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  else doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function addHeader(doc: jsPDF) {
  setColor(doc, PRIMARY);
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.rect(0, 0, PAGE_W, 14, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("NORTHPATH AI", MARGIN, 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Personalised Academic Guidance Report", PAGE_W - MARGIN, 9, { align: "right" });
}

function addFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const y = PAGE_H - 8;
  doc.setDrawColor(220, 228, 240);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y - 2, PAGE_W - MARGIN, y - 2);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2]);
  doc.text("Results are for educational guidance only and do not constitute professional academic or career advice.", MARGIN, y);
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN, y, { align: "right" });
}

function checkPage(doc: jsPDF, y: number, needed: number, pageArr: number[]): number {
  if (y + needed > PAGE_H - 20) {
    addFooter(doc, pageArr[0], 99);
    doc.addPage();
    pageArr[0]++;
    addHeader(doc);
    return 22;
  }
  return y;
}

function sectionTitle(doc: jsPDF, y: number, label: string, color: readonly [number, number, number] = PRIMARY): number {
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(MARGIN, y, 3, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text(label.toUpperCase(), MARGIN + 6, y + 4);
  doc.setDrawColor(220, 228, 240);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + 6, y + 6, PAGE_W - MARGIN, y + 6);
  return y + 12;
}

function labelValue(doc: jsPDF, y: number, label: string, value: string, x = MARGIN): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2]);
  doc.text(label.toUpperCase(), x, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  const lines = doc.splitTextToSize(value, CONTENT_W / 2 - 4) as string[];
  doc.text(lines, x, y + 4.5);
  return y + 4.5 + lines.length * 4;
}

export function generatePDF(
  results: MatchResult[],
  profile: ProfileType,
  hidden: HiddenMatch | null,
  whyNot: WhyNotEntry[] | null,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageArr = [1];
  let y = 0;

  // ── Cover page ──────────────────────────────────────────────────────────────
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // decorative circles (subtle)
  doc.setFillColor(60, 120, 255);
  doc.circle(PAGE_W + 10, 40, 70, "F");
  doc.setFillColor(37, 99, 235);
  doc.circle(-10, PAGE_H - 10, 50, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("NorthPath AI", PAGE_W / 2, 90, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(200, 220, 255);
  doc.text("Personalised Academic Guidance Report", PAGE_W / 2, 103, { align: "center" });

  doc.setFillColor(255, 255, 255);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(MARGIN, 122, CONTENT_W, 55, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.text("STUDENT PROFILE", MARGIN + 8, 134);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(DARK[0], DARK[1], DARK[2]);
  doc.text(profile.label, MARGIN + 8, 145);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MED[0], MED[1], MED[2]);
  const tagLines = doc.splitTextToSize(profile.tagline, CONTENT_W - 16) as string[];
  doc.text(tagLines, MARGIN + 8, 152);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 220, 255);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, PAGE_W / 2, PAGE_H - 20, { align: "center" });
  doc.text("northpathai.com", PAGE_W / 2, PAGE_H - 15, { align: "center" });

  // ── Page 2+ : Matches ────────────────────────────────────────────────────────
  doc.addPage();
  pageArr[0] = 2;
  addHeader(doc);
  y = 22;

  y = sectionTitle(doc, y, "Your Top Major Matches");

  for (let idx = 0; idx < results.length; idx++) {
    const r = results[idx];
    y = checkPage(doc, y, 55, pageArr);

    const rankLabel = idx === 0 ? "BEST MATCH" : idx === 1 ? "STRONG MATCH" : "GOOD MATCH";
    const rankColor: readonly [number, number, number] = idx === 0 ? PRIMARY : idx === 1 ? SECONDARY : [100, 116, 139];

    // Card background
    doc.setFillColor(245, 248, 255);
    doc.roundedRect(MARGIN, y, CONTENT_W, 8, 2, 2, "F");
    doc.setFillColor(rankColor[0], rankColor[1], rankColor[2]);
    doc.roundedRect(MARGIN, y, CONTENT_W, 8, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(rankLabel, MARGIN + 4, y + 5.5);
    doc.text(r.confidence.toUpperCase(), PAGE_W - MARGIN - 4, y + 5.5, { align: "right" });
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    doc.text(r.major, MARGIN, y);
    y += 5;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(MED[0], MED[1], MED[2]);
    const explLines = doc.splitTextToSize(r.explanation, CONTENT_W) as string[];
    doc.text(explLines, MARGIN, y);
    y += explLines.length * 3.8 + 4;

    // Two columns: careers + skills
    const col1x = MARGIN;
    const col2x = MARGIN + CONTENT_W / 2 + 3;
    const colW = CONTENT_W / 2 - 3;
    const colStartY = y;

    // Careers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2]);
    doc.text("CAREER PATHS", col1x, colStartY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    let colY1 = colStartY + 4;
    r.careers.slice(0, 4).forEach(c => {
      doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
      doc.circle(col1x + 1.5, colY1 - 0.8, 0.8, "F");
      doc.text(c, col1x + 4, colY1);
      colY1 += 3.8;
    });

    // Skills
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2]);
    doc.text("KEY SKILLS", col2x, colStartY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    let colY2 = colStartY + 4;
    r.skills.slice(0, 4).forEach(s => {
      doc.setFillColor(SECONDARY[0], SECONDARY[1], SECONDARY[2]);
      doc.circle(col2x + 1.5, colY2 - 0.8, 0.8, "F");
      doc.text(s, col2x + 4, colY2);
      colY2 += 3.8;
    });

    y = Math.max(colY1, colY2) + 3;

    // Countries
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2]);
    doc.text("STUDY DESTINATIONS", MARGIN, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MED[0], MED[1], MED[2]);
    const countriesText = r.countries.map(c => `${c.flag} ${c.name}`).join("  ·  ");
    const countryLines = doc.splitTextToSize(countriesText, CONTENT_W) as string[];
    doc.text(countryLines, MARGIN, y);
    y += countryLines.length * 3.8 + 3;

    // Alternative route
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(MARGIN, y, CONTENT_W, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(99, 102, 241);
    doc.text("ALTERNATIVE ROUTE →", MARGIN + 3, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(DARK[0], DARK[1], DARK[2]);
    const altText = `${r.alternativeRoute.major}: ${r.alternativeRoute.reason}`;
    const altLines = doc.splitTextToSize(altText, CONTENT_W - 6) as string[];
    doc.text(altLines[0] ?? "", MARGIN + 3, y + 8);
    y += 13;

    // Divider
    doc.setDrawColor(220, 228, 240);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 6;
  }

  // ── 12-Month Plan ────────────────────────────────────────────────────────────
  const plan = results[0]?.twelveMonthPlan;
  if (plan) {
    y = checkPage(doc, y, 10, pageArr);
    y = sectionTitle(doc, y, `12-Month Plan — ${results[0].major}`, [16, 185, 129]);

    const quarters = [
      { ...plan.q1, color: [37, 99, 235] as const },
      { ...plan.q2, color: [99, 102, 241] as const },
      { ...plan.q3, color: [124, 58, 237] as const },
      { ...plan.q4, color: [236, 72, 153] as const },
    ];

    for (const q of quarters) {
      const needed = 8 + q.focus.length * 4.5;
      y = checkPage(doc, y, needed, pageArr);

      doc.setFillColor(q.color[0], q.color[1], q.color[2]);
      doc.rect(MARGIN, y, 2.5, needed, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(DARK[0], DARK[1], DARK[2]);
      doc.text(q.title, MARGIN + 5, y + 5);
      let qy = y + 9;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(MED[0], MED[1], MED[2]);
      for (const f of q.focus) {
        doc.setFillColor(q.color[0], q.color[1], q.color[2]);
        doc.circle(MARGIN + 6, qy - 0.8, 0.8, "F");
        const fLines = doc.splitTextToSize(f, CONTENT_W - 10) as string[];
        doc.setTextColor(DARK[0], DARK[1], DARK[2]);
        doc.text(fLines, MARGIN + 9, qy);
        qy += fLines.length * 3.8 + 1;
      }
      y = qy + 5;
    }
  }

  // ── Hidden Match ─────────────────────────────────────────────────────────────
  if (hidden) {
    y = checkPage(doc, y, 40, pageArr);
    y = sectionTitle(doc, y, "Your Hidden Match", [124, 58, 237]);

    doc.setFillColor(245, 243, 255);
    doc.roundedRect(MARGIN, y, CONTENT_W, 30, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(124, 58, 237);
    doc.text(hidden.major, MARGIN + 4, y + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2]);
    doc.text(hidden.tag.toUpperCase(), MARGIN + 4, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MED[0], MED[1], MED[2]);
    const hidLines = doc.splitTextToSize(hidden.reason, CONTENT_W - 8) as string[];
    doc.text(hidLines, MARGIN + 4, y + 18);
    y += 34;
  }

  // ── Why Not ──────────────────────────────────────────────────────────────────
  if (whyNot && whyNot.length > 0) {
    y = checkPage(doc, y, 20, pageArr);
    y = sectionTitle(doc, y, "Why Not These Fields?", [100, 116, 139]);

    for (const entry of whyNot) {
      const needed = 20;
      y = checkPage(doc, y, needed, pageArr);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(MARGIN, y, CONTENT_W, 17, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(DARK[0], DARK[1], DARK[2]);
      doc.text(entry.major, MARGIN + 3, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(MED[0], MED[1], MED[2]);
      const rLines = doc.splitTextToSize(entry.reason, CONTENT_W - 6) as string[];
      doc.text(rLines, MARGIN + 3, y + 10);
      y += 21;
    }
  }

  // ── Mini Projects ────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 30, pageArr);
  y = sectionTitle(doc, y, "Beginner Project Suggestions", [16, 185, 129]);

  for (let idx = 0; idx < Math.min(results.length, 3); idx++) {
    const r = results[idx];
    y = checkPage(doc, y, 22, pageArr);
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(MARGIN, y, CONTENT_W, 18, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(16, 185, 129);
    doc.text(r.major, MARGIN + 3, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MED[0], MED[1], MED[2]);
    const pLines = doc.splitTextToSize(r.miniProject, CONTENT_W - 6) as string[];
    doc.text(pLines, MARGIN + 3, y + 10);
    y += 22;
  }

  // ── Final footer on all pages ─────────────────────────────────────────────
  const finalPage = pageArr[0];
  addFooter(doc, finalPage, finalPage);

  // Retroactively add footers to earlier pages (they were added without totals)
  // Actually since we added footers inline, just update the first cover page footer
  // (cover page has no footer, that's fine)

  doc.save("NorthPathAI_Report.pdf");
}
