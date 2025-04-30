
import { useEffect } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const Index = () => {
  const { filterPosts, getCategories, getTags } = useContent();
  const categories = getCategories();
  const tags = getTags();
  const featuredTags = tags.slice(0, 5);
  
  // Get all public posts, sorted by date
  const posts = filterPosts({ visibility: "public" });
  
  useEffect(() => {
    document.title = "Community Forum - Home";
  }, []);
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Latest Discussions</h1>
            <Button asChild>
              <Link to="/new-post">
                <Plus className="mr-1 h-5 w-5" />
                Create Post
              </Link>
            </Button>
          </div>
          
          <div className="flex overflow-x-auto pb-2 gap-2">
            <Button variant="outline" size="sm" asChild className="rounded-full">
              <Link to="/">All</Link>
            </Button>
            {categories.map(category => (
              <Button key={category.id} variant="outline" size="sm" asChild className="rounded-full">
                <Link to={`/category/${category.slug}`}>{category.name}</Link>
              </Button>
            ))}
          </div>
          
          <div className="flex overflow-x-auto pb-2 gap-2">
            {featuredTags.map(tag => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-accent">
                {tag}
              </Badge>
            ))}
          </div>
        </section>
        
        <section className="grid gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
