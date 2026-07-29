const Scheme = require('../models/scheme.model');

/**
 * @desc Check eligibility for a scheme
 * @access Public
 */
const checkEligibility = async (req, res, next) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        const applicant = req.body;
        const rules = scheme.eligibilityRules || {};
        const failedCriteria = [];

        // Normalization helper
        const normalize = (val) => (typeof val === 'string' ? val.trim().toLowerCase() : val);

        // 1. AGE: Explicit existence checks
        const hasMinAge = rules.age?.min !== undefined && rules.age?.min !== null;
        const hasMaxAge = rules.age?.max !== undefined && rules.age?.max !== null;

        if (hasMinAge || hasMaxAge) {
            if (applicant.age === undefined || applicant.age === null) {
                failedCriteria.push('age');
            } else {
                if (hasMinAge && applicant.age < rules.age.min) {
                    failedCriteria.push('age');
                } else if (hasMaxAge && applicant.age > rules.age.max) {
                    failedCriteria.push('age');
                }
            }
        }

        // 2. INCOME: Explicit existence checks
        const hasMaxIncome = rules.income?.max !== undefined && rules.income?.max !== null;
        if (hasMaxIncome) {
            if (applicant.income === undefined || applicant.income === null) {
                failedCriteria.push('income');
            } else if (applicant.income > rules.income.max) {
                failedCriteria.push('income');
            }
        }

        // 3. STRING CRITERIA
        const stringFields = ['gender', 'occupation', 'education', 'location', 'socialCategory'];
        stringFields.forEach((field) => {
            if (rules[field] && typeof rules[field] === 'string' && rules[field].trim() !== '') {
                if (applicant[field] === undefined || applicant[field] === null) {
                    failedCriteria.push(field);
                } else if (normalize(applicant[field]) !== normalize(rules[field])) {
                    failedCriteria.push(field);
                }
            }
        });

        // 4. DISABILITY STATUS: Strict boolean check
        if (rules.disabilityStatus !== undefined && rules.disabilityStatus !== null) {
            if (applicant.disabilityStatus === undefined || applicant.disabilityStatus === null) {
                failedCriteria.push('disabilityStatus');
            } else if (applicant.disabilityStatus !== rules.disabilityStatus) {
                failedCriteria.push('disabilityStatus');
            }
        }

        const eligible = failedCriteria.length === 0;

        res.status(200).json({
            success: true,
            schemeId: scheme._id,
            eligible,
            failedCriteria
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkEligibility
};
