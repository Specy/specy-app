import Axios, { AxiosRequestConfig } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import storage from '../utils/storage'
import {get} from 'svelte/store'
const API_URL = 'http://localhost:5000/' //ENV???

function authRequestInterceptor(config: AxiosRequestConfig) {
	if (config.url == 'auth/login') return config
	const token = get(storage)
	console.log("Token from storage",token)
	if (token) {
		config.headers.authorization = `Bearer ${token}`
	}
	config.headers.Accept = 'application/json'
	return config
}

export const axios = Axios.create({
	baseURL: API_URL,
	withCredentials: true
})
axios.interceptors.request.use(authRequestInterceptor)

//This one is not rlly neccesary, its sole purpose is to extract the data only from response.
// Result is const data = axios.get(url), and it returns data right away.
axios.interceptors.response.use(
	(res) => res.data,
	(err) => {
		storage.set("")
		return Promise.reject(err)
	}
)
createAuthRefreshInterceptor(axios, async (err) => {
	const response = await Axios.post(API_URL + 'auth/refresh', {}, { withCredentials: true })
	storage.set(response.data.accessToken)
	return Promise.resolve()
})
