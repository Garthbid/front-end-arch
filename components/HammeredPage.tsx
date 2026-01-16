import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Mail, Calendar } from 'lucide-react';
import { newsletterService, NewsletterPost } from '../services/NewsletterService';
import { COLORS } from '../constants';

interface HammeredPageProps {
    onReadPost: (slug: string) => void;
    onBack: () => void;
}

const HammeredPage: React.FC<HammeredPageProps> = ({ onReadPost, onBack }) => {
    const [posts, setPosts] = useState<NewsletterPost[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setPosts(newsletterService.getPublishedPosts());
    }, []);

    const featuredPost = posts.length > 0 ? posts[0] : null;
    const otherPosts = posts.slice(1).filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#0a0a0a] text-white pt-24 pb-20 px-6 md:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#2238ff] blur-[150px] opacity-20" />

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#2238ff] mb-6">
                        <Mail size={12} /> Weekly Founder Newsletter
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display uppercase italic tracking-tighter leading-none mb-6">
                        Hamm<span className="text-[#2238ff]">ered</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Short. Honest. What we learned building GarthBid. <br className="hidden md:block" />
                        No fluff, just the raw stories from the trenches.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-12 relative z-20 pb-24">

                {/* Featured Post */}
                {featuredPost && (
                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-12 items-center mb-20 group cursor-pointer hover:shadow-[0_20px_60px_-15px_rgba(0,34,255,0.15)] transition-all duration-500" onClick={() => onReadPost(featuredPost.slug)}>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span className="px-3 py-1 bg-black text-white rounded-full">Latest Issue</span>
                                <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(featuredPost.publishedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase italic tracking-tighter text-gray-900 group-hover:text-[#2238ff] transition-colors leading-[0.9]">
                                {featuredPost.title}
                            </h2>

                            <p className="text-lg text-gray-500 leading-relaxed line-clamp-3">
                                {featuredPost.subject}
                            </p>

                            <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-[#2238ff] group-hover:gap-5 transition-all">
                                Read Full Story <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Feature Image or Decorative Element */}
                        <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                            {featuredPost.imageUrl ? (
                                <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 opacity-50" />
                                    <div className="text-9xl font-display italic font-black text-gray-200 select-none">#{(posts.length - posts.indexOf(featuredPost)).toString().padStart(3, '0')}</div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <h3 className="text-2xl font-display uppercase italic tracking-tighter text-gray-900">Archive ({newsletterService.getPublishedPosts().length})</h3>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search past issues..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:w-80 pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-[#2238ff] focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                {otherPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherPosts.map((post, index) => (
                            <div
                                key={post.id}
                                className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-100 flex flex-col"
                                onClick={() => onReadPost(post.slug)}
                            >
                                {post.imageUrl && (
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-200">
                                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}

                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex justify-between">
                                    <span>Issue #{(posts.length - 1 - index).toString().padStart(3, '0')}</span>
                                    <span>{new Date(post.publishedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>

                                <h3 className="text-2xl font-display uppercase italic tracking-tighter text-gray-900 mb-3 group-hover:text-[#2238ff] transition-colors leading-[0.9]">
                                    {post.title}
                                </h3>

                                <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                                    {post.subject}
                                </p>

                                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 group-hover:translate-x-2 transition-transform">
                                    Read <ArrowRight size={14} />
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No other posts found</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default HammeredPage;
