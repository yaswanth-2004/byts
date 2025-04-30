
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import { formatDistanceToNow, format } from "date-fns";
import MainLayout from "@/components/layout/MainLayout";
import CommentSection from "@/components/posts/CommentSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ThumbsUp,
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  ArrowLeft,
  PartyPopper,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// Mock user data for the demo
const mockUserData = {
  "1": {
    name: "Admin User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
  },
  "2": {
    name: "Moderator User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moderator"
  },
  "3": {
    name: "Regular User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getPostById, reactToPost, deletePost, trackView, getCategories } = useContent();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const categories = getCategories();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPostById(id);
        if (!postData) {
          navigate('/not-found');
          return;
        }
        setPost(postData);
        
        // Track view after a small delay to avoid tracking refreshes
        setTimeout(() => {
          trackView(id);
        }, 2000);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load the post");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, navigate]);
  
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Community Forum`;
    } else {
      document.title = "Loading Post | Community Forum";
    }
  }, [post]);
  
  const handleReaction = async (type) => {
    if (!currentUser) {
      toast("Please log in to react to posts");
      return;
    }
    
    try {
      await reactToPost(post.id, type);
      // Update local state
      const updatedPost = await getPostById(id);
      setPost(updatedPost);
    } catch (error) {
      toast.error("Failed to save your reaction");
    }
  };
  
  const handleDelete = async () => {
    if (!currentUser) return;
    
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      navigate('/');
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const userReactions = currentUser && post ? {
    like: post.reactions.like?.includes(currentUser.id),
    heart: post.reactions.heart?.includes(currentUser.id),
    celebration: post.reactions.celebration?.includes(currentUser.id)
  } : {};

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading post...</p>
        </div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground mt-2">The post you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const author = mockUserData[post.authorId];
  const createdAt = new Date(post.createdAt);
  const category = categories.find(c => c.id === post.categoryId);
  
  const totalReactions = 
    (post.reactions.like?.length || 0) + 
    (post.reactions.heart?.length || 0) + 
    (post.reactions.celebration?.length || 0);

  return (
    <MainLayout>
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Discussions
          </Link>
        </Button>
        
        <article className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${post.authorId}`} className="font-medium hover:underline">
                    {author.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(createdAt, "PP")}</span>
                </div>
              </div>
            </div>
            
            {currentUser && (currentUser.id === post.authorId || currentUser.role === 'admin') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Post menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/edit-post/${post.id}`} className="flex cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {category && (
              <div className="mt-2">
                <Badge variant="outline">
                  {category.name}
                </Badge>
              </div>
            )}
          </div>
          
          <div 
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <Separator />
          
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  userReactions?.like && "text-blue-500"
                )}
                onClick={() => handleReaction("like")}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>
                  {post.reactions.like?.length > 0
                    ? post.reactions.like.length
                    : "Like"}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  userReactions?.heart && "text-rose-500"
                )}
                onClick={() => handleReaction("heart")}
              >
                <Heart className="h-4 w-4" />
                <span>
                  {post.reactions.heart?.length > 0
                    ? post.reactions.heart.length
                    : "Heart"}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  userReactions?.celebration && "text-yellow-500"
                )}
                onClick={() => handleReaction("celebration")}
              >
                <PartyPopper className="h-4 w-4" />
                <span>
                  {post.reactions.celebration?.length > 0
                    ? post.reactions.celebration.length
                    : "Celebrate"}
                </span>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentsCount}</span>
                <span className="sr-only">comments</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.viewsCount}</span>
                <span className="sr-only">views</span>
              </div>
            </div>
          </div>
        </article>
        
        <Separator className="my-8" />
        
        <CommentSection postId={post.id} />
      </div>
    </MainLayout>
  );
};

export default PostDetail;
