const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()
const secretKey = "secretKey"

app.get("/api", (req, res) => {
  res.json({message: "Welcome to the API"})
})

app.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {
      res.json({
        message: "Post created",
        authData
      })
      
    }
  })
})

app.post("/api/login", (req, res) => {
  // Mock user
  const user = {
    id: 1,
    username: "eric",
    email: "eric@gmail.com"
  }

  jwt.sign({user}, secretKey, {expiresIn: "30s"},(err, token) => {
    res.json({token})
  })
})

// Format of Token
// Authorization: bearer <access_token>
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization']
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space to get the token
    const bearer = bearerHeader.split(" ")
    // Get token from array
    const bearerToken = bearer[1]
    req.token = bearerToken;
    // Next middleware
    next()
  } else {
    // Forbidden
    res.sendStatus(403)
  }
}

app.listen(5000, () => console.log("Server started on port 5000"))