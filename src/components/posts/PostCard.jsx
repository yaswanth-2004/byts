
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  MoreVertical,
  Edit,
  Trash2,
  PartyPopper,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

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

const PostCard = ({ post }) => {
  const { currentUser } = useAuth();
  const { reactToPost, deletePost } = useContent();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const author = mockUserData[post.authorId];
  const createdAt = new Date(post.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  
  const totalReactions = 
    (post.reactions.like?.length || 0) + 
    (post.reactions.heart?.length || 0) + 
    (post.reactions.celebration?.length || 0);
  
  const userReactions = currentUser ? {
    like: post.reactions.like?.includes(currentUser.id),
    heart: post.reactions.heart?.includes(currentUser.id),
    celebration: post.reactions.celebration?.includes(currentUser.id)
  } : {};
  
  const handleReaction = async (type) => {
    if (!currentUser) {
      toast("Please log in to react to posts");
      return;
    }
    
    try {
      await reactToPost(post.id, type);
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
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Extract first paragraph for excerpt
  const getExcerpt = (content) => {
    if (!content) return "";
    const div = document.createElement("div");
    div.innerHTML = content;
    const firstParagraph = div.querySelector("p");
    if (firstParagraph) {
      return firstParagraph.textContent;
    }
    return div.textContent.substring(0, 150) + (div.textContent.length > 150 ? "..." : "");
  };
  
  const excerpt = getExcerpt(post.content);

  return (
    <article className="relative bg-card rounded-lg border p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
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
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {post.visibility === 'public' ? 'Public' : post.visibility === 'private' ? 'Private' : 'Followers Only'}
            </p>
          </div>
        </div>
        
        {currentUser && (currentUser.id === post.authorId || currentUser.role === 'admin') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
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
                className="flex cursor-pointer text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <Link to={`/post/${post.id}`}>
        <h3 className="mb-2 text-xl font-bold">{post.title}</h3>
        <div className="mb-3 text-muted-foreground">
          {excerpt}
        </div>
      </Link>
      
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="hover:scale-105">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between border-t pt-3 mt-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1",
              userReactions.like && "text-blue-500"
            )}
            onClick={() => handleReaction("like")}
          >
            <ThumbsUp className="h-4 w-4" />
            {post.reactions.like?.length > 0 && (
              <span>{post.reactions.like.length}</span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1",
              userReactions.heart && "text-rose-500"
            )}
            onClick={() => handleReaction("heart")}
          >
            <Heart className="h-4 w-4" />
            {post.reactions.heart?.length > 0 && (
              <span>{post.reactions.heart.length}</span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1",
              userReactions.celebration && "text-yellow-500"
            )}
            onClick={() => handleReaction("celebration")}
          >
            <PartyPopper className="h-4 w-4" />
            {post.reactions.celebration?.length > 0 && (
              <span>{post.reactions.celebration.length}</span>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs">
            <Eye className="h-4 w-4" />
            <span>{post.viewsCount}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
