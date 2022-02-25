const { Delegation } = require('../db/models');

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

async function allowedToSeeEntries(req, res, next) {
  if (!req.params.userId) {
    next();
    return;
  }
  if (Number(req.params.userId) === req.session.userId) {
    next();
    return;
  }
  const deleg = await Delegation.findOne({
    raw: true,
    where: {
      userId: req.params.userId,
      delegateeId: req.session.userId,
    },
  });
  if (deleg !== null) next();
  else next(new Error('Запрещено'));
}

function itIsCurrentUser(req, res, next) {
  if (Number(req.body.userId) === Number(req.session.userId)) next();
  else next(new Error('Операция запрещена'));
}

module.exports = {
  addToLocals,
  checkUser,
  deepCheckUser,
  allowedToSeeEntries,
  itIsCurrentUser,
};
