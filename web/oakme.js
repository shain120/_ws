import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  // ctx.response.status = 404
  console.log('url=', ctx.request.url)
  let pathname = ctx.request.url.pathname
  if (pathname == '/name') {
    ctx.response.body = '黃冠勝'
  } else if(pathname == '/age') {
    ctx.response.body = '19'
  } else if(pathname == '/gender'){
    ctx.response.body = 'Male'
  }else {
    
  }
  // ctx.response.body = 'Not Found!'
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 })
