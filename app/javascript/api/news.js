export const fetchNews = async (page) => {
	try {
		const response = await fetch(`/news/crawler?p=${page}`, { method: 'GET' });
		const data = await response.json()
		return data
	} catch {
		return []
	}
};