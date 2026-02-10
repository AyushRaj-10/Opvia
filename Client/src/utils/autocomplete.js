export function getSuggestions(list, input) {
  if (!input || !input.trim()) return [];

  const trimmedInput = input.trim().toLowerCase();

  return list.filter(item =>
    item.toLowerCase().includes(trimmedInput)
  ).slice(0, 10); // Limit to 10 suggestions
}

export function getAutoCompleteSuggestions(list, input) {
  if (!input) return [];

  const lastWord = input.split(",").pop().trim().toLowerCase();

  return list.filter(item =>
    item.toLowerCase().startsWith(lastWord)
  ).slice(0, 10);
}