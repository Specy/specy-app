import fetch from "node-fetch"
async function init(){
    let start = performance.now()
    let body = {}
    body = JSON.stringify(body)
    let cycles = 0
    let dones = 0
    console.log(body)
    let promises = []
    console.log('Starting')
    while(cycles++ < 5000){
        promises.push(fetch('http://localhost:3001/ping').then(() => console.log("Done:"+dones++)))
    }
    await Promise.all(promises)
    let end = parseInt(performance.now() - start)
    console.log("Total time:",end)
}

init()