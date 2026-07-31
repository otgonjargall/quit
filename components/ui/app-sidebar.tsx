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
import { useEffect, useState } from "react";

interface Article {
    id: string;
    clerk_id: string;
    title?: string;
}
export function AppSidebar() {
    const { isLoaded, user } = useUser();
    const [articles, setArticles] = useState<Article[]>([]);
    const handleID = async () => {
        const clerkId = user?.id;
        const response = await axios.get(`/api/articles?clerk_id=${clerkId}`)
        setArticles(response.data.rows)
    }
    useEffect(() => {
        if (user?.id && isLoaded) {
            handleID()
        }

    }, [isLoaded, user],)
    return (
        <Sidebar>
            <SidebarHeader className="py-16 px-5" >
                <h2 className="text-[20px] not-italic font-semibold leading-[28px] tracking-[-0.5px]">history</h2>
                <SidebarContent>
                    {articles.map((article) => {
                        return <div key={article.id}>
                            {/* {article.clerk_id} */}
                            {article.title}
                        </div>
                    })}
                    <SidebarGroup />
                    <SidebarGroup />
                </SidebarContent>
            </SidebarHeader>
            <SidebarFooter />
        </Sidebar>
    )
}
// font-family: Inter;
// font-size: 20px;
// font-style: normal;
// font-weight: 600;
// line-height: 28px; /* 140% */
// letter-spacing: -0.5px;



