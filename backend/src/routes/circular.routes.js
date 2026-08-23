const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const {
    getAllCirculars,
    getCircularById,
    createCircular,
    updateCircular,
    deleteCircular
} = require('../controllers/circular.controller');

router.route('/')
    .get(protect, getAllCirculars)
    .post(protect, authorize('Gov. Official', 'Super Admin'), createCircular);

router.route('/:id')
    .get(protect, getCircularById)
    .put(protect, authorize('Gov. Official', 'Super Admin'), updateCircular)
    .delete(protect, authorize('Gov. Official', 'Super Admin'), deleteCircular);

module.exports = router;
