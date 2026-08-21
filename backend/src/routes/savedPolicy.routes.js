const express = require('express');
const router = express.Router();
const savedPolicyController = require('../controllers/savedPolicy.controller');
const identifyUser = require('../middlewares/auth.middleware');

router.use(identifyUser);

router.post('/', savedPolicyController.savePolicy);
router.get('/', savedPolicyController.getSavedPolicies);
router.delete('/:policyId', savedPolicyController.removeSavedPolicy);
router.get('/check/:policyId', savedPolicyController.checkSavedPolicy);

module.exports = router;
