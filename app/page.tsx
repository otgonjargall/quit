"use client"
import { Button } from "@base-ui/react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
type Articlestype = {
  title: string,
  content: string,
  clerk_id: string
}
export default function Home() {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  

  const handleArticles = async () => {
    if (!title || !content) return alert("hooson bain shvv")
    setIsSubmitting(true)
    try {
      const articlesData: Articlestype = {
        title,
        content,
        clerk_id: user?.id || "",
      }
      const response = await axios.post("/api/articles", articlesData)
      const summary = response.data.Summary || response.data.data?.summery || response.data.summery || ""
      if (summary) {
        const articleId = response.data.data?.id
        router.push(`/take?title=${encodeURIComponent(title)}&id=${encodeURIComponent(String(articleId || ""))}&data=${encodeURIComponent(summary)}`)
      } else {
        alert("Хураангуй үүсгэхэд алдаа гарлаа")
      }
      console.log("amjilttai data irsen", response.data)
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.response?.data?.error
        : null
      alert(message || "Хураангуй үүсгэхэд алдаа гарлаа")
    } finally {
      setIsSubmitting(false)
    }


  }

  return (
    <div className="flex min-h-[calc(100vh-2.25rem)] items-start justify-center bg-muted/30 px-4 py-8 sm:px-8">
      <section className="w-full max-w-157 rounded-md border bg-background px-4 py-4 shadow-sm sm:px-6">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-1.5">
            <Sparkles className="size-4" />
            <h3 className="text-sm font-semibold">Article Quiz Generator</h3>
          </div>

          <p className="text-[11px] leading-4 text-muted-foreground">
            Paste your article below to generate a summary and quiz questions. Your articles will be saved in the sidebar for future reference.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="article-title" className="mb-1 block text-[11px] font-medium">Article Title</label>
            <input
              id="article-title"
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="h-8 w-full rounded-sm border px-2 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              value={title}
              placeholder="Enter a title for your article..."
            />
          </div>

          <div>
            <label htmlFor="article-content" className="mb-1 block text-[11px] font-medium">Article Content</label>
            <textarea
              id="article-content"
              onChange={(e) => setContent(e.target.value)}
              className="min-h-28 w-full resize-y rounded-sm border p-2 text-xs outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              value={content}
              placeholder="Paste your article content here..."
            />
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <Button disabled={isSubmitting} className="h-8 rounded-sm bg-primary px-3 text-[10px] text-primary-foreground hover:bg-primary/80" onClick={handleArticles}>
            {isSubmitting ? "Generating..." : "Generate summary"}
          </Button>
        </div>
      </section>
    </div>

  );
}
