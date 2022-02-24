const addToLocals = (req, res, next) => {
  res.locals.userName = req.session?.userName;
  res.locals.userId = req.session?.userId;
  next();
};

const checkUser = (req, res, next) => {
  if (req.session.userName) {
    next(); // если юзер есть в сессии, пожалуйста, проходи дальше
  } else {
    res.redirect('/home/register'); // если юзера нет, то надо залогиниться
  }
};

const deepCheckUser = (req, res, next) => {
  if (Number(req.session.userId) === Number(req.params.id)) {
    next(); // если юзер есть в сессии, пожалуйста, проходи дальше
  } else {
    res.redirect('/home/register'); // если юзера нет, то надо залогиниться
  }
};

module.exports = { addToLocals, checkUser, deepCheckUser };
