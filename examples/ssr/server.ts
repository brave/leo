import express from 'express'
import { render } from '../../src/ssr/render'
import fs from 'fs/promises'

const app = express()

app.get('/icons/:name', async (req, res) => {
  const icon = await fs.readFile(`../../icons/${req.params.name}`, 'utf-8')
  res.type('svg')
  res.send(icon)
})

app.get('/variables.css', async (req, res) => {
  const css = await fs.readFile('../../tokens/css/variables.css', 'utf-8')
  res.type('css')
  res.send(css)
})

app.get('/', async (req, res) => {
  const rawHtml = await fs.readFile('./raw.html', 'utf-8')

  const html = await render(rawHtml, [
    () => import('../../web-components/button'),
    () => import('../../web-components/checkbox'),
    () => import('../../web-components/input')
  ])
  res.type('html')
  res.send(html)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
