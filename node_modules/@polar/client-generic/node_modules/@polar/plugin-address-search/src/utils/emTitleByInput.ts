export const emTitleByInput = (title: string, inputValue: string): string => {
  const index = title.toLowerCase().indexOf(inputValue.toLowerCase())
  if (index === -1) {
    return title
  }
  return (
    title.substring(0, index) +
    '<em>' +
    title.substring(index, index + inputValue.length) +
    '</em>' +
    title.substring(index + inputValue.length)
  )
}
