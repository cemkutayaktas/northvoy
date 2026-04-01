import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { MessageSquare, Cpu, Map, Users, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";

const DEVELOPERS = [
  { key: "cem",   name: "Cem Kutay Aktaş", initials: "CKA", color: "from-blue-500 to-indigo-500"   },
  { key: "doruk", name: "Doruk Uzer",       initials: "DU",  color: "from-purple-500 to-pink-500"  },
  { key: "devin", name: "Devin Tolun",      initials: "DT",  color: "from-green-500 to-teal-500"   },
  { key: "can",   name: "Can Dalkıran",     initials: "CD",  color: "from-amber-500 to-orange-500" },
] as const;

export default function About() {
  const { t } = useLang();

  const HOW_IT_WORKS = [
    {
      step: "1",
      icon: MessageSquare,
      title: t("about.step1Title"),
      desc:  t("about.step1Desc"),
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      step: "2",
      icon: Cpu,
      title: t("about.step2Title"),
      desc:  t("about.step2Desc"),
      color: "bg-secondary/10",
      iconColor: "text-secondary",
    },
    {
      step: "3",
      icon: Map,
      title: t("about.step3Title"),
      desc:  t("about.step3Desc"),
      color: "bg-primary/10",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-extrabold mb-5"
          >
            {t("about.titleA")} <span className="text-primary">{t("about.titleB")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {t("about.subtitle")}
          </motion.p>
        </div>

        {/* Image + Problem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <img
              src={`${import.meta.env.BASE_URL}images/about-illustration.png`}
              alt="Paths diverging"
              className="w-full rounded-3xl shadow-2xl border border-border/50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="space-y-5"
          >
            <h2 className="text-3xl font-display font-bold">{t("about.problemTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("about.problemText1")}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("about.problemText2")}</p>
            <Link href="/questionnaire">
              <Button size="lg" className="mt-2">{t("about.cta")}</Button>
            </Link>
          </motion.div>
        </div>

        {/* How It Works */}
        <h2 className="text-3xl font-display font-bold text-center mb-10">{t("about.howItWorksTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {HOW_IT_WORKS.map((item) => (
            <Card key={item.step} className="p-7 hover:-translate-y-1 transition-transform">
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                <item.icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-center">{item.title}</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Technology note */}
        <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8 mb-20 text-center">
          <h3 className="text-xl font-bold mb-3">{t("about.techTitle")}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            {t("about.techDesc")}
          </p>
        </div>

        {/* App Developers */}
        <div>
          <div className="flex items-center gap-3 justify-center mb-10">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold">{t("about.teamTitle")}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {DEVELOPERS.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Card className="p-6 text-center hover:-translate-y-1 transition-transform hover:shadow-lg">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${dev.color} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                    <span className="text-white text-base font-bold">{dev.initials}</span>
                  </div>
                  <h3 className="text-sm font-bold font-display mb-1 leading-tight">{dev.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-medium leading-snug">
                    {t(`about.roles.${dev.key}`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {t("about.footerNote")}
          </p>
        </div>

        {/* Contact */}
        <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("about.contactTitle")}</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            {t("about.contactDesc")}
          </p>
          <a
            href="mailto:northvoy@gmail.com"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-sm"
          >
            <Mail className="w-4 h-4" />
            northvoy@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
}
