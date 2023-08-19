let isDev = process.env.NODE_ENV === 'development'

const baseURL = isDev ? 'http://localhost:8001' : ''
const wsBaseURL = isDev ? 'http://localhost:8002' : ''


export {
	baseURL,
	wsBaseURL
}