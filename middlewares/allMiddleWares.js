const addToLocals = (req,res,next) => {
  res.locals.userName= req.session?.userName; //если req.session.userId сушествует, тогда запиши его в rec.locals
  next();
};

const checkUser = (req, res, next) => {
  if (req.session.userName) {
    next(); // если юзер есть в сессии, пожалуйста, проходи дальше
  } else {
    res.redirect('/entries/register') // если юзера нет, то надо залогиниться
  }
}

const deepCheckUser = (req, res, next) => {
  // console.log('deepCheckUser');
  // console.log(req.params.id, req.session.userId);
  if (Number(req.session.userId) === Number(req.params.id)) {
    next(); // если юзер есть в сессии, пожалуйста, проходи дальше
  } else {
    res.redirect('/entries/register') // если юзера нет, то надо залогиниться
  }
}

module.exports = { addToLocals, checkUser, deepCheckUser};