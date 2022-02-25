const router = require('express').Router();
const { Status, User } = require('../db/models');

router.get('/', async (req, res) => {
    const status = await Status.findAll();
    res.render('profile', { status });
})

router.post('/', async (req, res) => {
    const { password, name, statuses } = req.body // данные пользователя
    if (req.session.userId) {
        if (!password === '') {
            const userUp = await User.update({ password: password }, { where: { id: req.session.userId } });
        }
        if (statuses === '' && name === '') {
            res.send('Поле "статус" не может быть пустым. Пожалуйста, введите статус');
        };
        let user;
        if (statuses === '') {
            const status = await Status.create({ name });
            user = await User.update({ statusId: status.id }, { where: { id: req.session.userId } });
        } else {
            let st = await Status.findOne({ where: { name: statuses } });
            user = await User.update({ statusId: st.id }, { where: { id: req.session.userId } });
        }
    } else {
        res.redirect('/');
    }

})

module.exports = router;