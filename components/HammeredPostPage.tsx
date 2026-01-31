import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Share2, Check } from 'lucide-react';
import { newsletterService, NewsletterPost } from '../services/NewsletterService';
import { COLORS } from '../constants';

interface HammeredPostPageProps {
    slug: string;
    onBack: () => void;
}

const HammeredPostPage: React.FC<HammeredPostPageProps> = ({ slug, onBack }) => {
    const [post, setPost] = useState<NewsletterPost | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const foundPost = newsletterService.getPostBySlug(slug);
        if (foundPost) {
            setPost(foundPost);
            document.title = `Hammered — ${foundPost.title}`;
        }

        // Cleanup title
        return () => {
            document.title = 'GarthBid';
        };
    }, [slug]);

    const handleShare = () => {
        // In a real router, this would be the actual URL. 
        // Here we'll mock it or construct valid URL if we had real routing
        const url = window.location.origin + '/hammered/' + slug;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-3xl font-display uppercase italic text-gray-900 mb-4">Post Not Found</h2>
                <button onClick={onBack} className="text-[#2238ff] font-bold underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24">

            {/* Article Header */}
            <div className="max-w-3xl mx-auto pt-16 md:pt-24 px-6 md:px-0">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold uppercase tracking-widest text-xs mb-12 transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Newsletter
                </button>

                {/* Cover Image */}
                {post.imageUrl && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-gray-100 shadow-sm border border-gray-100">
                        <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-black text-white text-[10px] uppercase tracking-widest font-black rounded-full">
                        Founder Letter
                    </span>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(post.publishedAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-display uppercase italic font-black text-gray-900 leading-[0.9] mb-8">
                    {post.title}
                </h1>

                <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed border-l-4 border-[#2238ff] pl-6 mb-12">
                    {post.subject}
                </p>

                <hr className="border-gray-100 mb-12" />
            </div>

            {/* Article Body */}
            <article className="max-w-3xl mx-auto px-6 md:px-0 prose prose-lg prose-headings:font-display prose-headings:uppercase prose-headings:italic prose-a:text-[#2238ff] prose-img:rounded-3xl">
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: post.body }} />
            </article>

            {/* Footer / Share */}
            <div className="max-w-3xl mx-auto px-6 md:px-0 mt-24">
                <div className="bg-gray-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
                    <div>
                        <h3 className="font-display text-2xl uppercase italic text-gray-900">Share this story</h3>
                        <p className="text-gray-500 text-sm font-medium">Help us spread the word about building in public.</p>
                    </div>

                    <button
                        onClick={handleShare}
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                        {copied ? 'Copied Link' : 'Copy Link'}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default HammeredPostPage;
