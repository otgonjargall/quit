"use client"
import { useAuth } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from "next/navigation"

const Quiz = () => {
    const [quizData, setQuizData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const searchParams = useSearchParams()
    const data = searchParams.get("data")
    useEffect(() => {
        const fetchQuizdata = async () => {
            try {
                const response = await axios.post("/api/quize", { text: data })
                setQuizData(response.data)
                setLoading(false)
            } catch (error) { console.log("data irsengvi") }
        }

        fetchQuizdata()

    }, [data])
    const handleAnswerOptionClick = (selectedOption: string) => {
        //----odoo asuultin zow hariultiig awi
        const currentQuestion = quizData.data.questions[currentIndex]

        if (selectedOption === currentQuestion?.correctAnswer) {
            setScore((prev) => prev + 1)

        }
        setCurrentIndex((prev) => prev + 1)

    }
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Асуултуудыг бэлдэж байна, түр хүлээнэ үү... ⏳</p>
            </div>
        )
    }
    if (!quizData?.data?.questions || quizData.data.questions.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Асуулт олдсонгүй эсвэл алдаа гарлаа. ❌</p>
            </div>
        )
    }
    return <div className=" flex flex-col justify-center ">
        <div className=" flex">
            <Sparkles></Sparkles>
            <h4>Quick test </h4>
        </div>
        <div>
            <p> test about your knowledge from your content </p>
            {/* {currentIndex>} */}
            <span>{currentIndex + 1}/{quizData?.data?.questions.length}</span>
        </div>
        <div className="bg-[#ffffff] w-[300px] ">
            {currentIndex >= quizData?.data?.questions.length ? (
                <div>
                    <h2>Квиз дууслаа! 🎉</h2>
                    <p>Таны оноо: {score} / {quizData?.data?.questions.length}</p>
                </div>
            ) : (

                <div className="flex flex-wrap w-[486px] gap-3">
                    <h3>{quizData?.data?.questions[currentIndex]?.question}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {quizData?.data?.questions[currentIndex]?.options?.map((option: string, index: number) => (
                            <button onClick={() => handleAnswerOptionClick(option)} key={index} className="border w-[243px] h-[40px]">
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
}
export default Quiz
