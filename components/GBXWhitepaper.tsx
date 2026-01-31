import React from 'react';
import { ArrowLeft, Flame, Coins, Shield, Zap, Globe, Lock, Swords, ScrollText, Trophy, Eye } from 'lucide-react';

interface GBXWhitepaperProps {
    onBack: () => void;
}

const SectionDivider = () => (
    <div className="flex items-center gap-4 my-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <Coins size={14} className="text-slate-300" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </div>
);

const SectionHeader: React.FC<{ number: string; title: string; icon: React.ReactNode }> = ({ number, title, icon }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            {icon}
        </div>
        <div>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Section {number}</span>
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 leading-tight">{title}</h2>
        </div>
    </div>
);

const GBXWhitepaper: React.FC<GBXWhitepaperProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[#faf9f7] pb-24 animate-in fade-in duration-500">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#faf9f7]/80 backdrop-blur-xl border-b border-slate-200/60">
                <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-500" />
                    </button>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auction Rules / Rule 14</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 md:px-8">

                {/* Hero */}
                <div className="pt-12 pb-8 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-lg shadow-orange-500/25 mb-6">
                        <Coins size={36} className="text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight mb-3">
                        The Garthbucks Whitepaper
                    </h1>
                    <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                        How participation becomes risk, and risk becomes the game.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        Fixed Supply: 1,000,000,000 GBX
                    </div>
                </div>

                <SectionDivider />

                {/* Section 1 */}
                <section>
                    <SectionHeader number="1" title="What Are Garthbucks" icon={<Coins size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>Garthbucks (GBX) is a participation token used inside <strong>Garthbid</strong> and the weekly live show <strong>Hammered on Monday</strong>.</p>
                        <div className="space-y-1 text-slate-500 italic">
                            <p>It is not designed to replace money.</p>
                            <p>It is not a promise of returns.</p>
                            <p>It is not a financial product.</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">Garthbucks is a <span className="text-amber-600">risk chip</span>.</p>
                        <div className="space-y-1">
                            <p>You earn it by participating.</p>
                            <p>You risk it publicly.</p>
                            <p>You may win big.</p>
                            <p>You may lose.</p>
                        </div>
                        <p className="font-semibold text-slate-900">That is the game.</p>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 2 */}
                <section>
                    <SectionHeader number="2" title="Why Garthbucks Exists" icon={<Zap size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>Garthbucks exists to reward the users who actually build Garthbid.</p>
                        <p>Garthbid generates revenue through marketplace commissions, subscriptions, and sponsorships. After covering operational costs, roughly <strong>10% of net profit</strong> is allocated to fund real prizes on the weekly live show <strong>Hammered on Monday</strong>. Those prizes are then auctioned exclusively using Garthbucks.</p>
                        <p>As Garthbid grows and profits increase, the prize pool grows with it.</p>
                        <p>This creates a simple, ongoing game:</p>
                        <ul className="space-y-2">
                            {['Earn Garthbucks by contributing to the platform', 'Decide whether to spend them now or hold for bigger prizes later', 'Accept the risk that holding may be rewarded — or that opportunity may pass'].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p>At the same time, Garthbucks is subject to long-term scarcity.</p>
                        <p>Each week during the Furnace Era, supply is permanently reduced through burning. The final circulating supply will not be known until the Furnace Era ends after 1,000 weeks.</p>
                        <p>Unlike Bitcoin, where total supply is known in advance, Garthbucks reveals its true scarcity only over time through participation and restraint.</p>
                        <p className="font-semibold text-slate-900">The goal is simple:</p>
                        <p>Create a meme coin for the people who helped build Garthbid.</p>
                        <p className="text-slate-500 italic">What happens after that is unknown.</p>
                        <p>The rules are locked. The incentives are locked. The game begins now.</p>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 3 */}
                <section>
                    <SectionHeader number="3" title="Hammered on Monday" icon={<Swords size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>Every Monday, Garthbid runs a live show called <strong>Hammered on Monday</strong>.</p>
                        <div className="space-y-1">
                            <p>It is part auction.</p>
                            <p>Part comedy.</p>
                            <p>Part chaos.</p>
                        </div>
                        <p>Real prizes are auctioned:</p>
                        <ul className="space-y-2">
                            {['Cars', 'Equipment', 'Experiences', 'Ridiculous surprises'].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="font-semibold text-slate-900">Only Garthbucks can be used to bid.</p>
                        <blockquote className="border-l-4 border-amber-400 pl-4 py-2 bg-amber-50/50 rounded-r-xl text-slate-600 italic">
                            Do I hold my Garthbucks, or do I risk them tonight?
                        </blockquote>
                        <div className="space-y-1 text-slate-500">
                            <p>There are no guarantees.</p>
                            <p>No safety nets.</p>
                            <p>No refunds.</p>
                        </div>
                        <p className="font-semibold text-slate-900">Just risk.</p>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 4 */}
                <section>
                    <SectionHeader number="4" title="Supply & Issuance" icon={<Lock size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>Garthbucks has a <strong>fixed maximum supply</strong>.</p>
                        <div className="flex flex-col sm:flex-row gap-3 my-4">
                            <div className="flex-1 p-4 rounded-xl bg-slate-900 text-center">
                                <p className="text-2xl font-bold text-white">1,000,000,000</p>
                                <p className="text-xs font-semibold text-slate-400 mt-1">Total GBX Supply</p>
                            </div>
                            <div className="flex-1 p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                                <p className="text-2xl font-bold text-amber-700">1,000,000</p>
                                <p className="text-xs font-semibold text-amber-500 mt-1">Weekly Pool</p>
                            </div>
                        </div>
                        <p>Supply can never increase.</p>

                        <h3 className="font-bold text-slate-900 pt-2">Weekly Release Mechanism (Rigid)</h3>
                        <p>All <strong>1,000,000,000 GBX already exist</strong> from the initial mint and sit in a treasury wallet. No new Garthbucks are ever created after day one.</p>
                        <p>Each week, a <strong>fixed pool of up to 1,000,000 GBX</strong> is allocated for user rewards.</p>

                        <h4 className="font-semibold text-slate-800">How weekly rewards work</h4>
                        <ul className="space-y-2 text-slate-600">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                User actions generate <strong>pending GBX</strong> throughout the week
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                Pending GBX is <em>not final</em> until the week closes
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                The system never runs out mid-week
                            </li>
                        </ul>

                        <p>At weekly close:</p>
                        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <p className="text-sm">If total pending GBX <strong>≤ 1,000,000</strong> → all users receive <strong className="text-green-600">100%</strong> of their pending amount</p>
                            <p className="text-sm">If total pending GBX <strong>&gt; 1,000,000</strong> → all users are <strong className="text-amber-600">scaled proportionally</strong> so the total paid equals exactly 1,000,000</p>
                        </div>
                        <p>Any portion of the weekly pool that is not paid out is <strong>permanently burned</strong>.</p>

                        <div className="p-4 rounded-xl bg-green-50 border border-green-200 space-y-1 text-sm text-green-800">
                            <p>No first-mover advantage.</p>
                            <p>No late-user penalty.</p>
                            <p>No mid-week shutoffs.</p>
                            <p>No discretionary intervention.</p>
                        </div>

                        <h3 className="font-bold text-slate-900 pt-2">Weekly Burn Events (Furnace Era)</h3>
                        <p>Each week during the Furnace Era includes up to <strong>two independent burn events</strong>:</p>
                        <ol className="space-y-2 text-slate-600">
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-amber-500 flex-shrink-0">1.</span>
                                <span><strong>Unclaimed pool burn</strong> — unused portion of the 1,000,000 GBX weekly allocation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-bold text-amber-500 flex-shrink-0">2.</span>
                                <span><strong>Prize-spend burn</strong> — all GBX used to win prizes during that week</span>
                            </li>
                        </ol>
                        <p>Both burns are executed on-chain using a public, provably unspendable burn address.</p>

                        <h3 className="font-bold text-slate-900 pt-2">Furnace Era Duration</h3>
                        <div className="flex flex-col sm:flex-row gap-3 my-4">
                            <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-center">
                                <p className="text-2xl font-bold text-white">1,000</p>
                                <p className="text-xs font-semibold text-orange-200 mt-1">Total Weeks</p>
                            </div>
                            <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-center">
                                <p className="text-2xl font-bold text-white">~19.2</p>
                                <p className="text-xs font-semibold text-orange-200 mt-1">Years</p>
                            </div>
                        </div>
                        <p>Each week consumes up to 1,000,000 GBX from the treasury via distribution to users and immediate burning of any unpaid allocation.</p>
                        <p>When the treasury balance reaches zero, <strong>weekly releases end automatically and permanently</strong>.</p>
                        <p className="text-slate-500 italic">No extensions. No resets. No discretion.</p>
                        <p>At that point, the Furnace Era is complete and the Arena Era begins.</p>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 5 */}
                <section>
                    <SectionHeader number="5" title="The Furnace Era (Earning Phase)" icon={<Flame size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>During the early years:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                                Users earn Garthbucks through participation
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                                Garthbucks used to win prizes are <strong>burned</strong>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                                Burned Garthbucks are permanently destroyed
                            </li>
                        </ul>
                        <p>This creates natural scarcity.</p>
                        <p>Every decision matters:</p>
                        <div className="space-y-1">
                            <p>Spend now for glory.</p>
                            <p>Or hold and survive scarcity.</p>
                        </div>
                        <div className="space-y-1 text-slate-500">
                            <p>No one is told what to do.</p>
                            <p>The system lets behavior decide.</p>
                        </div>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 6 */}
                <section>
                    <SectionHeader number="6" title="The Arena Era (Post-Issuance)" icon={<Swords size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>When issuance ends:</p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                No new Garthbucks are created
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                Total supply is fixed forever
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                Hammered on Monday continues
                            </li>
                        </ul>
                        <p>Garthbucks used in the Arena are <strong>recycled</strong>, not burned.</p>
                        <p>The economy becomes self-sustaining:</p>
                        <div className="space-y-1">
                            <p>Garthbucks circulate.</p>
                            <p>Participation continues.</p>
                            <p>Prizes continue.</p>
                        </div>
                        <p>Garthbucks no longer bootstraps growth.<br />It gates access to the Arena.</p>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 7 */}
                <section>
                    <SectionHeader number="7" title="Ownership & Control" icon={<Shield size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                            <p className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Garth Studios holds <strong>no reserved Garthbucks</strong></p>
                            <p className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Garth Studios does not sell Garthbucks</p>
                            <p className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> Garth Studios cannot mint new Garthbucks</p>
                        </div>
                        <p>The community owns the chips.<br />Garth Studios runs the Arena.</p>
                        <p>The platform monetizes through:</p>
                        <ul className="space-y-2">
                            {['Marketplace services', 'Media', 'Sponsorships', 'Optional transaction fees'].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="font-semibold text-slate-900">Never through supply manipulation.</p>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 8 */}
                <section>
                    <SectionHeader number="8" title="What Garthbucks Is Not" icon={<Shield size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>Garthbucks is not:</p>
                        <div className="space-y-2 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800">
                            {['A promise of profit', 'A stablecoin', 'A security', 'A savings account', 'A guaranteed giveaway'].map((item) => (
                                <p key={item} className="flex items-center gap-2">
                                    <span className="text-red-400 font-bold">✕</span> {item}
                                </p>
                            ))}
                        </div>
                        <p className="text-lg font-semibold text-slate-900">It is risk.</p>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 9 */}
                <section>
                    <SectionHeader number="9" title="The Core Rule" icon={<Lock size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p className="text-xl font-bold text-slate-900">Total supply is fixed.</p>
                        <p>Burning and recycling change circulation, not ownership.</p>
                        <div className="space-y-1 text-slate-500">
                            <p>The rules are simple.</p>
                            <p>They do not change.</p>
                        </div>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 10 */}
                <section>
                    <SectionHeader number="10" title="Blockchain Implementation & Decentralization Path" icon={<Globe size={20} />} />
                    <div className="space-y-6 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>Garthbucks is issued on the <strong>Cardano blockchain</strong> with a fixed supply and an immutable monetary policy.</p>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">10.1 One-Time Mint</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    Exactly <strong>1,000,000,000 GBX</strong> are minted in a single on-chain event
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    The minting policy is permanently locked
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    No additional Garthbucks can ever be created
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    All future behavior involves only distribution, burning, or circulation
                                </li>
                            </ul>
                            <p className="mt-2">This ensures absolute supply integrity from day one.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">10.2 Early-Stage Centralized Distribution</h3>
                            <p className="mb-2">In the early Furnace Era:</p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    Garth Studios controls a treasury wallet
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    Weekly issuance is handled off-chain by platform logic
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    Users earn Garthbucks through participation
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    Earned Garthbucks are transferred from the treasury to users
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2" />
                                    Unissued Garthbucks never move and effectively never exist
                                </li>
                            </ul>
                            <p className="mt-3 text-slate-500 italic">Centralization at this stage is intentional and temporary.<br />It prioritizes simplicity, safety, and onboarding.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">10.3 Burning Mechanics (Furnace Era)</h3>
                            <p className="mb-2">During the earning phase:</p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                                    Garthbucks used to win prizes are sent to a <strong>public, provably unspendable burn address</strong>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                                    Burn transactions are visible on-chain
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-2" />
                                    Burned Garthbucks are permanently destroyed
                                </li>
                            </ul>
                            <p className="mt-3">Burning is not a penalty.<br />It is the mechanism that forges scarcity and rewards restraint over time.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">10.4 Optional Self-Custody</h3>
                            <p className="mb-2">At any point, users may choose to:</p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                    Withdraw their Garthbucks to a personal Cardano wallet
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                    Hold independently of the platform
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                    Never interact with exchanges or DeFi
                                </li>
                            </ul>
                            <p className="mt-3 text-slate-500 italic">Self-custody is optional, not required.<br />Garthbucks is designed for everyday users first.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">10.5 Arena Era Transition</h3>
                            <p className="mb-2">When the issuance period ends:</p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                    No new Garthbucks are issued
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                    Burning permanently stops
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                    Garthbucks spent in the Arena are <strong>recycled</strong> back into the platform
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                                    Recycled Garthbucks are redistributed as participation rewards
                                </li>
                            </ul>
                            <p className="mt-3">Total supply remains fixed forever.<br />Only circulation changes.</p>
                            <p className="text-slate-500 italic">This transition is pre-declared and irreversible.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">10.6 Full Decentralization End State</h3>
                            <p className="mb-2">Over time:</p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 mt-2" />
                                    The majority of Garthbucks migrate to user custody
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 mt-2" />
                                    Garth Studios no longer controls supply
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 mt-2" />
                                    The platform may charge optional transaction or participation fees
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 mt-2" />
                                    Hammered on Monday continues as a cultural and entertainment institution
                                </li>
                            </ul>
                            <p className="mt-3 font-semibold text-slate-900">Garth Studios runs the Arena.<br />The community owns the chips.</p>
                        </div>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 12 — Leaderboard & Identity */}
                <section>
                    <SectionHeader number="12" title="Leaderboard & Identity" icon={<Trophy size={20} />} />
                    <div className="space-y-6 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <div className="space-y-4">
                            <p>The Garthbucks leaderboard is public.</p>
                            <p>Total holdings are visible. Wallet activity is visible. This transparency is intentional — it creates the social dynamics that make the game interesting.</p>
                            <p className="font-semibold text-slate-900">But identity is private by default.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">12.1 Pseudonymous by Design</h3>
                            <p className="mb-3">Every user appears on the leaderboard as a wallet identifier. No names. No profiles. No personal information.</p>
                            <p className="mb-3">Garth Studios does not track or store wallet-to-identity mappings. We cannot reveal who holds what because we do not know.</p>
                            <p className="mb-2">This protects users from:</p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-2" />
                                    Unwanted attention as holdings grow in value
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-2" />
                                    Social pressure or manipulation from other participants
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-2" />
                                    Security risks associated with visible wealth
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">12.2 Optional Public Identity</h3>
                            <p className="mb-3">Users may choose to attach a display name to their leaderboard position.</p>
                            <p className="mb-3">This is entirely voluntary. Users who want recognition — streamers, personalities, competitive bidders — can opt into visibility. Those who prefer anonymity keep it.</p>
                            <p>Users can return to pseudonymous status at any time.</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">12.3 The Ghosts</h3>
                            <p className="mb-3">Some wallets will go silent. No bids. No movement. No identity. Just a number on the leaderboard, frozen in place.</p>
                            <p className="mb-3 text-slate-500 italic">Whether they are patient, lost, or gone — no one will know.</p>
                            <p className="font-semibold text-slate-900">This is not a bug. It is the game.</p>
                        </div>
                    </div>
                </section>

                <SectionDivider />

                {/* Section 13 — Final Statement */}
                <section>
                    <SectionHeader number="13" title="Final Statement" icon={<ScrollText size={20} />} />
                    <div className="space-y-4 text-base text-slate-700 leading-relaxed pl-[3.25rem]">
                        <p>Garthbucks rewards participation early.<br />It rewards restraint over time.</p>
                        <div className="space-y-1">
                            <p>Some will spend everything.</p>
                            <p>Some will hold.</p>
                            <p>Some will regret it.</p>
                        </div>
                        <p className="font-semibold text-slate-900">That is the design.</p>
                        <p>Garthbucks is not about safety.<br />It is about choice.</p>
                        <p>All Garthbucks were created on day one.<br />Everything after that is distribution, burning, or movement — never creation.</p>
                    </div>
                </section>

                {/* Final CTA */}
                <div className="mt-16 mb-8 text-center">
                    <div className="inline-block px-8 py-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
                        <p className="text-2xl md:text-3xl font-display font-black text-white tracking-tight">
                            Welcome to the Arena.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GBXWhitepaper;
