import React from 'react';
import { ArrowLeft, ShieldCheck, Scale, AlertTriangle, Clock, CreditCard, Truck, UserX, AlertOctagon, Ban, FileText, Gavel, BookOpen } from 'lucide-react';
import { COLORS } from '../constants';

interface AuctionRulesProps {
    onBack: () => void;
}

const AuctionRules: React.FC<AuctionRulesProps> = ({ onBack }) => {
    const rules = [
        {
            id: 1,
            title: "Fee Structure & Settlement",
            icon: CreditCard,
            content: (
                <div className="space-y-4">
                    <p>Garthbid charges a 5% platform fee on completed transactions.</p>
                    <div className="pl-4 border-l-2 border-gray-100">
                        <p className="font-medium mb-2">This fee funds end-to-end auction management, including:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Demand generation and marketing</li>
                            <li>Buyer verification and enforcement</li>
                            <li>Dispute handling and outcome protection</li>
                            <li>Secure settlement and transaction coordination</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payments & Settlement</h4>
                        <p>All auction payments are processed through Garthbid Settlement Trust to ensure safe, verified completion of each transaction.</p>
                        <p className="mt-2 text-sm text-gray-500">Accepted payment methods include:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 mt-1">
                            <li>Interac e-Transfer</li>
                            <li>Bank draft or bank deposit</li>
                            <li>Wire transfer</li>
                        </ul>
                    </div>
                    <p>Garthbid manages the transaction from auction close through settlement and works to ensure sellers are paid promptly once payment is confirmed.</p>
                    <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm font-medium">
                        Platform fees apply only to completed transactions. No fee is charged if an auction does not successfully close.
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Auction Finality",
            icon: Gavel,
            content: (
                <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>All bids are binding.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Bids cannot be retracted once placed.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Auctions close at the listed end time.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>The highest valid bid wins.</span>
                    </li>
                </ul>
            )
        },
        {
            id: 3,
            title: "Buyer Protection & Seller Integrity",
            icon: ShieldCheck,
            content: (
                <div className="space-y-4">
                    <p>Garthbid is not an “as-is, where-is” marketplace. We prioritize buyer protection and require sellers to list items honestly and accurately.</p>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">If a buyer believes a listing was dishonest or materially misrepresented:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                            <li>The buyer may walk away by paying a walk-away fee equal to 10% of the final bid or $250 (whichever is lower).</li>
                            <li>The buyer is released from the transaction with no further obligation.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">If the seller disputes the claim:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                            <li>The walk-away fee will be used to market the seller’s item in the following Monday auction.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">If a seller receives multiple dishonesty claims:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                            <li>Garthbid may investigate and suspend or remove the seller from the platform.</li>
                        </ul>
                    </div>

                    <p className="font-medium text-gray-900">Seller honesty and accurate disclosure are mandatory.</p>
                </div>
            )
        },
        {
            id: 4,
            title: "Disclosure Standard",
            icon: FileText,
            content: (
                <div className="space-y-3">
                    <p>Sellers must disclose all known material defects, damage, liens, or issues that would reasonably affect value or use.</p>
                    <p className="text-gray-600">Normal wear consistent with age does not require disclosure unless it materially affects functionality.</p>
                </div>
            )
        },
        {
            id: 5,
            title: "Payment Timeline & Confirmation",
            icon: Clock,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">After an auction closes:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>The buyer has 72 hours to complete payment.</li>
                            <li>Both buyer and seller must confirm payment in the Billing section of their profiles.</li>
                            <li>A transaction is considered complete only when both parties mark the item as paid.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Dispute Handling</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>If the buyer marks the item as paid but the seller does not, the transaction is sent to the Garthbid Dispute Centre.</li>
                            <li>Garthbid will contact the seller and review whether payment was received.</li>
                            <li>No walk-away fee is triggered during this review.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Failed Transactions</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>If neither party confirms payment within 72 hours, the transaction is considered failed.</li>
                            <li>A non-refundable walk-away fee equal to 10% of the final bid or $250 (whichever is lower) is applied.</li>
                            <li>The buyer is released from the obligation to complete the purchase.</li>
                        </ul>
                    </div>

                    <div className="bg-orange-50 text-orange-800 px-4 py-3 rounded-lg text-sm font-medium">
                        Both parties are responsible for completing and confirming payment within the 72-hour window.
                    </div>
                </div>
            )
        },
        {
            id: 6,
            title: "Pickup Deadline",
            icon: Truck,
            content: (
                <div className="space-y-3">
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Items must be picked up within 7 days of the auction closing.</li>
                        <li>Pickup coordination is the responsibility of both buyer and seller after payment.</li>
                        <li>If pickup does not occur within 7 days, the seller may apply reasonable storage fees, communicated directly to the buyer.</li>
                        <li>Any extensions or alternate arrangements are private agreements between buyer and seller.</li>
                    </ul>
                    <p className="text-sm font-medium text-gray-500">Garthbid does not store items and does not manage pickup or storage logistics.</p>
                </div>
            )
        },
        {
            id: 7,
            title: "No-Show & Abandoned Item Policy",
            icon: UserX,
            content: (
                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Buyer No-Show or Non-Payment</h4>
                        <p className="mb-2 text-gray-600">If a buyer wins an auction but fails to pay or complete the transaction within 72 hours:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>The transaction is cancelled.</li>
                            <li>A non-refundable walk-away fee equal to 10% of the final bid or $250 (whichever is lower) is applied.</li>
                            <li>The buyer has no further rights or obligations to the item.</li>
                        </ul>

                        <div className="mt-3 pl-4 border-l-2 border-gray-100">
                            <p className="font-medium text-gray-900 mb-1">Seller Support</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                <li>The Garthbid team will contact the seller to review what occurred.</li>
                                <li>In most cases, the walk-away fee will be used to remarket the item in the following Monday auction.</li>
                                <li>If the buyer files a dishonesty claim:
                                    <ul className="pl-6 list-[circle] mt-1 space-y-1">
                                        <li>The item will still be remarketed once.</li>
                                        <li>A second dishonesty claim against the same seller may result in suspension or removal.</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Seller No-Show or Non-Responsiveness</h4>
                        <p className="mb-2 text-gray-600">If a buyer completes payment but the seller fails to respond, arrange pickup, or release the item:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>The seller is in breach of the unreserved sale agreement.</li>
                            <li>Garthbid may assist the buyer by:
                                <ul className="pl-6 list-[circle] mt-1 space-y-1">
                                    <li>Contacting the seller</li>
                                    <li>Documenting the completed transaction</li>
                                    <li>Providing written confirmation of purchase rights</li>
                                </ul>
                            </li>
                        </ul>
                        <p className="mt-2 text-sm font-medium text-gray-500">Garthbid does not enforce physical possession but may take platform-level action, including suspension or removal.</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Seller Remorse (Unreserved Auctions)</h4>
                        <p className="mb-2 font-medium text-gray-900">Unreserved auctions carry risk.</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Sellers are provided with pricing insights, data, and marketing analysis prior to listing.</li>
                            <li>Final prices may vary due to market conditions and bidder behavior.</li>
                            <li>Once an auction closes, the seller is legally obligated to complete the sale.</li>
                        </ul>
                        <p className="mt-3 bg-red-50 text-red-800 px-3 py-2 rounded text-sm font-medium inline-block">Seller remorse is not grounds to cancel a completed auction.</p>
                    </div>
                </div>
            )
        },
        {
            id: 8,
            title: "Self-Bidding & Bid Manipulation",
            icon: AlertTriangle,
            content: (
                <div className="space-y-4">
                    <p>Self-bidding, shill bidding, or any attempt to artificially inflate bids is strictly prohibited.</p>
                    <p className="text-gray-600">Garthbid uses automated systems, behavioral analysis, and industry-standard detection methods to identify bid manipulation, including activity involving related accounts.</p>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">If suspicious activity is detected:</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Garthbid may place a temporary $250 enforcement hold on the account.</li>
                            <li>The user may be asked to provide identity verification.</li>
                            <li>If cleared, the hold is fully refunded.</li>
                            <li>If confirmed, Garthbid may cancel bids, suspend accounts, or permanently remove users.</li>
                        </ul>
                    </div>

                    <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                        <AlertOctagon size={16} />
                        Bid manipulation—direct or indirect—is a serious violation.
                    </div>
                </div>
            )
        },
        {
            id: 9,
            title: "Prohibited Items",
            icon: Ban,
            content: (
                <div className="space-y-3">
                    <p>Listings that violate local, provincial, federal, or international law are prohibited.</p>
                    <p className="text-gray-600">Garthbid may remove listings involving illegal, stolen, unsafe, or restricted items at any time.</p>
                </div>
            )
        },
        {
            id: 10,
            title: "Taxes, Title & Registration",
            icon: FileText,
            content: (
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Buyers are responsible for all applicable taxes, registration, title transfer, and compliance requirements unless otherwise agreed directly with the seller.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Sellers are responsible for having the legal right to sell the item.</span>
                    </li>
                </ul>
            )
        },
        {
            id: 11,
            title: "Technical Issues",
            icon: AlertOctagon,
            content: (
                <div className="space-y-3">
                    <p className="text-gray-600">Garthbid is not liable for failed bids, delays, or transaction issues caused by technical errors, outages, or system interruptions.</p>
                    <p className="text-gray-600">In the event of a material platform error, Garthbid may cancel, pause, or relist an auction at its discretion.</p>
                </div>
            )
        },
        {
            id: 12,
            title: "Platform Authority & Final Decisions",
            icon: Scale,
            content: (
                <div className="space-y-4">
                    <p>Garthbid reserves the right to review, investigate, and make final determinations on all disputes, transactions, and rule interpretations.</p>

                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Garthbid may request documentation, messages, or payment confirmations.</li>
                        <li>Garthbid may issue warnings, restrict features, suspend accounts, or permanently remove users at its sole discretion.</li>
                    </ul>

                    <p className="text-sm font-medium text-gray-500 italic">Garthbid is a marketplace facilitator and does not act as an escrow agent, broker, or insurer, but retains full authority to enforce platform rules.</p>
                </div>
            )
        },
        {
            id: 13,
            title: "Rule Updates",
            icon: BookOpen,
            content: (
                <div className="space-y-2">
                    <p>Garthbid may update these rules from time to time.</p>
                    <p className="text-gray-600">Continued use of the platform constitutes acceptance of the current rules.</p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-xl font-display font-semibold text-gray-900">Auction Rules</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                {/* Intro Card */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-6">
                        <Scale size={32} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                        Fair play makes a great marketplace.
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        These rules ensure transparency, integrity, and trust for everyone on Garthbid.
                        Detailed below are the terms governing fees, conduct, and transaction handling.
                    </p>
                </div>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {rules.map((rule) => (
                        <div
                            key={rule.id}
                            className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600">
                                            <rule.icon size={20} />
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rule {rule.id}</span>
                                            <h3 className="text-xl font-display font-semibold text-gray-900">{rule.title}</h3>
                                        </div>
                                        <div className="text-base text-gray-800 leading-relaxed">
                                            {rule.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="text-center pt-8 pb-12">
                    <p className="text-gray-400 text-sm">
                        Last updated: January 2026
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AuctionRules;
