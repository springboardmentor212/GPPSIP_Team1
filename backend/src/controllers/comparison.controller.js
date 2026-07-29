const Policy = require('../models/policy.model');
const Scheme = require('../models/scheme.model');

/**
 * @desc Compare multiple policies side by side
 * @route POST /api/compare/policies
 * @access Public
 */
const comparePolicies = async (req, res, next) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least 2 policy IDs to compare'
            });
        }

        if (ids.length > 4) {
            return res.status(400).json({
                success: false,
                message: 'You can compare a maximum of 4 policies at a time'
            });
        }

        const policies = await Policy.find({ _id: { $in: ids } })
            .populate('creator', 'fullName email')
            .populate('approvedBy', 'fullName email');

        if (policies.length < 2) {
            return res.status(404).json({
                success: false,
                message: `Only ${policies.length} of the requested policies were found. At least 2 are required for comparison.`
            });
        }

        // Build structured comparison data
        const comparison = {
            comparedAt: new Date(),
            totalPolicies: policies.length,
            policies: policies.map(policy => ({
                _id: policy._id,
                title: policy.title,
                description: policy.description,
                department: policy.department,
                category: policy.category,
                status: policy.status,
                creator: policy.creator,
                approvedBy: policy.approvedBy || null,
                createdAt: policy.createdAt,
                updatedAt: policy.updatedAt
            })),
            comparisonFields: {
                categories: [...new Set(policies.map(p => p.category))],
                departments: [...new Set(policies.map(p => p.department))],
                statuses: [...new Set(policies.map(p => p.status))],
                sameCategory: new Set(policies.map(p => p.category)).size === 1,
                sameDepartment: new Set(policies.map(p => p.department)).size === 1,
                sameStatus: new Set(policies.map(p => p.status)).size === 1
            }
        };

        res.status(200).json({
            success: true,
            comparison
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Compare multiple schemes side by side
 * @route POST /api/compare/schemes
 * @access Public
 */
const compareSchemes = async (req, res, next) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least 2 scheme IDs to compare'
            });
        }

        if (ids.length > 4) {
            return res.status(400).json({
                success: false,
                message: 'You can compare a maximum of 4 schemes at a time'
            });
        }

        const schemes = await Scheme.find({ _id: { $in: ids } })
            .populate('creator', 'fullName email');

        if (schemes.length < 2) {
            return res.status(404).json({
                success: false,
                message: `Only ${schemes.length} of the requested schemes were found. At least 2 are required for comparison.`
            });
        }

        // Build structured comparison data with eligibility rules comparison
        const comparison = {
            comparedAt: new Date(),
            totalSchemes: schemes.length,
            schemes: schemes.map(scheme => ({
                _id: scheme._id,
                title: scheme.title,
                description: scheme.description,
                category: scheme.category,
                status: scheme.status,
                creator: scheme.creator,
                eligibilityRules: scheme.eligibilityRules || {},
                createdAt: scheme.createdAt,
                updatedAt: scheme.updatedAt
            })),
            comparisonFields: {
                categories: [...new Set(schemes.map(s => s.category))],
                statuses: [...new Set(schemes.map(s => s.status))],
                sameCategory: new Set(schemes.map(s => s.category)).size === 1,
                sameStatus: new Set(schemes.map(s => s.status)).size === 1
            },
            eligibilityComparison: {
                ageRanges: schemes.map(s => ({
                    schemeId: s._id,
                    title: s.title,
                    min: s.eligibilityRules?.age?.min ?? null,
                    max: s.eligibilityRules?.age?.max ?? null
                })),
                incomeLimit: schemes.map(s => ({
                    schemeId: s._id,
                    title: s.title,
                    maxIncome: s.eligibilityRules?.income?.max ?? null
                })),
                genderRequirement: schemes.map(s => ({
                    schemeId: s._id,
                    title: s.title,
                    gender: s.eligibilityRules?.gender || 'Any'
                })),
                locationRequirement: schemes.map(s => ({
                    schemeId: s._id,
                    title: s.title,
                    location: s.eligibilityRules?.location || 'Any'
                }))
            }
        };

        res.status(200).json({
            success: true,
            comparison
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    comparePolicies,
    compareSchemes
};
