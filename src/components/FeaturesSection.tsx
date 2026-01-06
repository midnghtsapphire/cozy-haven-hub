import { Moon, Sparkles, Heart, Leaf } from "lucide-react";

const features = [
  {
    icon: Moon,
    title: "Night Mode Friendly",
    description: "Soft ambient products designed for evening routines and late-night study sessions.",
  },
  {
    icon: Sparkles,
    title: "Aesthetic First",
    description: "Every piece is curated to look stunning on your desk and your feed.",
  },
  {
    icon: Heart,
    title: "Comfort Objects",
    description: "Tactile, soothing items that help regulate anxiety and bring calm to your space.",
  },
  {
    icon: Leaf,
    title: "Mindful Materials",
    description: "Sustainable, gentle on the planet, and safe for your sanctuary.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground">
            Why Duskglow?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            We understand the need for a space that feels safe, soft, and entirely yours.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-blush-light flex items-center justify-center mb-6 group-hover:bg-lavender/30 transition-colors">
                <feature.icon className="w-7 h-7 text-lavender-deep" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
