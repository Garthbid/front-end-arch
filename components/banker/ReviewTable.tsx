import React from 'react';
import { BankerActionLog, BankerItem, BankerOffer } from './types';
import { Timer, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ReviewTableProps {
    actionLog: BankerActionLog[]; // We probably want a derived "Active/Resolved Items" list instead
    itemsById: Record<string, BankerItem>;
    offersById: Record<string, BankerOffer>;
    isLocked: boolean;
    onEditOffer: (itemId: string) => void;
}

const ReviewTable: React.FC<ReviewTableProps> = ({
    actionLog,
    itemsById,
    offersById,
    isLocked,
    onEditOffer
}) => {
    // We need to dedupe actions to show latest state per item
    // Using reduce to build a map of latest actions for each item
    const latestActionsMap = actionLog.reduce((acc: Record<string, BankerActionLog>, log) => {
        // Assuming actionLog is ordered chronologically (oldest first),
        // this will ensure 'acc[log.itemId]' always holds the latest action for that item.
        acc[log.itemId] = log;
        return acc;
    }, {});

    // Convert the map values back to an array and then map to the desired structure
    const uniqueItems = Object.values(latestActionsMap)
        .map((latestAction: BankerActionLog) => ({
            itemId: latestAction.itemId,
            action: latestAction.action,
            item: itemsById[latestAction.itemId],
            offer: offersById[latestAction.itemId]
        }))
        .reverse(); // Show newest first

    return (
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Your Offer</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {uniqueItems.map(({ itemId, action, item, offer }) => (
                            <tr key={itemId} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img src={item?.thumbUrl} className="w-10 h-10 rounded object-cover bg-slate-200" alt="" />
                                        <div>
                                            <div className="font-bold text-slate-800 line-clamp-1">{item?.title}</div>
                                            <div className="text-xs text-slate-500 font-mono">{itemId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {action === 'pass' && <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12} /> Passed</span>}
                                    {action === 'offer' && <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} /> Offered</span>}
                                    {action === 'needs_info' && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-bold"><AlertCircle size={12} /> Needs Info</span>}
                                    {action === 'custom_offer' && <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle size={12} /> Custom</span>}
                                </td>
                                <td className="px-4 py-3">
                                    {offer ? (
                                        <div className="font-mono text-slate-700">
                                            <span className="font-bold">{offer.apr.toFixed(2)}%</span>
                                            <span className="text-slate-400 mx-1">·</span>
                                            <span>{offer.termMonths}mo</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {!isLocked && (action === 'offer' || action === 'custom_offer') && (
                                        <button
                                            onClick={() => onEditOffer(itemId)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {uniqueItems.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                                    No items reviewed yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewTable;
