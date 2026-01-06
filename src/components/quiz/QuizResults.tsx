import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, ShoppingBag, Sparkles, Star } from "lucide-react";
import type { SanctuaryType } from "@/pages/Quiz";
import bundleGamer from "@/assets/bundle-gamer.jpg";
import bundleStudy from "@/assets/bundle-study.jpg";
import bundleNightowl from "@/assets/bundle-nightowl.jpg";

interface QuizResultsProps {
  result: SanctuaryType;
  onRetake: () => void;
}

const resultData: Record<SanctuaryType, {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  products: { name: string; price: number }[];
  bundlePrice: number;
  originalPrice: number;
}> = {
  "cozy-gamer": {
    title: "Cozy Gamer",
    subtitle: "Your vibe is RGB dreams & plushie comfort",
    description: "You thrive in the glow of screens and soft lighting. Your sanctuary blends gaming energy with cute, comforting touches that make long sessions feel like a warm hug.",
    image: bundleGamer,
    color: "from-pink-400 to-purple-500",
    products: [
      { name: "RGB Glow Orb Lamp", price: 48 },
      { name: "Kawaii Desk Mat", price: 32 },
      { name: "Cotton Candy Candle", price: 24 },
      { name: "Plushie Wrist Rest", price: 28 },
      { name: "Pastel Cable Clips", price: 12 },
    ],
    bundlePrice: 119,
    originalPrice: 144,
  },
  "soft-study": {
    title: "Soft Study",
    subtitle: "Your vibe is warm lamps & focused calm",
    description: "You create your best work in gentle, organized spaces. Your sanctuary is about clarity and comfort—think café vibes meets cozy library corner.",
    image: bundleStudy,
    color: "from-amber-300 to-orange-400",
    products: [
      { name: "Warm Glow Desk Lamp", price: 52 },
      { name: "Linen Desk Organizer", price: 38 },
      { name: "Vanilla Latte Candle", price: 26 },
      { name: "Focus Timer (Pomodoro)", price: 22 },
      { name: "Cozy Mug Warmer", price: 28 },
    ],
    bundlePrice: 129,
    originalPrice: 166,
  },
  "night-owl": {
    title: "Night Owl",
    subtitle: "Your vibe is moonlit calm & dreamy nights",
    description: "You come alive when the world goes quiet. Your sanctuary is a nocturnal haven of soft darkness, ambient glow, and everything that makes 2am feel magical.",
    image: bundleNightowl,
    color: "from-indigo-400 to-purple-600",
    products: [
      { name: "Moon Phase Lamp", price: 58 },
      { name: "Midnight Velvet Mat", price: 36 },
      { name: "Lavender Dreams Candle", price: 28 },
      { name: "Star Projector Light", price: 42 },
      { name: "Weighted Eye Pillow", price: 24 },
    ],
    bundlePrice: 149,
    originalPrice: 188,
  },
};

const QuizResults = ({ result, onRetake }: QuizResultsProps) => {
  const data = resultData[result];
  const savings = data.originalPrice - data.bundlePrice;

  return (
    <section className="min-h-[calc(100vh-4rem)] gradient-hero relative overflow-hidden py-20">
      {/* Floating blobs */}
      <div className="glow-blob w-96 h-96 bg-blush/30 top-0 -left-40" />
      <div className="glow-blob w-72 h-72 bg-lavender/20 bottom-20 right-0" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Result Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush-light/50 text-plum text-sm font-medium border border-blush/20 mb-6">
              <Sparkles className="w-4 h-4" />
              Your result is in!
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-4">
              You're a
              <span className={`block italic bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                {data.title}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground">
              {data.subtitle}
            </p>
          </div>

          {/* Bundle Card */}
          <div className="bg-card rounded-3xl border border-border shadow-elevated overflow-hidden animate-fade-in-up-delay">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square md:aspect-auto">
                <img
                  src={data.image}
                  alt={`${data.title} Bundle`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium">
                  Save ${savings}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-lavender-deep text-lavender-deep" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Perfect match</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-4">
                  {data.title} Starter Bundle
                </h2>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {data.description}
                </p>

                {/* Products List */}
                <div className="space-y-3 mb-8 flex-1">
                  {data.products.map((product, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-foreground">{product.name}</span>
                      <span className="text-muted-foreground">${product.price}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-foreground">${data.bundlePrice}</span>
                    <span className="text-lg text-muted-foreground line-through">${data.originalPrice}</span>
                  </div>
                  <p className="text-sm text-lavender-deep font-medium mt-1">
                    You save ${savings} with this bundle
                  </p>
                </div>

                {/* CTA */}
                <Button variant="hero" size="xl" className="w-full">
                  <ShoppingBag className="w-5 h-5" />
                  Add Bundle to Cart
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Retake */}
          <div className="text-center mt-10 animate-fade-in-up-delay-2">
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retake the quiz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizResults;
