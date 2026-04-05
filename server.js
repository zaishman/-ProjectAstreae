const express = require('express');
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const app = express();

app.get('/', function(req,res) {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
    const envScript = `<script>window._env_ = { API_KEY: "${process.env.API_KEY}", MAPBOX_TOKEN: "${process.env.MAPBOX_TOKEN}" }</script>`
    html= html.replace('</head>', envScript + '</head>')
    res.send(html)
})

app.use(express.static(path.join(__dirname)));

app.listen(process.env.PORT || 3000, () => console.log('Server running'))



/*
app.listen(3000, () => console.log("Server running on port 3000"));

const server = http.createServer(function(req, res) {
    if (req.url === '/' || req.url ==='index.html') {
        let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')

        const envScript = `<script>window._env_ = {API_KEY:"${process.env.API_KEY}" }</script>`
        html= html.replace('</head>', envScript + '</head>')
    
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(html)

    } else if (req.url == '/script.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript' })
        res.end(fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8'))

    } else if (req.url === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' })
    res.end(fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'))
    }
})

server.listen(3000, function() {
  console.log('Server running at http://localhost:3000')
})
*/


