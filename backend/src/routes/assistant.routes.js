const express = require('express');
const { getSessions, getSession, chat, deleteSession } = require('../controllers/assistant.controller');
const identifyUser = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(identifyUser);

router.get('/sessions', getSessions);
router.get('/sessions/:id', getSession);
router.post('/chat', chat);
router.delete('/sessions/:id', deleteSession);

module.exports = router;
