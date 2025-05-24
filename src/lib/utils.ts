
export function createDebouncer(delay:number): [(callback:() => void) => void, () => void]{
    let timeoutId:any
    function clear(){
        clearTimeout(timeoutId)
    }
    function debounce(callback:() => void){
        clearTimeout(timeoutId)
        timeoutId = setTimeout(callback, delay)
    }
    return [debounce, clear]
}