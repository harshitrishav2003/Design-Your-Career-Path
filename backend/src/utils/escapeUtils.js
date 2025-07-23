// Common helper: escape special LaTeX chars
export function escapeLatexSpecialChars(input) {
    if (input && typeof input === "string") {
        return input.replace(/([#%\\^&_\${}~])/g, "\\$1");
    }
    return input;
}

// Optional: If you want reusable description splitter
export function splitDescription(desc) {
    return desc
        .replace(/<[^>]+>/g, "")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
}
