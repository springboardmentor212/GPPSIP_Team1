const express = require('express');
const router = express.Router();
const savedPolicyController = require('../controllers/savedPolicy.controller');
const identifyUser = require('../middlewares/auth.middleware');

router.use(identifyUser);

router.post('/', savedPolicyController.savePolicy);
router.post('/toggle', savedPolicyController.toggleSavePolicy);
router.get('/', savedPolicyController.getSavedPolicies);
router.get('/check/:policyId', savedPolicyController.checkSavedPolicy);
router.delete('/:policyId', savedPolicyController.removeSavedPolicy);

module.exports = router;
