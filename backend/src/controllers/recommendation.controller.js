const Scheme = require('../models/scheme.model');
const User = require('../models/user.model');

/**
 * Calculate match percentage between user/form profile and a scheme's rules
 */
const calculateMatchPercentage = (profile, rules) => {
    if (!rules || Object.keys(rules).length === 0) return 100;

    let totalWeight = 0;
    let earnedWeight = 0;

    // Age rule (20% weight)
    if (rules.age && (rules.age.min || rules.age.max)) {
        totalWeight += 20;
        if (profile.age) {
            const age = Number(profile.age);
            const min = rules.age.min || 0;
            const max = rules.age.max || 999;
            if (age >= min && age <= max) {
                earnedWeight += 20;
            }
        }
    }

    // Income rule (30% weight) - extremely important for schemes
    if (rules.income && rules.income.max) {
        totalWeight += 30;
        if (profile.annualIncome !== undefined) {
            const income = Number(profile.annualIncome);
            if (income <= rules.income.max) {
                earnedWeight += 30;
            }
        }
    }

    // Occupation rule (15% weight)
    if (rules.occupation) {
        totalWeight += 15;
        if (profile.occupation && profile.occupation.toLowerCase() === rules.occupation.toLowerCase()) {
            earnedWeight += 15;
        }
    }

    // Education rule (15% weight)
    if (rules.education) {
        totalWeight += 15;
        if (profile.education && profile.education.toLowerCase() === rules.education.toLowerCase()) {
            earnedWeight += 15;
        }
    }

    // Gender rule (10% weight)
    if (rules.gender) {
        totalWeight += 10;
        if (profile.gender && profile.gender.toLowerCase() === rules.gender.toLowerCase()) {
            earnedWeight += 10;
        }
    }

    // Social Category rule (10% weight)
    if (rules.socialCategory) {
        totalWeight += 10;
        if (profile.socialCategory && profile.socialCategory.toLowerCase() === rules.socialCategory.toLowerCase()) {
            earnedWeight += 10;
        }
    }

    if (totalWeight === 0) return 100; // If scheme has no specific rules we can measure, it's open to all

    return Math.round((earnedWeight / totalWeight) * 100);
};

/**
 * @desc Get recommended schemes based on user profile or provided form data
 * @route POST /api/recommendations
 * @access Private
 */
const getRecommendations = async (req, res, next) => {
    try {
        const formData = req.body;
        
        let profile = { ...formData };

        // If no form data is provided (e.g. from Dashboard), try to build profile from User DB
        if (Object.keys(formData).length === 0 && req.user) {
            const user = await User.findById(req.user.id);
            if (user) {
                profile = {
                    annualIncome: user.income,
                    occupation: user.occupation,
                    education: user.education
                };
            }
        }

        const schemes = await Scheme.find({ status: 'Active' });

        const recommendedSchemes = schemes.map(scheme => {
            const matchPercentage = calculateMatchPercentage(profile, scheme.eligibilityRules);
            
            // Add a friendly tag based on score
            let eligibilityTag = 'Check Eligibility';
            if (matchPercentage >= 80) eligibilityTag = 'Highly Eligible';
            else if (matchPercentage >= 50) eligibilityTag = 'Partially Eligible';
            else eligibilityTag = 'Not Eligible';

            return {
                ...scheme.toObject(),
                matchPercentage,
                eligibilityTag
            };
        });

        // Sort by highest match first
        recommendedSchemes.sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json({
            success: true,
            schemes: recommendedSchemes
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRecommendations
};
