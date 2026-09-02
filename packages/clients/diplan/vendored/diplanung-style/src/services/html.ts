export function unescapeHtml(escapedString: string): string {
  const textarea = document.createElement("textarea");

  textarea.innerHTML = escapedString;

  return textarea.value;
}
