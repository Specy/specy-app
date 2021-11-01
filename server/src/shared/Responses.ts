type MessageArg = Array<string> | string
class Response{
    message: string
    data: object
    status: string
    constructor(){

    }
    toJson(){
        return JSON.stringify(this)
    }
}
export class SuccessfulResponse extends Response{
    constructor(message:MessageArg,data?:object){
        super()
        this.message = Array.isArray(message) ? message.join('\n') : message
        if(data) this.data = data
        this.status = "success"
    }
} 
