import heroImage from "@/assets/hero-desk.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden gradient-hero">
      {/* Floating glow blobs */}
      <div className="glow-blob w-96 h-96 bg-blush/40 top-20 -left-20" />
      <div className="glow-blob w-80 h-80 bg-lavender/30 top-40 right-10 animation-delay-2000" style={{ animationDelay: "2s" }} />
      <div className="glow-blob w-64 h-64 bg-sage/20 bottom-20 left-1/3" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush-light/50 text-plum text-sm font-medium border border-blush/20">
                <Sparkles className="w-4 h-4" />
                Your desk deserves softness
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight animate-fade-in-up-delay text-foreground">
              Create Your
              <span className="block italic text-lavender-deep">Desk Sanctuary</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg animate-fade-in-up-delay-2 font-light leading-relaxed">
              Curated essentials for focus, comfort, and calm. Transform your space into a cozy haven that feels like a warm hug.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-2">
              <Button variant="hero" size="xl">
                Shop the Collection
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="glow" size="xl">
                Take the Quiz
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 animate-fade-in-up-delay-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blush to-lavender border-2 border-background"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">2,400+</span> happy sanctuaries created
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in-up-delay">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
              <img
                src={heroImage}
                alt="Cozy desk sanctuary setup with ambient lighting"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-elevated border border-border animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blush-light flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-lavender-deep" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders $50+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
