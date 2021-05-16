export const fetchNews = async (page) => {
	try {
		const response = await fetch(`/news/fetch_news?p=${page}`, { method: 'GET' });
		const data = await response.json()
		return data
	} catch {
		return []
	}
};

export const fetchDescription = async (url) => {
	try {
		const response = await fetch(`/meta/fetch`, { method: 'POST', body: JSON.stringify({url})} );
		const data = await response.json()
		return data
	} catch {
		return []
	}
};

export const fetchDetail = async (url) => {
	try {
		const response = await fetch(`/detail/fetch?url=${url}`, { method: 'GET' });
		const data = await response.text()
		return data
	} catch {
		return []
	}
};
