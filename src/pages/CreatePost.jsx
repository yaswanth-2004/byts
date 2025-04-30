
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import MainLayout from "@/components/layout/MainLayout";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const CreatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createPost, getCategories, getTags } = useContent();
  const categories = getCategories();
  const availableTags = getTags();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      toast.error("You need to be logged in to create a post");
      navigate('/login');
    }
    
    document.title = "Create New Post | Community Forum";
  }, [currentUser, navigate]);
  
  const handleTagAdd = (tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
  };
  
  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleTagAdd(tagInput.trim());
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please add some content to your post");
      return;
    }
    
    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const postData = {
        title: title.trim(),
        content,
        categoryId,
        tags: selectedTags,
        visibility
      };
      
      const newPost = await createPost(postData);
      
      toast.success("Post created successfully");
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Post</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your post"
                maxLength={100}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/100
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Share your thoughts, ideas, or questions..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (up to 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => handleTagRemove(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag (press Enter)"
                  disabled={selectedTags.length >= 5}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => handleTagAdd(tagInput)}
                  disabled={!tagInput.trim() || selectedTags.length >= 5}
                >
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableTags.slice(0, 8).map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleTagAdd(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Visibility</CardTitle>
                <CardDescription>
                  Choose who can see your post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={visibility}
                  onValueChange={setVisibility}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <div className="grid gap-1">
                      <Label htmlFor="public">Public</Label>
                      <p className="text-sm text-muted-foreground">
                        Everyone can see this post
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="followers-only" id="followers-only" />
                    <div className="grid gap-1">
                      <Label htmlFor="followers-only">Followers Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Only your followers can see this post
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <div className="grid gap-1">
                      <Label htmlFor="private">Private</Label>
                      <p className="text-sm text-muted-foreground">
                        Only you can see this post
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <CardFooter className="flex justify-end gap-2 border-t p-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="mr-1 h-4 w-4" />
                    Publish Post
                  </>
                )}
              </Button>
            </CardFooter>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreatePost;
