const express = require('express');
const path = require('path');
const morgan = require('morgan');
const hbs = require('hbs');
const indexRouter = require('./routers/index');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.PWD, 'public')));
hbs.registerPartials(path.join(process.PWD, 'views', 'partials'));

app.use('/', indexRouter);

app.listen(PORT, () => console.log(`listening ${PORT}...`));
