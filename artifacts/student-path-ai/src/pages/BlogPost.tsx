import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { BLOG_POSTS, CATEGORY_COLORS, CATEGORY_I18N_KEY } from "@/lib/blogPosts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLang();

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${t(post.titleKey)} — NorthVoy`;
    }
  }, [post, t]);

  if (!post) {
    return (
      <div className="pt-24 pb-24 px-4 max-w-3xl mx-auto">
        <p className="text-muted-foreground text-center text-lg">{t("blog.notFound")}</p>
        <div className="flex justify-center mt-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            {t("blog.backToBlog")}
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pt-24 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t("blog.backToBlog")}
        </Link>

        <div className="mb-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[post.category]}`}>
            {t(CATEGORY_I18N_KEY[post.category])}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight mb-6">
          {t(post.titleKey)}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6 mb-8">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {post.readingMinutes} {t("blog.minRead")}
          </span>
        </div>

        <div
          className="leading-relaxed space-y-4 text-foreground/90 [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-foreground/80 [&_strong]:text-foreground [&_strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: t(post.bodyKey) }}
        />
      </div>
    </div>
  );
}
