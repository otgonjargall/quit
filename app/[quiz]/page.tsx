"use client"

import { Button } from "@base-ui/react"
import axios from "axios"
import { Bookmark, CircleCheck, CircleX, RotateCcw, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Question = {
    question: string
    options: string[]
    correctAnswer: string
}

type QuizResponse = {
    data?: {
        questions?: Question[]
    }
}

const Quiz = () => {
    const [quizData, setQuizData] = useState<QuizResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [finalScore, setFinalScore] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [answers, setAnswers] = useState<string[]>([])
    const [isFinished, setIsFinished] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const data = searchParams.get("data")

    useEffect(() => {
        const fetchQuizData = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await axios.post<QuizResponse>("/api/quize", { text: data })
                setQuizData(response.data)
            } catch (requestError: unknown) {
                const message = axios.isAxiosError(requestError)
                    ? requestError.response?.data?.message
                    : null
                setError(message || "Quiz uusgeh ued aldaa garlaa. Daraa dahin oroldono uu.")
            } finally {
                setLoading(false)
            }
        }

        if (data) {
            fetchQuizData()
        }
    }, [data])

    const questions = quizData?.data?.questions ?? []
    const currentQuestion = questions[currentIndex]

    const handleNextQuestion = () => {
        if (!selectedAnswer || !currentQuestion) return

        const updatedAnswers = [...answers]
        updatedAnswers[currentIndex] = selectedAnswer
        setAnswers(updatedAnswers)

        if (currentIndex === questions.length - 1) {
            setFinalScore(
                updatedAnswers.filter(
                    (answer, index) => answer === questions[index].correctAnswer,
                ).length,
            )
            setIsFinished(true)
            return
        }

        setCurrentIndex((previousIndex) => previousIndex + 1)
        setSelectedAnswer(null)
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setFinalScore(0)
        setSelectedAnswer(null)
        setAnswers([])
        setIsFinished(false)
    }

    if (loading) {
        return (
            <div className="flex min-h-[calc(100vh-2.25rem)] items-center justify-center bg-muted/30 px-6">
                <p className="text-sm text-muted-foreground">Asuultuudiig beldej baina...</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex min-h-[calc(100vh-2.25rem)] items-center justify-center bg-muted/30 px-6 text-center">
                <p className="text-sm text-muted-foreground">Kviziin ugugdul oldsongui.</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-[calc(100vh-2.25rem)] items-center justify-center bg-muted/30 px-6 text-center">
                <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
        )
    }

    if (questions.length === 0) {
        return (
            <div className="flex min-h-[calc(100vh-2.25rem)] items-center justify-center bg-muted/30">
                <p className="text-sm text-muted-foreground">Asuult oldsongui.</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-[calc(100vh-2.25rem)] items-start justify-center bg-muted/30 px-4 py-8 sm:px-8">
            <section className={`w-full ${isFinished ? "max-w-115" : "max-w-157 rounded-md border bg-background px-4 py-5 shadow-sm sm:px-6"}`}>
                {isFinished ? (
                    <div>
                        <div className="mb-3 flex items-start gap-2">
                            <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            <div>
                                <h1 className="text-sm font-semibold">Quiz completed</h1>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">Let&apos;s see what you did</p>
                            </div>
                        </div>

                        <div className="rounded-md border bg-background p-3 shadow-sm sm:p-4">
                            <h2 className="text-sm font-semibold">
                                Your score: {finalScore} <span className="text-muted-foreground">/ {questions.length}</span>
                            </h2>

                            <div className="mt-3 space-y-3">
                                {questions.map((question, index) => {
                                    const answer = answers[index]
                                    const isCorrect = answer === question.correctAnswer

                                    return (
                                        <div key={`${question.question}-${index}`} className="flex gap-2">
                                            {isCorrect ? (
                                                <CircleCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                                            ) : (
                                                <CircleX className="mt-0.5 size-3.5 shrink-0 text-red-500" aria-hidden="true" />
                                            )}
                                            <div className="min-w-0 text-[10px] leading-4">
                                                <p className="font-medium">{index + 1}. {question.question}</p>
                                                <p className="text-muted-foreground">Your answer: {answer || "Not answered"}</p>
                                                {!isCorrect && (
                                                    <p className="text-emerald-600">Correct: {question.correctAnswer}</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <Button onClick={handleRestart} className="h-8 rounded-sm border px-2 text-[10px] hover:bg-muted">
                                    <RotateCcw className="mr-1.5 size-3" aria-hidden="true" />
                                    Restart quiz
                                </Button>
                                <Button onClick={() => router.push("/")} className="h-8 rounded-sm bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/80">
                                    <Bookmark className="mr-1.5 size-3" aria-hidden="true" />
                                    Save and leave
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <div className="mb-1 flex items-center gap-1.5">
                                    <Sparkles className="size-4" />
                                    <h1 className="text-sm font-semibold">Quick test</h1>
                                </div>
                                <p className="text-[11px] text-muted-foreground">Test your knowledge from your article</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{currentIndex + 1} / {questions.length}</span>
                        </div>

                    <div>
                        <div className="mb-5 h-1 rounded-full bg-muted">
                            <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
                        </div>

                        <h2 className="mb-4 text-sm font-semibold leading-5">{currentQuestion.question}</h2>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {currentQuestion.options.map((option) => (
                                <button
                                    onClick={() => setSelectedAnswer(option)}
                                    key={option}
                                    className={`min-h-12 rounded-sm border px-3 py-2 text-left text-xs transition-colors ${selectedAnswer === option ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                onClick={handleNextQuestion}
                                disabled={!selectedAnswer}
                                className="h-8 rounded-sm bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {currentIndex === questions.length - 1 ? "Finish quiz" : "Next question"}
                            </button>
                        </div>
                    </div>
                    </>
                )}
            </section>
        </div>
    )
}

export default Quiz
