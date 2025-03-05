export const getSetting = async () => {
  const response = await fetch('/api/v1/setting')
  return response.json()
}
