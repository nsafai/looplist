/* eslint-disable global-require */
require('dotenv').config()
require('bcryptjs')

const { MLAB_URI } = process.env
const { DB_USER } = process.env
const { DB_PASSWORD } = process.env

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()
const server = require('http').Server(app)

// Database setup
const mongoose = require('mongoose')

// const mlabURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${MLAB_URI}`
// mongoose.connect(process.env.MONGODB_URI || mlabURI, { useNewUrlParser: true })
mongoose.connect('mongodb://mongo:27017');
mongoose.set('useCreateIndex', true) // silencing a deprecated feature warning that's a bug per https://github.com/Automattic/mongoose/issues/6890
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
const exphbs = require('express-handlebars')

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: require('handlebars-helpers')(),
}))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Socket.io init
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('🔌 New user connected! 🔌')
  require('./sockets/checklist-server.js')(io, socket)
  require('./sockets/todo-server.js')(io, socket)
})

// configure sessions
const session = require('express-session')

app.use(session({
  secret: process.env.SESSION_CODE,
  cookie: { maxAge: 3600000 },
  resave: true,
  saveUninitialized: true,
}))

// express router setup
const indexRouter = require('./routes/index')
const checklistRouter = require('./routes/checklist')
const usersRouter = require('./routes/users')

app.use('/', indexRouter)
app.use('/', checklistRouter)
app.use('/', usersRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// for heroku
const port = process.env.PORT || 3000
app.set('port', port)

server.listen(app.get('port'))

module.exports = app
