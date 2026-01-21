export const getCommandLabel = (category: string): string => {
    const labels: Record<string, string> = {
        learn: "📚 Learning",
        settings: "⚙️ Configuration",
        dev: "🛠️ Developer",
    };
    
    return labels[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
};

export const getCommandDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
        learn: "Manage your learning journey with topics, sections, pages, and spaced repetition reviews",
        settings: "Customize bot behavior with user preferences and server-wide configurations",
        dev: "Access developer tools for see stats, repositories, and GitHub profiles",
    };
    
    return descriptions[category.toLowerCase()] || `Discover commands in the ${category} category`;
};