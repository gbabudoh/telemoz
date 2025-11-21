import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Tag,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Digital Marketing Strategies for 2024",
    excerpt: "Discover the top digital marketing strategies that will help you grow your business in 2024. From SEO to social media, learn what works.",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Strategy",
    image: "/blog/marketing-strategies.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "How to Build a Successful Freelance Digital Marketing Career",
    excerpt: "Learn the secrets to building a thriving freelance career in digital marketing. Tips from successful professionals.",
    author: "Michael Chen",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Career",
    image: "/blog/freelance-career.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "AI Tools Revolutionizing Digital Marketing",
    excerpt: "Explore how AI-powered tools are transforming the digital marketing landscape and how you can leverage them.",
    author: "Emily Davis",
    date: "2024-01-10",
    readTime: "10 min read",
    category: "Technology",
    image: "/blog/ai-tools.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "The Ultimate Guide to SEO in 2024",
    excerpt: "Everything you need to know about SEO best practices, algorithm updates, and ranking factors for 2024.",
    author: "David Wilson",
    date: "2024-01-08",
    readTime: "12 min read",
    category: "SEO",
    image: "/blog/seo-guide.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Client Communication: Building Strong Relationships",
    excerpt: "Learn how to communicate effectively with clients and build long-lasting professional relationships.",
    author: "Lisa Anderson",
    date: "2024-01-05",
    readTime: "5 min read",
    category: "Business",
    image: "/blog/client-communication.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "Social Media Marketing Trends to Watch",
    excerpt: "Stay ahead of the curve with the latest social media marketing trends and platform updates.",
    author: "James Taylor",
    date: "2024-01-03",
    readTime: "7 min read",
    category: "Social Media",
    image: "/blog/social-media-trends.jpg",
    featured: false,
  },
];

const categories = ["All", "Strategy", "Career", "Technology", "SEO", "Business", "Social Media"];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#94d2bd]/10 via-[#e0e1dd]/30 to-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="rounded-lg bg-gradient-to-br from-[#0a9396] to-[#94d2bd] p-3">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Insights, tips, and strategies for digital marketing professionals and businesses
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-[#0a9396] focus:outline-none focus:ring-2 focus:ring-[#0a9396]/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "primary" : "default"}
                  className="cursor-pointer hover:bg-[#0a9396]/10"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Card className="mb-12 border-2 border-[#0a9396]/30 hover:shadow-lg transition-all">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto bg-gradient-to-br from-[#0a9396] to-[#94d2bd]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-24 w-24 text-white/20" />
                  </div>
                  <Badge
                    variant="primary"
                    className="absolute top-4 left-4"
                  >
                    Featured
                  </Badge>
                </div>
                <div className="p-8">
                  <Badge variant="info" size="sm" className="mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <Link href={`/blog/${featuredPost.id}`}>
                    <Button className="bg-[#0a9396] hover:bg-[#087579] text-white">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <Card className="h-full hover:border-[#0a9396]/50 hover:shadow-md transition-all cursor-pointer">
                <div className="relative h-48 bg-gradient-to-br from-[#0a9396]/20 to-[#94d2bd]/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-[#0a9396]/30" />
                  </div>
                  <Badge
                    variant="info"
                    size="sm"
                    className="absolute top-3 left-3"
                  >
                    {post.category}
                  </Badge>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-br from-[#0a9396]/10 to-[#94d2bd]/10 border-[#0a9396]/30">
          <CardContent className="pt-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter to get the latest articles and digital marketing tips delivered to your inbox.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button className="bg-[#0a9396] hover:bg-[#087579] text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

