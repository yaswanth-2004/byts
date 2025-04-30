
import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const ContentContext = createContext();

export function useContent() {
  return useContext(ContentContext);
}

const categories = [
  { id: '1', name: 'General Discussion', slug: 'general', description: 'For general topics and conversations', icon: 'message-square' },
  { id: '2', name: 'Technology', slug: 'technology', description: 'Discuss the latest tech trends and innovations', icon: 'laptop' },
  { id: '3', name: 'Health & Wellness', slug: 'health', description: 'Share tips and advice for healthy living', icon: 'heart' },
  { id: '4', name: 'Education', slug: 'education', description: 'Resources and discussions about learning', icon: 'book-open' },
  { id: '5', name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, games and more', icon: 'film' }
];

const tags = [
  "Beginner", "Advanced", "Tutorial", "Question", "Discussion", 
  "News", "Review", "Tips", "Guide", "Opinion"
];

// Mock initial posts
const initialPosts = [
  {
    id: '1',
    title: 'Welcome to the Community Forum',
    content: '<p>This is the beginning of our community journey. Welcome aboard! Feel free to explore and engage with other members.</p><p>Here are some guidelines to follow:</p><ul><li>Be respectful to others</li><li>Share knowledge freely</li><li>Ask questions when in doubt</li><li>Help others when you can</li></ul>',
    authorId: '1',
    categoryId: '1',
    tags: ['Beginner', 'Guide'],
    visibility: 'public',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      like: [],
      heart: [],
      celebration: [],
    },
    commentsCount: 2,
    viewsCount: 185
  },
  {
    id: '2',
    title: 'Introduction to Web Development in 2023',
    content: '<h2>Getting Started with Web Development</h2><p>Web development continues to evolve rapidly. Here\'s what you need to know in 2023:</p><ol><li>HTML/CSS fundamentals remain important</li><li>JavaScript is more powerful than ever</li><li>React, Vue, and Angular dominate the frontend</li><li>Node.js is essential for backend</li><li>API knowledge is crucial</li></ol><p>What technologies are you most excited about?</p>',
    authorId: '2',
    categoryId: '2',
    tags: ['Beginner', 'Guide', 'Technology'],
    visibility: 'public',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      like: ['3'],
      heart: ['1'],
      celebration: [],
    },
    commentsCount: 5,
    viewsCount: 312
  },
  {
    id: '3',
    title: 'Healthy Eating Habits for Tech Professionals',
    content: '<p>Working in tech often means long hours at a desk. Here are some healthy eating tips:</p><ul><li>Prepare meals in advance</li><li>Stay hydrated throughout the day</li><li>Choose nutrient-dense snacks</li><li>Take regular breaks to eat properly</li><li>Limit caffeine intake</li></ul><p>What are your strategies for healthy eating while working?</p>',
    authorId: '3',
    categoryId: '3',
    tags: ['Health', 'Tips'],
    visibility: 'public',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: {
      like: ['1', '2'],
      heart: [],
      celebration: ['3'],
    },
    commentsCount: 3,
    viewsCount: 147
  }
];

