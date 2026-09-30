"use client";
import { Button } from "@base-ui/react";
import axios from "axios";
import { BookOpen, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";

export const dynamic = "force-dynamic";
const TakeQuizContent = () => {
    const searchParams = useSearchParams();
    const data = searchParams.get("data");
    const title = searchParams.get("title") || "Summarized content";
    const articleId = searchParams.get("id");
    const router = useRouter();
    const [articleContent, setArticleContent] = useState<string | null>(null);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false);
    const [contentError, setContentError] = useState<string | null>(null);

    const handleSeeContent = async () => {
        if (isContentVisible) {
            setIsContentVisible(false);
            return;
        }

        if (articleContent !== null) {
            setIsContentVisible(true);
            return;
        }

        if (!articleId) {
            setContentError("Original article content is unavailable.");
            return;
        }

        setIsContentLoading(true);
        setContentError(null);
        try {
            const response = await axios.get("/api/articles", {
                params: { id: articleId },
            });
            const content = response.data.rows?.[0]?.content;

            if (typeof content !== "string" || !content.trim()) {
                setContentError("Original article content is unavailable.");
                return;
            }

            setArticleContent(content);
            setIsContentVisible(true);
        } catch {
            setContentError("Could not load the original article.");
        } finally {
            setIsContentLoading(false);
        }
    };

    const handleTakeQuize = () => {
        if (data) {
            router.push(`/quiz?data=${encodeURIComponent(data)}`);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-2.5rem)] items-center justify-center bg-muted/30 px-4 py-8 sm:px-8">
            <section className="w-full max-w-159 rounded-md border bg-background p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="size-5 shrink-0" aria-hidden="true" />
                    <h1 className="text-sm font-semibold">Article Quiz Generator</h1>
                </div>

                <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                    <BookOpen className="size-3.5" aria-hidden="true" />
                    <p className="text-[11px]">Summarized content</p>
                </div>
                <h2 className="mb-2 text-base font-semibold">{title}</h2>
                <p className="text-xs leading-5 text-foreground/85">
                    {data || "No summary available."}
                </p>

                {contentError && (
                    <p className="mt-3 text-xs text-destructive" role="alert">
                        {contentError}
                    </p>
                )}
                {isContentVisible && articleContent && (
                    <div className="mt-4 rounded-sm bg-muted/50 p-3">
                        <h3 className="mb-1 text-xs font-semibold">Original content</h3>
                        <p className="whitespace-pre-wrap text-xs leading-5 text-foreground/85">
                            {articleContent}
                        </p>
                    </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <Button
                        onClick={handleSeeContent}
                        disabled={isContentLoading}
                        className="h-8 rounded-sm border px-3 text-[11px] hover:bg-muted disabled:opacity-50"
                    >
                        {isContentLoading
                            ? "Loading..."
                            : isContentVisible
                              ? "Hide content"
                              : "See content"}
                    </Button>
                    <Button
                        onClick={handleTakeQuize}
                        disabled={!data}
                        className="h-8 rounded-sm bg-primary px-3 text-[11px] text-primary-foreground hover:bg-primary/80 disabled:opacity-50"
                    >
                        Take a quiz
                    </Button>
                </div>
            </section>
        </div>
    );
};
const TakeQuiz = () => {
    return (
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
            <TakeQuizContent />
        </Suspense>
    );
};

export default TakeQuiz;
