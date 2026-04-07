import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found — NorthVoy";
    // Prevent search engines from indexing 404 pages
    let noindex = document.querySelector('meta[name="robots"]');
    if (noindex) noindex.setAttribute("content", "noindex, nofollow");
    return () => {
      if (noindex) noindex.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 pt-24 pb-12">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">404</h1>
          <p className="text-muted-foreground mb-6">
            This page doesn't exist. It may have been moved or the URL might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="default" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" /> Go Home
              </Button>
            </Link>
            <Link href="/questionnaire">
              <Button variant="outline" className="w-full sm:w-auto">
                Take the Quiz <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
