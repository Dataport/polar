/**
 * Sets the height of sticky table columns
 */
export function setStickyColumnStyles(tableElement: HTMLElement) {
  const cols: NodeListOf<HTMLElement> = tableElement.querySelectorAll("[data-sticky]");

  for (const col of Array.from(cols)) {
    const { width, height } = col.getBoundingClientRect();
    const row = col.closest("tr");

    col.style.width = `${width}px`;
    col.style.minWidth = `${width}px`;
    col.style.height = `${height}px`;

    if (row) {
      row.style.height = `${height}px`;
    }
  }
}
