const Url = process.env.URL || 'https://localhost:3001'
type Method = "POST" | "GET" | "PATCH" | "DELETE"
class ApiFetcher{
    baseUrl: string
    accessToken: string
    isAuthorised: boolean
    constructor(){
        this.baseUrl = Url
        this.isAuthorised = false
        this.accessToken = sessionStorage.getItem("access_token")
        this.getAccessToken()
    }
    async apiFetcher(path: string, method: Method, body?: object){
        let accessToken = await this.getAccessToken()
        let options: any = {
            method,
            headers: {
                "Content-Type" : "application/json",
                "Access": "Bearer "+accessToken
            }
        }
        if(body) options.body = JSON.stringify(body)
        let res = await fetch(Url + path, options)
        return {
            res: res,
            ok: res.ok,
            json: await res.json().catch(() => {return {}} )
        }
    }
    async getAccessToken() : Promise<string>{
        if(this.accessToken) return this.accessToken
        let result = await fetch(Url + "/auth/refresh").then(data => data.json())
        console.log(result)
       if(result.accessToken) this.isAuthorised 
        return result.accessToken
    }
}
export const apiFetcher = new ApiFetcher()
