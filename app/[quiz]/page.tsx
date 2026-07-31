"use client"
import { useAuth } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

const Quiz = () => {
    const [quizData, setQuizData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    useEffect(() => {
        const fetchQuizdata = async () => {
            try {
                const response = await axios.post("/api/quize", {})
                setQuizData(response.data)
            } catch (error) { console.log("data irsengvi") }
        }

        fetchQuizdata()

    }, [])
    const handleAnswerOptionClick = (selectedOption: string) => {
        //----odoo asuultin zow hariultiig awi
        const currentQuestion = quizData.data.questions[currentIndex]

        if (selectedOption === currentQuestion?.correctAnswer)
            setScore((prev) => prev + 1)
        setCurrentIndex((prev) => prev + 1)

    }
    return <div>
        <div>
            <Sparkles></Sparkles>
            <p>Take a quick test about your knowledge from your content </p>
        </div>
        <div>
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
//  <div>
//             {currentIndex >= quizData?.data?.questions.length ? (
//                  🏆 1. Асуулт дууссан үед: Оноогоо харуулна
//             <div>
//                 <h2>Квиз дууслаа! 🎉</h2>
//                 <p>Таны оноо: {score} / {quizData?.data?.questions.length}</p>
//             </div>
//             ) : (
//             ❓ 2. Асуулт дуусаагүй үед: Асуулт болон сонголтуудыг харуулна
//         </div>
//         <div className="flex  flex-wrap w-[486px]  gap-3">
//             <h3>{quizData?.data?.questions[currentIndex]?.question}</h3>
//             <div className="grid grid-cols-2 gap-3">
//                 {quizData?.data?.questions[currentIndex]?.options?.map((option: string, index: number) => (
//                     <button onClick={() => handleAnswerOptionClick(option)} key={index} className="border w-[243px] h-[40px]">
//                         {option}
//                     </button>

//                 ))}

//             </div>
//             }
//         </div>