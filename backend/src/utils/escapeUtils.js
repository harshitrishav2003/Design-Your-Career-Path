// Common helper: escape special LaTeX chars
export function escapeLatexSpecialChars(input) {
    if (input && typeof input === "string") {
        return input.replace(/([#%\\^&_\${}~])/g, "\\$1");
    }
    return input;
}

// Improved function to handle HTML bullet points and convert to LaTeX format
export function splitDescription(desc) {
    if (!desc || typeof desc !== "string") {
        return [];
    }
    
    // First, handle HTML bullet points (ul/li tags)
    let processedDesc = desc
        .replace(/<ul[^>]*>/gi, '')  // Remove opening ul tags
        .replace(/<\/ul>/gi, '')      // Remove closing ul tags
        .replace(/<ol[^>]*>/gi, '')   // Remove opening ol tags
        .replace(/<\/ol>/gi, '')      // Remove closing ol tags
        .replace(/<li[^>]*>/gi, '• ') // Convert li tags to bullet points
        .replace(/<\/li>/gi, '\n')    // Replace closing li with newline
        .replace(/<br\s*\/?>/gi, '\n') // Convert br tags to newlines
        .replace(/<[^>]+>/g, "")      // Remove any remaining HTML tags
        .trim();
    
    // Split by newlines and filter out empty lines
    return processedDesc
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
}
