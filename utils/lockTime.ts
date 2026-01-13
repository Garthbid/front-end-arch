export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60 * ONE_SECOND;
export const ONE_HOUR = 60 * ONE_MINUTE;

// Configurable override via URL search params (e.g. ?lock=1 or ?unlock=1)
const getUrlParam = (key: string) => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
};

/**
 * Returns the next Monday at 12:00 PM (Noon) in local time (or specific timezone if needed).
 * For MVP we assume the user's browser time matches the target market (America/Edmonton) 
 * or we just use local system time to keep it simple as requested.
 */
export function getNextMondayNoon(now: Date = new Date()): Date {
    const result = new Date(now);
    const day = result.getDay(); // 0 = Sun, 1 = Mon, ...

    // Calculate days until next Monday
    // If today is Monday and it's before noon, we could say "today is the deadline"?
    // But usually "Next Monday" means the upcoming one.
    // The Prompt says: "Locks Monday 12:00 PM".
    // Let's assume weekly cycle. If it's Monday 1PM, the lock is active for THIS week, until reset?
    // Let's simplified: Lock target is the *upcoming* Monday Noon.

    let daysUntilMonday = (1 + 7 - day) % 7;
    if (daysUntilMonday === 0 && result.getHours() >= 12) {
        // It's Monday afternoon, so next deadline is next week
        daysUntilMonday = 7;
    }

    result.setDate(result.getDate() + daysUntilMonday);
    result.setHours(12, 0, 0, 0);
    return result;
}

export function isLocked(now: Date = new Date()): boolean {
    const forcedLock = getUrlParam('lock');
    const forcedUnlock = getUrlParam('unlock');

    if (forcedLock === '1') return true;
    if (forcedUnlock === '1') return false;

    // Real logic:
    // If we are on Monday between 12:00 PM and say... Tuesday?
    // User prompted: "At lock time, disable all offer-changing actions... Lock time is Monday 12:00 PM local time"
    // Implicitly, there is a "Review Period" before the lock.
    // So if it's Monday 12:01 PM, it is LOCKED.
    // If it is Monday 11:59 AM, it is UNLOCKED.

    // For the sake of the demo, let's treat the "Deadline" as the lock point.
    // If we are currently PAST the deadline for this week? 
    // This is tricky without a "cycle start" concept.

    // Simpler approach for demo:
    // Just countdown to the *next* Monday Noon.
    // BUT, if we want to show "Locked" state, we need to simulate being *after* the deadline.
    // So `isLocked` is physically impossible unless we simulate time travel or a specific window.

    // Let's refine: The "Live Cycle" ends Monday Noon.
    // So if today is Monday > 12:00, it is locked until... when? Tuesday?
    // Let's stick to the URL overrides for testing "Locked State" mostly,
    // Or if today is Monday > 12:00 PM.

    const day = now.getDay();
    const hours = now.getHours();

    // Lock window: Monday 12:00 PM to Monday 11:59 PM (just for the day)
    if (day === 1 && hours >= 12) {
        return true;
    }

    return false;
}

export function formatCountdown(ms: number): string {
    if (ms <= 0) return '00:00:00';

    const h = Math.floor(ms / ONE_HOUR);
    const m = Math.floor((ms % ONE_HOUR) / ONE_MINUTE);
    const s = Math.floor((ms % ONE_MINUTE) / ONE_SECOND);

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
