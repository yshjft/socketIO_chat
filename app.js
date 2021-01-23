const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const morgan = require('morgan')
const path =require('path')
require('dotenv').config()

const pageRouter = require('./routes/page')
const {sequelize} = require('./models')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 8003)
sequelize.sync()

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))

app.use('/', pageRouter)

app.use((req,res, next)=>{
    const error = new Error()
    error.status=404
    next(error)
})

app.use((error, req, res, next)=>{
    res.locals.message =  error.message
    res.locals.error = req.app.get('env') === 'development' ? error : {}
    res.status(error.status || 500)
    res.render('error')
})

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
})