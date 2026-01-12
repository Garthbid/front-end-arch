import { Action } from 'rxjs/internal/scheduler/Action';

export interface NewsletterPost {
    id: string;
    title: string;
    subject: string;
    body: string;
    slug: string;
    imageUrl?: string;
    published: boolean;
    publishedAt: string | null;
    createdAt: string;
}

const STORAGE_KEY = 'garthbid_newsletter_posts';

// Mock initial data if empty
const MOCK_INITIAL_POSTS: NewsletterPost[] = [
    {
        id: '1',
        title: 'The First Hammer Drop',
        subject: 'Welcome to the Hammered Newsletter',
        body: `
      <h2>Welcome to Hammered</h2>
      <p>This is the first edition of <strong>Hammered</strong>, a weekly newsletter where we share the raw, unfiltered truth about building GarthBid.</p>
      <p>We're building this platform in public, and we want you to be part of the journey. No corporate jargon, no fluff—just real stories from the trenches.</p>
      <h3>What to Expect</h3>
      <ul>
        <li>Behind-the-scenes updates on new features</li>
        <li>Honest reflections on what's working (and what isn't)</li>
        <li>Spotlights on our most interesting auctions</li>
      </ul>
      <p>Stay tuned for more. We're just getting started.</p>
      <br />
      <p>- The GarthBid Team</p>
    `,
        slug: 'the-first-hammer-drop',
        published: true,
        publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
];

class NewsletterService {
    private getPostsFromStorage(): NewsletterPost[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            // Initialize with mock data
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_POSTS));
            return MOCK_INITIAL_POSTS;
        }
        return JSON.parse(stored);
    }

    private savePostsToStorage(posts: NewsletterPost[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }

    getAllPosts(): NewsletterPost[] {
        return this.getPostsFromStorage().sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    getPublishedPosts(): NewsletterPost[] {
        return this.getAllPosts().filter(post => post.published);
    }

    getPostBySlug(slug: string): NewsletterPost | undefined {
        return this.getPostsFromStorage().find(post => post.slug === slug);
    }

    createPost(data: Pick<NewsletterPost, 'title' | 'subject' | 'body' | 'published' | 'imageUrl'>): NewsletterPost {
        const posts = this.getPostsFromStorage();

        // Generate slug
        let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let counter = 2;
        while (posts.some(p => p.slug === slug)) {
            slug = `${slug}-${counter}`;
            counter++;
        }

        const newPost: NewsletterPost = {
            id: crypto.randomUUID(),
            title: data.title,
            subject: data.subject,
            body: data.body, // In a real app, sanitize this!
            imageUrl: data.imageUrl,
            slug,
            published: data.published,
            publishedAt: data.published ? new Date().toISOString() : null,
            createdAt: new Date().toISOString()
        };

        posts.unshift(newPost);
        this.savePostsToStorage(posts);
        return newPost;
    }

    updatePost(post: NewsletterPost): void {
        const posts = this.getPostsFromStorage();
        const index = posts.findIndex(p => p.id === post.id);
        if (index !== -1) {
            posts[index] = post;
            this.savePostsToStorage(posts);
        }
    }

    publishPost(id: string): void {
        const posts = this.getPostsFromStorage();
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
            posts[index].published = true;
            posts[index].publishedAt = new Date().toISOString();
            this.savePostsToStorage(posts);
        }
    }

    deletePost(id: string): void {
        const posts = this.getPostsFromStorage();
        const filtered = posts.filter(p => p.id !== id);
        this.savePostsToStorage(filtered);
    }
}

export const newsletterService = new NewsletterService();
