"use client";

import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  views: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading blog posts...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Plumbing Tips & Insights</h1>
          <p className="text-xl text-slate-600 mb-12">
            Expert advice for keeping your plumbing in top shape
          </p>

          <div className="grid gap-8">
            {posts.length === 0 ? (
              <p className="text-slate-600 text-center py-12">No blog posts yet.</p>
            ) : (
              posts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-slate-600 mb-4">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      {post.publishedAt &&
                        new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span>{post.views} views</span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
