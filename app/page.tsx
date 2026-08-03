"use client"
import { Button } from "@base-ui/react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Usertype = {
  clerkid: string

  email: string | undefined

  name: string | null;

};
type Articlestype = {
  title: string,
  content: string,
  // summerize: string,
  clerk_id: string
}
export default function Home() {
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summeriza, setSummeriza] = useState("")
  const router = useRouter();
  // const saveUserToDB = async () => {

  //   if (!isLoaded) return
  //   if (!user || !user.primaryEmailAddress?.emailAddress) return;
  //   console.log("hereglegch amjilttai nevtersen bn");
  //   const userData: Usertype = {
  //     clerkid: user.id,
  //     email: user.primaryEmailAddress.emailAddress,
  //     name: user.fullName,
  //   };

  //   try {
  //     const response = await axios.post("/api/users", userData);
  //     console.log("backendiin hariu:", response.data);
  //   } catch (error) {
  //     console.error("Дата хадгалахад алдаа гарлаа:", error);
  //   }
  // };

  const handleArticles = async () => {
    if (!title || !content) return alert("hooson bain shvv")
    try {
      const articlesData: Articlestype = {
        title,
        content,
        // summerize,
        clerk_id: user?.id || "",
      }
      const response = await axios.post("/api/articles", articlesData)
      setSummeriza(response.data.Summary)
      router.push(`/take?data=${encodeURIComponent(response.data.Summary)}`)
      console.log("amjilttai data irsen", response.data)
    } catch (error) { console.log("aldaa garlaa", error) }


  }

  return (
    <div className="w-[856px] h-[442px] border py-4 px-6">
      <div className="w-[800px] h-[400px] ">
        <h3>Article Quize Generator</h3>
        <Sparkles></Sparkles>
        <p>Paste your article below to Generated a summarize and quiz question.Your articles will saved in the sidebar for future reference.</p>
        <p>Article Title</p>
        <input onChange={(e) => { setTitle(e.target.value) }} type="text" className="border w-full" value={title} placeholder="Enter a title for your article" />
        <p>Article Content</p>
        <textarea onChange={(e) => { setContent(e.target.value) }} name="" id="" className="w-full h-[120px] border" value={content} placeholder="Paste your article content here..."></textarea>
        <div>
        </div>
        <div className="flex justify-end w-[200px]">

          <Button className="bg-black border rounded-2xl w-40 h-10 hover:bg-gray-500 text-white" onClick={handleArticles}>generate summary</Button>

        </div>
      </div>

    </div>

  );
}
//  < Link href={`/take?data=${encodeURIComponent(summeriza)}`}></Link>