// Mock initial comments
const initialComments = [
  {
    id: '1',
    postId: '1',
    authorId: '2',
    content: 'Excited to be part of this community!',
    parentId: null,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    postId: '1',
    authorId: '3',
    content: 'Looking forward to all the discussions.',
    parentId: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    postId: '2',
    authorId: '1',
    content: 'Great overview! I would add that TypeScript is becoming essential too.',
    parentId: null,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    postId: '2',
    authorId: '3',
    content: 'I agree. TypeScript has saved me from so many bugs.',
    parentId: '3',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    postId: '2',
    authorId: '2',
    content: 'Thanks for the feedback! You\'re absolutely right.',
    parentId: '3',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    postId: '2',
    authorId: '3',
    content: 'Do you recommend any resources for learning modern web development?',
    parentId: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    postId: '2',
    authorId: '2',
    content: 'MDN Web Docs, freeCodeCamp, and Frontend Masters are great places to start!',
    parentId: '6',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    postId: '3',
    authorId: '1',
    content: 'I\'ve found that using a water tracking app helps me stay hydrated.',
    parentId: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '9',
    postId: '3',
    authorId: '2',
    content: 'Standing desks have been a game-changer for me!',
    parentId: null,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '10',
    postId: '3',
    authorId: '3',
    content: 'Great suggestion! Which standing desk do you use?',
    parentId: '9',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

export function ContentProvider({ children }) {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false);

  // Create post
  const createPost = (postData) => {
    const newPost = {
      id: (parseInt(posts[posts.length - 1]?.id || '0') + 1).toString(),
      authorId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reactions: {
        like: [],
        heart: [],
        celebration: []
      },
      commentsCount: 0,
      viewsCount: 0,
      ...postData,
    };
    
    setPosts(prev => [newPost, ...prev]);
    return Promise.resolve(newPost);
  };

  // Update post
  const updatePost = (postId, updates) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, ...updates, updatedAt: new Date().toISOString() } 
          : post
      )
    );
    return Promise.resolve();
  };

  // Delete post
  const deletePost = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setComments(prev => prev.filter(comment => comment.postId !== postId));
    return Promise.resolve();
  };

  // Get post by ID
  const getPostById = (postId) => {
    const post = posts.find(post => post.id === postId);
    return Promise.resolve(post || null);
  };

  // React to post
  const reactToPost = (postId, reactionType) => {
    if (!currentUser) return Promise.reject(new Error('Must be logged in to react'));

    setPosts(prev => 
      prev.map(post => {
        if (post.id === postId) {
          const reactions = { ...post.reactions };
          
          // Check if user already reacted with this type
          const hasReacted = reactions[reactionType]?.includes(currentUser.id);
          
          if (hasReacted) {
            // Remove the reaction
            reactions[reactionType] = reactions[reactionType].filter(id => id !== currentUser.id);
          } else {
            // Add the reaction
            reactions[reactionType] = [...(reactions[reactionType] || []), currentUser.id];
          }
          
          return { ...post, reactions };
        }
        return post;
      })
    );
    
    return Promise.resolve();
  };

  // Create comment
  const createComment = (postId, content, parentId = null) => {
    if (!currentUser) return Promise.reject(new Error('Must be logged in to comment'));

    const newComment = {
      id: (parseInt(comments[comments.length - 1]?.id || '0') + 1).toString(),
      postId,
      authorId: currentUser.id,
      content,
      parentId,
      createdAt: new Date().toISOString(),
    };
    
    setComments(prev => [...prev, newComment]);
    
    // Update comment count on the post
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, commentsCount: post.commentsCount + 1 } 
          : post
      )
    );
    
    return Promise.resolve(newComment);
  };

  // Delete comment
  const deleteComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return Promise.reject(new Error('Comment not found'));
    
    // Delete the comment and its replies
    const commentIds = getCommentWithReplies(commentId).map(c => c.id);
    const deletedCount = commentIds.length;
    
    setComments(prev => prev.filter(c => !commentIds.includes(c.id)));
    
    // Update comment count on the post
    setPosts(prev => 
      prev.map(post => 
        post.id === comment.postId 
          ? { ...post, commentsCount: Math.max(0, post.commentsCount - deletedCount) } 
          : post
      )
    );
    
    return Promise.resolve();
  };

  // Helper to get a comment and all its replies
  const getCommentWithReplies = (commentId) => {
    const result = [];
    
    // Add the comment itself
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      result.push(comment);
      
      // Recursively find and add all replies
      const findReplies = (parentId) => {
        const replies = comments.filter(c => c.parentId === parentId);
        replies.forEach(reply => {
          result.push(reply);
          findReplies(reply.id);
        });
      };
      
      findReplies(commentId);
    }
    
    return result;
  };
  
  // Get comments for a post
  const getCommentsByPostId = (postId) => {
    return comments.filter(comment => comment.postId === postId);
  };

  // Filter posts
  const filterPosts = (filters = {}) => {
    let filteredPosts = [...posts];
    
    // Filter by category
    if (filters.categoryId) {
      filteredPosts = filteredPosts.filter(post => post.categoryId === filters.categoryId);
    }
    
    // Filter by tag
    if (filters.tag) {
      filteredPosts = filteredPosts.filter(post => post.tags?.includes(filters.tag));
    }
    
    // Filter by author
    if (filters.authorId) {
      filteredPosts = filteredPosts.filter(post => post.authorId === filters.authorId);
    }
    
    // Filter by visibility
    if (filters.visibility) {
      filteredPosts = filteredPosts.filter(post => post.visibility === filters.visibility);
    } else {
      // By default, only show public posts or posts the current user can see
      filteredPosts = filteredPosts.filter(post => {
        if (post.visibility === 'public') return true;
        if (!currentUser) return false;
        if (post.authorId === currentUser.id) return true;
        if (post.visibility === 'private') return false;
        // For 'followers-only', we'd check if currentUser follows the author
        // This is simplified for the demo
        return false;
      });
    }
    
    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filteredPosts;
  };
  
  // Get categories
  const getCategories = () => {
    return categories;
  };
  
  // Get tags
  const getTags = () => {
    return tags;
  }
  
  // Track post view
  const trackView = (postId) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, viewsCount: post.viewsCount + 1 } 
          : post
      )
    );
    
    return Promise.resolve();
  };

  const value = {
    posts,
    comments,
    loading,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    reactToPost,
    createComment,
    deleteComment,
    getCommentsByPostId,
    filterPosts,
    getCategories,
    getTags,
    trackView,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}
