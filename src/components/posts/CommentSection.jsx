
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Reply,
  Trash2,
  MessagesSquare,
  Loader2,
  Send,
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

const Comment = ({ comment, postId, depth = 0 }) => {
  const { currentUser } = useAuth();
  const { createComment, deleteComment, getCommentsByPostId } = useContent();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const author = mockUserData[comment.authorId];
  const createdAt = new Date(comment.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
  
  // Get replies to this comment
  const replies = getCommentsByPostId(postId).filter(
    c => c.parentId === comment.id
  );
  
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      await createComment(postId, replyContent, comment.id);
      setReplyContent("");
      setIsReplying(false);
      toast.success("Reply posted successfully");
    } catch (error) {
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteComment(comment.id);
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className={cn("relative", depth > 0 && "ml-6")}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{author.name}</span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            
            {currentUser && (currentUser.id === comment.authorId || currentUser.role === 'admin') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                    <span className="sr-only">Comment menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="mt-1 text-sm whitespace-pre-wrap">
            {comment.content}
          </div>
          
          {currentUser && depth < 3 && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="mr-1 h-3 w-3" />
                Reply
              </Button>
            </div>
          )}
          
          {isReplying && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-1 h-4 w-4" />
                  )}
                  Reply
                </Button>
              </div>
            </div>
          )}
          
          {replies.length > 0 && (
            <div className="mt-3 space-y-4">
              {replies.map(reply => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {depth > 0 && (
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-muted" />
      )}
    </div>
  );
};

const CommentSection = ({ postId }) => {
  const { currentUser } = useAuth();
  const { createComment, getCommentsByPostId } = useContent();
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get top-level comments
  const comments = getCommentsByPostId(postId).filter(
    comment => comment.parentId === null
  );
  
  const handleSubmit = async () => {
    if (!commentContent.trim()) return;
    
    try {
      setIsSubmitting(true);
      await createComment(postId, commentContent);
      setCommentContent("");
      toast.success("Comment posted successfully");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-8">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
        <MessagesSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h2>
      
      {currentUser ? (
        <div className="mb-6 space-y-2">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !commentContent.trim()}
            >
              {isSubmitting ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-1 h-4 w-4" />
              )}
              Post Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-muted/50 rounded-md text-center">
          <p>Please <Button variant="link" className="p-0 h-auto font-semibold">log in</Button> to join the conversation.</p>
        </div>
      )}
      
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} postId={postId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No comments yet. Be the first to start the conversation!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
