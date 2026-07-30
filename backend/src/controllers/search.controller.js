const Policy = require('../models/policy.model');
const Scheme = require('../models/scheme.model');

/**
 * @desc Unified Search for Policies and Schemes
 * @access Public
 */
const searchAll = async (req, res, next) => {
    try {
        const { q, category, department, status, state, ministry } = req.query;

        // Base queries
        const policyQuery = {};
        const schemeQuery = {};

        // 1. Keyword search (title OR description)
        if (q) {
            // Escape special regex characters to treat 'q' as a literal string
            const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = { $regex: escapedQ, $options: 'i' };
            const orQuery = { $or: [{ title: regex }, { description: regex }] };
            Object.assign(policyQuery, orQuery);
            Object.assign(schemeQuery, orQuery);
        }

        // 2. Category search
        if (category) {
            policyQuery.category = category;
            schemeQuery.category = category;
        }

        // 3. Department search
        if (department) {
            policyQuery.department = department;
            // Schemes cannot match department, so we implicitly skip querying schemes
        }

        // Add state filtering
        if (state) {
            // If the model supports state/location, we map it here
            // Policy doesn't have a strict location field, but we can query it if dynamic
            // Scheme has eligibilityRules.location
            policyQuery.location = { $regex: state, $options: 'i' };
            schemeQuery['eligibilityRules.location'] = { $regex: state, $options: 'i' };
        }

        // Add ministry filtering
        if (ministry) {
            policyQuery.department = { $regex: ministry, $options: 'i' };
            schemeQuery.department = { $regex: ministry, $options: 'i' };
        }

        // 4. Status search
        const policyStatuses = ['Draft', 'Pending', 'Approved', 'Archived'];
        const schemeStatuses = ['Active', 'Archived'];

        let shouldQueryPolicy = true;
        let shouldQueryScheme = true;

        if (status) {
            if (policyStatuses.includes(status)) {
                policyQuery.status = status;
            } else {
                shouldQueryPolicy = false;
            }

            if (schemeStatuses.includes(status)) {
                schemeQuery.status = status;
            } else {
                shouldQueryScheme = false;
            }
        }

        // Execute queries
        const [policies, schemes] = await Promise.all([
            shouldQueryPolicy ? Policy.find(policyQuery).populate('creator', 'fullName email') : Promise.resolve([]),
            // Schemes only queried if department is NOT supplied
            (shouldQueryScheme && !department) ? Scheme.find(schemeQuery).populate('creator', 'fullName email') : Promise.resolve([])
        ]);

        res.status(200).json({
            success: true,
            policies,
            schemes
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchAll
};
