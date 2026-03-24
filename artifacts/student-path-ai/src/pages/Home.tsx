import { Link } from "wouter";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, BookOpen, Compass } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLang();

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] opacity-30 pointer-events-none translate-x-1/3 -translate-y-1/4">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Abstract decorative background" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="absolute top-40 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 -translate-x-1/2" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 translate-y-1/2" />

      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 border border-primary/20">
                <Sparkles className="w-4 h-4" />
                <span>{t("home.badge")}</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] mb-6">
                {t("home.h1a")} <br />
                <span className="text-gradient">{t("home.h1b")}</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                {t("home.description")}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/questionnaire">
                  <Button size="lg" className="w-full sm:w-auto group">
                    {t("home.cta")}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    {t("home.howItWorks")}
                  </Button>
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-8 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-secondary" />
                  <span>{t("home.personalized")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <span>{t("home.evidenceBased")}</span>
                </div>
              </div>
            </motion.div>

            {/* Right side visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="aspect-square rounded-full border border-primary/20 bg-gradient-to-tr from-white/50 to-white/10 backdrop-blur-3xl shadow-2xl relative flex items-center justify-center">
                 <div className="absolute inset-8 rounded-full border border-primary/10 animate-[spin_20s_linear_infinite]" />
                 <div className="absolute inset-16 rounded-full border border-secondary/20 animate-[spin_15s_linear_infinite_reverse]" />
                 
                 <div className="text-center relative z-10 glass-panel p-8 rounded-3xl w-72">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Compass className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2">{t("home.findYourNorth")}</h3>
                    <p className="text-sm text-muted-foreground">{t("home.simpleQuestions")}</p>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
