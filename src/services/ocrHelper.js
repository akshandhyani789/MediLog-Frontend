/**
 * Extract medicine data from raw OCR text
 * @param {string} text - Raw OCR text from image
 * @returns {object} Extracted medicine data
 */
export const extractMedicineData = (text) => {
  if (!text || typeof text !== "string") {
    return { name: "", brand: "", dosage: "" };
  }

  // Clean text: remove special characters, extra spaces
  const cleanedText = text
    .replace(/[^\w\s\-/()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanedText.split(" ").filter((w) => w.length > 0);

  // 💊 EXTRACT DOSAGE using regex
  // Matches: "500mg", "10 ml", "250 mg", "1.5g", etc.
  const dosageMatch = cleanedText.match(/(\d+(?:\.\d+)?)\s*(mg|ml|g|gr|mcg|ug)/i);
  const dosage = dosageMatch ? `${dosageMatch[1]}${dosageMatch[2]}` : "";

  // 📝 EXTRACT NAME - first meaningful word (non-numeric, >2 chars)
  const name = words
    .find((w) => w.length > 2 && !/^\d+/.test(w))
    ?.toLowerCase() || "";

  // 🏷️ EXTRACT BRAND - uppercase word OR second word
  let brand = "";

  // Look for uppercase words (likely brand names)
  const uppercaseWord = words.find((w) => /^[A-Z]/.test(w) && w.length > 2);
  if (uppercaseWord) {
    brand = uppercaseWord;
  } else if (words.length > 1) {
    // Fallback: use second word
    brand = words[1]?.toLowerCase() || "";
  }

  return {
    name: name.charAt(0).toUpperCase() + name.slice(1),
    brand: brand.charAt(0).toUpperCase() + brand.slice(1),
    dosage,
  };
};
