const express = require('express');
const router = express.Router();
const identifyUser = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const {
    getAllCirculars,
    getCircularById,
    createCircular,
    updateCircular,
    deleteCircular
} = require('../controllers/circular.controller');

router.route('/')
    .get(identifyUser, getAllCirculars)
    .post(identifyUser, authorize(['Gov. Official', 'Super Admin']), createCircular);

router.route('/:id')
    .get(identifyUser, getCircularById)
    .put(identifyUser, authorize(['Gov. Official', 'Super Admin']), updateCircular)
    .delete(identifyUser, authorize(['Gov. Official', 'Super Admin']), deleteCircular);

module.exports = router;
