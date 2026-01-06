import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Heart } from "lucide-react";

interface QuizIntroProps {
  onStart: () => void;
}

const QuizIntro = ({ onStart }: QuizIntroProps) => {
  return (
    <section className="min-h-[calc(100vh-4rem)] gradient-hero relative overflow-hidden flex items-center">
      {/* Floating blobs */}
      <div className="glow-blob w-80 h-80 bg-blush/40 top-20 -left-20" />
      <div className="glow-blob w-64 h-64 bg-lavender/30 top-40 right-20" style={{ animationDelay: "2s" }} />
      <div className="glow-blob w-72 h-72 bg-sage/20 bottom-20 left-1/4" style={{ animationDelay: "4s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon cluster */}
          <div className="flex justify-center gap-4 mb-8 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-blush-light flex items-center justify-center animate-float">
              <Sparkles className="w-8 h-8 text-lavender-deep" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-lavender/30 flex items-center justify-center animate-float" style={{ animationDelay: "0.5s" }}>
              <Moon className="w-8 h-8 text-lavender-deep" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-sage/30 flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
              <Heart className="w-8 h-8 text-lavender-deep" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-6 animate-fade-in-up-delay">
            Find Your
            <span className="block italic text-lavender-deep">Sanctuary Style</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in-up-delay-2 leading-relaxed">
            Take our 5-question quiz to discover your perfect desk aesthetic 
            and get a personalized bundle curated just for you.
          </p>

          <div className="animate-fade-in-up-delay-2">
            <Button variant="hero" size="xl" onClick={onStart}>
              <Sparkles className="w-5 h-5" />
              Start the Quiz
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground animate-fade-in-up-delay-2">
            Takes less than 2 minutes ✨
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuizIntro;
