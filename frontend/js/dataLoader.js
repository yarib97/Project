
export function loadAllData() {
  return Promise.all([
    loadData('data'),
    loadData('guesses')
  ]);
}

async function loadData(data) {
    try {
        const filePath = `../dataset/${data}.json`
        const response = await fetch(filePath)

        if (!response.ok) {
            throw new Error(`Failed to load file: ${response.status}`)
        }

        const jsonData = await response.json()
        return jsonData

    } catch (error) {
        console.error('Error reading JSON file:', error)
        throw error
    }
}
