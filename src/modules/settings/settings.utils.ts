
const getBooleanLabel = (key: string): string => {
    const labels: Record<string, string> = {
        learningEnabled: "📚 Learning Module",
        pomodoroEnabled: "⏱️ Pomodoro Timer",
        notificationsEnabled: "🔔 Review Notifications",
    };
    return labels[key] || key;
};

const getLanguageLabel = (code: string): string => {
    const labels: Record<string, string> = {
        en: "🇺🇸 English",
        es: "🇪🇸 Español",
        fr: "🇫🇷 Français",
        de: "🇩🇪 Deutsch",
        it: "🇮🇹 Italiano",
        pt: "🇵🇹 Português",
    };
    return labels[code] || code;
};

const getTimezoneLabel = (code: string): string => {
    const labels: Record<string, string> = {
        UTC: "🌍 UTC (Coordinated Universal Time)",
        PST: "🇺🇸 PST (Pacific Standard Time)",
        EST: "🇺🇸 EST (Eastern Standard Time)",
        CET: "🇪🇺 CET (Central European Time)",
        IST: "🇮🇳 IST (India Standard Time)",
        JST: "🇯🇵 JST (Japan Standard Time)",
    };
    return labels[code] || code;
};

export {
    getBooleanLabel,
    getLanguageLabel,
    getTimezoneLabel,
}