import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizIntro from "@/components/quiz/QuizIntro";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResults from "@/components/quiz/QuizResults";

export type SanctuaryType = "cozy-gamer" | "soft-study" | "night-owl";

export interface QuizAnswer {
  questionId: number;
  answerId: string;
}

const quizQuestions = [
  {
    id: 1,
    question: "What time of day do you feel most creative?",
    subtitle: "When does your brain spark?",
    options: [
      { id: "a", text: "Late at night 🌙", type: "night-owl" as SanctuaryType },
      { id: "b", text: "Afternoon energy ☀️", type: "soft-study" as SanctuaryType },
      { id: "c", text: "Anytime I'm gaming 🎮", type: "cozy-gamer" as SanctuaryType },
    ],
  },
  {
    id: 2,
    question: "Pick your ideal desk vibe:",
    subtitle: "Close your eyes and imagine...",
    options: [
      { id: "a", text: "RGB glow & cute peripherals", type: "cozy-gamer" as SanctuaryType },
      { id: "b", text: "Warm lamp & stacked books", type: "soft-study" as SanctuaryType },
      { id: "c", text: "Moon lamp & starry ambience", type: "night-owl" as SanctuaryType },
    ],
  },
  {
    id: 3,
    question: "What helps you focus best?",
    subtitle: "Everyone's different...",
    options: [
      { id: "a", text: "Lofi beats or game OSTs", type: "cozy-gamer" as SanctuaryType },
      { id: "b", text: "Café sounds or silence", type: "soft-study" as SanctuaryType },
      { id: "c", text: "ASMR or rain sounds", type: "night-owl" as SanctuaryType },
    ],
  },
  {
    id: 4,
    question: "Your comfort object would be:",
    subtitle: "What soothes your soul?",
    options: [
      { id: "a", text: "Squishy plushie friend", type: "cozy-gamer" as SanctuaryType },
      { id: "b", text: "Warm cup of something", type: "soft-study" as SanctuaryType },
      { id: "c", text: "Weighted blanket or pillow", type: "night-owl" as SanctuaryType },
    ],
  },
  {
    id: 5,
    question: "Pick a scent for your space:",
    subtitle: "What should fill the air?",
    options: [
      { id: "a", text: "Cotton candy or fruity", type: "cozy-gamer" as SanctuaryType },
      { id: "b", text: "Vanilla or fresh linen", type: "soft-study" as SanctuaryType },
      { id: "c", text: "Lavender or midnight jasmine", type: "night-owl" as SanctuaryType },
    ],
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<SanctuaryType | null>(null);

  const handleStart = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (questionId: number, answerId: string, type: SanctuaryType) => {
    const newAnswers = [...answers, { questionId, answerId }];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const typeCounts: Record<SanctuaryType, number> = {
        "cozy-gamer": 0,
        "soft-study": 0,
        "night-owl": 0,
      };

      quizQuestions.forEach((q, index) => {
        const answer = newAnswers[index];
        const option = q.options.find((o) => o.id === answer.answerId);
        if (option) {
          typeCounts[option.type]++;
        }
      });

      const winner = Object.entries(typeCounts).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0] as SanctuaryType;

      setResult(winner);
    }
  };

  const handleRetake = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {!quizStarted ? (
          <QuizIntro onStart={handleStart} />
        ) : result ? (
          <QuizResults result={result} onRetake={handleRetake} />
        ) : (
          <QuizQuestion
            question={quizQuestions[currentQuestion]}
            currentStep={currentQuestion + 1}
            totalSteps={quizQuestions.length}
            onAnswer={handleAnswer}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;
