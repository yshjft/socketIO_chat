const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const morgan = require('morgan')
const ColorHash = require('color-hash')
const path =require('path')
require('dotenv').config()

const webSocket = require('./socket')
const pageRouter = require('./routes/page')
const {sequelize} = require('./models')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 8003)

// {force : true}를 사용하게 될 경우 db 스키마가 변경되면 기존 데이터를 지우고 변경된 스키마를 반영해 준다. (굉장한 주의를 요함)
sequelize.sync()

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser(process.env.COOKIE_SECRET))
const sessionMiddleware = session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
})
app.use(sessionMiddleware)
app.use ((req, res, next)=>{
    if(!req.session.color){
        const colorHash =  new ColorHash()
        req.session.color =  colorHash.hex(req.sessionID)
    }

    next()
})

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

const server = app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
})

webSocket(server, app, sessionMiddleware)