"use client"
import { Button } from "@base-ui/react"
import { BookOpen, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react";

export const dynamic = 'force-dynamic';
const TakeQuizContent = () => {
    const searchParams = useSearchParams()
    const data = searchParams.get("data")
    const router = useRouter()
    const handleTakeQuize = () => {
        if (data) {
            router.push(`/quiz?data=${encodeURIComponent(data)}`)
        }

    }
    return <div>
        <div className="flex">
            <Sparkles></Sparkles>
            <h5> Article Quiz Generator</h5>
        </div>
        <div>
            <p>summarized content</p>
            <BookOpen />
        </div>
        {data}
        <div className="flex justify-between w-[300px]">
            <Button className="border rounded-2xl">See content</Button>
            <Button onClick={handleTakeQuize} className="bg-black hover:bg-gray-500 text-white rounded-2xl">Take a quiz</Button>
        </div>
    </div>
}
const TakeQuiz = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TakeQuizContent />
        </Suspense>
    )
}

export default TakeQuiz
