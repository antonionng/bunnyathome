/**
 * Extracts the first name from a full name string
 * Handles various edge cases and name formats
 */
export function extractFirstName(fullName: string | null | undefined): string {
  // Return default if no name provided
  if (!fullName || fullName.trim() === "") {
    return "friend";
  }

  // Clean up the name
  const cleaned = fullName.trim();

  // Handle single name (just first name provided)
  const nameParts = cleaned.split(/\s+/);
  if (nameParts.length === 1) {
    return capitalize(nameParts[0]);
  }

  // Handle titles (Mr., Mrs., Dr., etc.)
  const titles = ["mr", "mrs", "ms", "miss", "dr", "prof", "sir", "dame"];
  let firstNameIndex = 0;

  if (titles.includes(nameParts[0].toLowerCase().replace(".", ""))) {
    firstNameIndex = 1;
  }

  // Return the first name (after title if present)
  if (nameParts[firstNameIndex]) {
    return capitalize(nameParts[firstNameIndex]);
  }

  return "friend";
}

/**
 * Capitalizes the first letter of a string
 */
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Gets initials from a full name (max 2 characters)
 * Used for avatar fallbacks
 */
export function getInitials(fullName: string | null | undefined): string {
  if (!fullName || fullName.trim() === "") {
    return "??";
  }

  const cleaned = fullName.trim();
  const nameParts = cleaned.split(/\s+/);

  if (nameParts.length === 1) {
    // Single name - use first two letters
    return cleaned.substring(0, 2).toUpperCase();
  }

  // Multiple names - use first letter of first and last name
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  
  return firstInitial + lastInitial;
}

/**
 * Validates if a name seems reasonable
 */
export function isValidName(name: string | null | undefined): boolean {
  if (!name || name.trim() === "") {
    return false;
  }

  const cleaned = name.trim();

  // Check minimum length
  if (cleaned.length < 2) {
    return false;
  }

  // Check for only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(cleaned)) {
    return false;
  }

  return true;
}

