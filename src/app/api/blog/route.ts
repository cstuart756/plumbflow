/**
 * Blog API - Create, read, update blog posts
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * GET /api/blog - Get all published blog posts
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");

    if (slug) {
      // Get single post by slug
      const post = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      // Increment view count
      await prisma.blogPost.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });

      return NextResponse.json(post);
    }

    // Get all published posts
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        metaDescription: true,
        ogImage: true,
        publishedAt: true,
        views: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[BLOG] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * POST /api/blog - Create new blog post
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, content, excerpt, keywords, ogImage, metaDescription } = body;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        keywords,
        ogImage,
        metaDescription,
        published: false, // Draft by default
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[BLOG] Error creating post:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
