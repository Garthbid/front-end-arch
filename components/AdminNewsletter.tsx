import React, { useState, useEffect } from 'react';
import { newsletterService, NewsletterPost } from '../services/NewsletterService';
import { Plus, Save, Send, Eye, FileText, ChevronRight, Check, Image, Upload, X, Trash2 } from 'lucide-react';
import { COLORS } from '../constants';

const AdminNewsletter: React.FC = () => {
    const [posts, setPosts] = useState<NewsletterPost[]>([]);
    const [view, setView] = useState<'LIST' | 'CREATE'>('LIST');

    // Form State
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = () => {
        setPosts(newsletterService.getAllPosts());
    };

    const handleCreatePost = (publish: boolean) => {
        if (!title.trim() || !subject.trim() || !body.trim()) {
            setToast('Please fill out all fields.');
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setIsPublishing(true);
        try {
            newsletterService.createPost({
                title,
                subject,
                body,
                imageUrl,
                published: publish
            });

            setToast(publish ? 'Post Published!' : 'Draft Saved.');
            setTimeout(() => setToast(null), 3000);

            // Reset and go back to list
            setTitle('');
            setSubject('');
            setBody('');
            setImageUrl('');
            setView('LIST');
            loadPosts();

        } catch (error) {
            setToast('Error creating post.');
        } finally {
            setIsPublishing(false);
        }
    };

    const handlePublish = (id: string) => {
        newsletterService.publishPost(id);
        loadPosts();
        setToast('Post marked as published.');
        setTimeout(() => setToast(null), 3000);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            newsletterService.deletePost(id);
            loadPosts();
            setToast('Post deleted.');
            setTimeout(() => setToast(null), 3000);
        }
    };

    if (view === 'CREATE') {
        return (
            <div className="p-8 max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-display uppercase italic tracking-tighter text-slate-900">Write Newsletter</h2>
                    <button
                        onClick={() => setView('LIST')}
                        className="text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-600"
                    >
                        Cancel
                    </button>
                </div>

                <div className="space-y-6 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    {/* Header Details */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Title (H1)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. The Truth About Auctions"
                                className="w-full text-xl font-bold p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2238ff] focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Subject Line / Excerpt</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="A short summary for email and cards..."
                                className="w-full font-medium p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2238ff] focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Cover Image</label>
                        <div className="flex items-start gap-6">
                            {imageUrl ? (
                                <div className="relative group w-64 aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setImageUrl('')}
                                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-64 aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImageUrl(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <Upload size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Upload Photo</span>
                                </div>
                            )}

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:bg-white focus-within:border-[#2238ff] transition-all">
                                    <Image size={18} className="text-slate-400" />
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="Or paste an image URL here..."
                                        className="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-300"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 pl-1">Recommended: 1200x630px. Supports JPG, PNG, GIF.</p>
                            </div>
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Content (HTML Supported)</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="<p>Write your newsletter here...</p>"
                            className="w-full min-h-[400px] font-mono text-sm p-6 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2238ff] transition-all resize-y"
                        />
                        <p className="text-[10px] text-slate-400 pl-1">Pro tip: Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; tags for formatting.</p>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex items-center justify-end gap-4 border-t border-slate-100">
                        <button
                            onClick={() => handleCreatePost(false)}
                            disabled={isPublishing}
                            className="px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleCreatePost(true)}
                            disabled={isPublishing}
                            className="px-8 py-3 bg-[#2238ff] text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                        >
                            {isPublishing ? 'Publishing...' : <><Send size={16} /> Post Live</>}
                        </button>
                    </div>
                </div>

                {toast && (
                    <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
                        <Check size={18} className="text-green-500" />
                        <span className="font-bold text-sm">{toast}</span>
                    </div>
                )}
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="p-0 animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="p-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display uppercase italic tracking-tighter text-slate-900">Hammered</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Founders Newsletter</p>
                </div>
                <button
                    onClick={() => setView('CREATE')}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Plus size={16} /> New Post
                </button>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/2">Post Title</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Published</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <tr key={post.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{post.title}</div>
                                                <div className="text-[10px] text-slate-400 truncate max-w-[300px]">{post.subject}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${post.published ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xs font-bold text-slate-500">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!post.published && (
                                                <button
                                                    onClick={() => handlePublish(post.id)}
                                                    className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-100"
                                                >
                                                    Publish
                                                </button>
                                            )}
                                            <button className="p-2 text-slate-400 hover:text-[#2238ff] transition-colors rounded-lg hover:bg-blue-50">
                                                <ChevronRight size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                                    No posts found. Start writing!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {toast && (
                <div className="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[60]">
                    <Check size={18} className="text-green-500" />
                    <span className="font-bold text-sm">{toast}</span>
                </div>
            )}
        </div>
    );
};

export default AdminNewsletter;
