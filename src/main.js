require('dotenv').config()
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function converter(amount, from, to) {
  return (to * amount) /from
}

app.get('/', (req, res) => res.send('API still working.'))
app.post('/', async (req, res) => {
  const uri = process.env.API_URI
  const access_key = process.env.ACCESS_TOKEN
  let { amount, from, to } = req.body
  if (!amount || !from || !to) {
    res.status(400).json({
      success: false,
      error: {
        info: 'Required currency(from, to) and amount'
      }
    })
    return
  }
  from = req.body.from.toUpperCase().trim()
  to = req.body.to.toUpperCase().trim()
  const symbols = `${from},${to}`
  const params = { access_key, symbols }

  try {
    const { data } = await axios.get(uri, { params })
    if (!data.success) {
      res.json(data)
      return
    }
    const { rates } = data
    const result = converter(amount, rates[from], rates[to])
    const responseData = { amount, from, to, result }
    res.json(responseData)
  } catch (e) {
    res.status(400).json(e)
  }
})

module.exports = app

// const port = process.env.PORT || 8080
// app.listen(port, () => console.log(`listening on port ${port}`))