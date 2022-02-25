const express = require('express');
const path = require('path');
const morgan = require('morgan');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

require('dotenv').config();

const { addToLocals } = require('./middlewares/allMiddleWares');

const apiRouter = require('./routers/api/index');
const indexRouter = require('./routers/index');
const homeRouter = require('./routers/home');
const userRouter = require('./routers/user');
const profileRouter = require('./routers/profile');
const { checkUser } = require('./middlewares/allMiddleWares');

const app = express();
const PORT = process.env.PORT ?? 3000;
hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials'));

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.env.PWD, 'public')));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000, httpOnly: true },
    name: 'userCookie',
    store: new FileStore(),
  }),
);

app.use(addToLocals);

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/user', checkUser, userRouter);
app.use('/api', checkUser, apiRouter);
app.use('/profile', checkUser, profileRouter);


// error handler
app.use((err, req, res, next) => {
  if (err) {
    const fakeErrObject = { name: err.name, message: err.message };
    if (err.stack) fakeErrObject.stack = err.stack;
    fakeErrObject.asString = err.toString();
    res.status(500).json(fakeErrObject);
  } else {
    next();
  }
});

app.listen(PORT, () => console.log(`listening ${PORT}...`));
