import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SanctuaryType } from "@/pages/Quiz";

interface QuizOption {
  id: string;
  text: string;
  type: SanctuaryType;
}

interface QuizQuestionProps {
  question: {
    id: number;
    question: string;
    subtitle: string;
    options: QuizOption[];
  };
  currentStep: number;
  totalSteps: number;
  onAnswer: (questionId: number, answerId: string, type: SanctuaryType) => void;
}

const QuizQuestion = ({ question, currentStep, totalSteps, onAnswer }: QuizQuestionProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (option: QuizOption) => {
    if (isAnimating) return;
    
    setSelectedId(option.id);
    setIsAnimating(true);

    setTimeout(() => {
      onAnswer(question.id, option.id, option.type);
      setSelectedId(null);
      setIsAnimating(false);
    }, 400);
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <section className="min-h-[calc(100vh-4rem)] gradient-hero relative overflow-hidden flex items-center py-20">
      {/* Floating blobs */}
      <div className="glow-blob w-64 h-64 bg-blush/30 top-20 -right-20" />
      <div className="glow-blob w-56 h-56 bg-lavender/20 bottom-20 left-10" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl mx-auto">
          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">
                Question {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-lavender-deep">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blush to-lavender transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-10 animate-fade-in-up">
            <p className="text-sm text-lavender-deep mb-2">{question.subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={isAnimating}
                className={cn(
                  "w-full p-6 rounded-2xl text-left transition-all duration-300",
                  "bg-card border-2 hover:border-blush hover:shadow-soft hover:-translate-y-1",
                  "animate-fade-in-up",
                  selectedId === option.id
                    ? "border-lavender-deep bg-blush-light scale-[0.98]"
                    : "border-border"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-medium transition-colors",
                      selectedId === option.id
                        ? "bg-lavender-deep text-background"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg text-foreground">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizQuestion;
