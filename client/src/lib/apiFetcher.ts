const Url = 'http://localhost:3001'
type Method = "POST" | "GET" | "PATCH" | "DELETE"
class ApiFetcher{
    baseUrl: string
    accessToken: string
    isAuthorised: boolean
    constructor(){
        this.baseUrl = Url
        this.isAuthorised = false
        this.accessToken = ""
        this.getAccessToken()
    }
    async fetch(path: string, method: Method, body?: object){
        let accessToken = await this.getAccessToken()
        let options: any = {
            method,
            headers: {
                "Content-Type" : "application/json",
                "Authorization": "Bearer "+accessToken
            }
        }
        if(body) options.body = JSON.stringify(body)
        try{
            let res = await fetch(Url + path, options)
            return {
                res: res,
                ok: res.ok,
                json: await res.json().catch(() => {return {}} )
            }
        }catch(e){
            console.log(e)
            return {
                res: {},
                ok: false,
                json: {},
                error: e
            }
        }

    }
    async getAccessToken() : Promise<string>{
        if(this.accessToken) return this.accessToken
        try{
            let result = await fetch(Url + "/auth/refresh",{
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                }
            }).then(data => data.json())
            if(result.accessToken){
                 this.isAuthorised = true
                 this.accessToken = result.accssToken
            }
            return result.accessToken
        }catch(e){
            console.log(e)
            return ""
        }      
    }
}
export const apiFetcher = new ApiFetcher()