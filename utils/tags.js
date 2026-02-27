export function parseTags(tagsInput = "") {
  return tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
