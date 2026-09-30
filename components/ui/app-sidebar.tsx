"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Clock3 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Article {
    id: string;
    clerk_id: string;
    title?: string;
    content?: string;
    summery?: string;
    createdat?: string;
}

const formatCreatedAt = (value?: string) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("mn-MN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

export function AppSidebar() {
    const { isLoaded, user } = useUser();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!user?.id || !isLoaded) return;

        let isCancelled = false;
        const loadArticles = async () => {
            setIsLoading(true);
            setHasError(false);

            try {
                const response = await axios.get("/api/articles");
                if (!isCancelled) setArticles(response.data.rows || []);
            } catch {
                if (!isCancelled) setHasError(true);
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        }

        void loadArticles();
        return () => {
            isCancelled = true;
        };
    }, [isLoaded, pathname, user?.id]);

    const openArticle = (article: Article) => {
        const articleData = article.summery || article.content;
        if (articleData) {
            const title = article.title || "Summarized content";
            router.push(`/take?title=${encodeURIComponent(title)}&id=${encodeURIComponent(article.id)}&data=${encodeURIComponent(articleData)}`);
        }
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b px-4 py-4">
                <h2 className="text-sm font-semibold">History</h2>
                <p className="text-xs text-muted-foreground">Your saved articles</p>
            </SidebarHeader>
            <SidebarContent className="px-2 py-2">
                {isLoading && <p className="px-2 py-3 text-xs text-muted-foreground">Loading history...</p>}
                {hasError && <p className="px-2 py-3 text-xs text-destructive">History could not be loaded.</p>}
                {!isLoading && !hasError && articles.length === 0 && (
                    <p className="px-2 py-3 text-xs text-muted-foreground">No saved articles yet.</p>
                )}
                {!isLoading && !hasError && articles.length > 0 && (
                    <div className="space-y-1">
                        {articles.map((article) => (
                            <button
                                key={article.id}
                                type="button"
                                onClick={() => openArticle(article)}
                                className="w-full rounded-md px-2 py-2 text-left transition-colors hover:bg-sidebar-accent"
                            >
                                <span className="block truncate text-xs font-medium">
                                    {article.title || "Untitled article"}
                                </span>
                                <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                                    {article.summery || article.content || "No summary available"}
                                </span>
                                {formatCreatedAt(article.createdat) && (
                                    <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/80">
                                        <Clock3 className="size-3 shrink-0" aria-hidden="true" />
                                        <span>{formatCreatedAt(article.createdat)}</span>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}



