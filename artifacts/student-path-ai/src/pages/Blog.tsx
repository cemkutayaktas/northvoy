import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { Clock, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { BLOG_POSTS, CATEGORY_COLORS, CATEGORY_I18N_KEY } from "@/lib/blogPosts";

const dark = "linear-gradient(160deg, #07091c 0%, #0c1432 60%, #060e20 100%)";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Blog() {
  const { t } = useLang();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-32 pb-24 px-4" style={{ background: dark }}>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-10 blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] rounded-full opacity-8 blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10 text-white/60 bg-white/5 mb-6">
              {t("blog.pageTitle")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4 leading-tight">
              {t("blog.pageTitle")}
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t("blog.pageSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post, i) => (
            <FadeUp key={post.slug} delay={i * 0.08}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="h-full flex flex-col rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-6">
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[post.category]}`}>
                      {t(CATEGORY_I18N_KEY[post.category])}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
                    {t(post.titleKey)}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow mb-5">
                    {t(post.excerptKey)}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readingMinutes} {t("blog.minRead")}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                      {t("blog.readMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  );
}
