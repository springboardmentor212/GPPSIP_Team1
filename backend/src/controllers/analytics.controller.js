const Policy = require('../models/policy.model');
const Scheme = require('../models/scheme.model');
const Application = require('../models/application.model');
const User = require('../models/user.model');

/**
 * Helper to map scheme category tag to Department name
 */
const mapCategoryToDepartmentName = (category) => {
    switch (category) {
        case 'Scholarships':
        case 'Student Schemes':
            return 'Education';
        case 'Healthcare':
            return 'Health Care';
        case 'Farmer Welfare':
            return 'Agriculture';
        case 'Housing':
            return 'Housing & Urban';
        case 'Business Support':
            return 'MSME & Commerce';
        case 'Employment Programs':
            return 'Labour & Employment';
        default:
            return 'Social Welfare';
    }
};

/**
 * @desc Get Key Performance Indicators (KPIs)
 * @route GET /api/analytics/kpis
 * @access Private (Officials only)
 */
const getKPIs = async (req, res, next) => {
    try {
        const [
            totalPolicies,
            totalSchemes,
            totalApplications,
            approvedApps,
            activeUsers
        ] = await Promise.all([
            Policy.countDocuments(),
            Scheme.countDocuments(),
            Application.countDocuments(),
            Application.countDocuments({ status: 'Approved' }),
            User.countDocuments({ role: 'Citizen' })
        ]);

        const approvalRate = totalApplications > 0 
            ? parseFloat(((approvedApps / totalApplications) * 100).toFixed(1)) 
            : 0;

        // Calculate average processing duration for resolved applications
        const processingStats = await Application.aggregate([
            {
                $match: {
                    status: { $in: ['Approved', 'Rejected'] },
                    reviewedAt: { $exists: true, $ne: null },
                    submittedAt: { $exists: true, $ne: null }
                }
            },
            {
                $project: {
                    durationDays: {
                        $divide: [
                            { $subtract: ['$reviewedAt', '$submittedAt'] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgDuration: { $avg: '$durationDays' }
                }
            }
        ]);

        const avgProcessingTime = processingStats.length > 0 
            ? parseFloat(processingStats[0].avgDuration.toFixed(1)) 
            : 0;

        // Citizen Reach: Count of unique applicants who submitted applications
        const uniqueApplicants = await Application.distinct('applicant');
        const citizenReach = uniqueApplicants.length;

        // Estimated Monthly Searches: derived scale from user count
        const monthlySearches = activeUsers * 12 + totalApplications * 3;

        res.status(200).json({
            success: true,
            kpis: {
                totalPolicies,
                totalSchemes,
                totalApplications,
                approvalRate,
                activeUsers,
                avgProcessingTime,
                citizenReach,
                monthlySearches
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get Policy & Scheme Growth Trends (Monthly)
 * @route GET /api/analytics/trends
 * @access Private (Officials only)
 */
const getTrends = async (req, res, next) => {
    try {
        const policyTrends = await Policy.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const schemeTrends = await Scheme.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        const trendsMap = {};

        // Initialize all 12 months for the current year
        for (let i = 0; i < 12; i++) {
            trendsMap[`${currentYear}-${i + 1}`] = {
                month: monthNames[i],
                year: currentYear,
                policies: 0,
                schemes: 0
            };
        }

        // Merge policy counts
        policyTrends.forEach(item => {
            if (item._id && item._id.year && item._id.month) {
                const key = `${item._id.year}-${item._id.month}`;
                if (trendsMap[key]) {
                    trendsMap[key].policies = item.count;
                } else {
                    trendsMap[key] = {
                        month: monthNames[item._id.month - 1] || `Month ${item._id.month}`,
                        year: item._id.year,
                        policies: item.count,
                        schemes: 0
                    };
                }
            }
        });

        // Merge scheme counts
        schemeTrends.forEach(item => {
            if (item._id && item._id.year && item._id.month) {
                const key = `${item._id.year}-${item._id.month}`;
                if (trendsMap[key]) {
                    trendsMap[key].schemes = item.count;
                } else {
                    trendsMap[key] = {
                        month: monthNames[item._id.month - 1] || `Month ${item._id.month}`,
                        year: item._id.year,
                        policies: 0,
                        schemes: item.count
                    };
                }
            }
        });

        const trends = Object.values(trendsMap).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            const indexA = monthNames.indexOf(a.month);
            const indexB = monthNames.indexOf(b.month);
            return indexA - indexB;
        });

        res.status(200).json({
            success: true,
            trends
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get Departmental Performance Index
 * @route GET /api/analytics/departments
 * @access Private (Officials only)
 */
const getDepartmentAnalytics = async (req, res, next) => {
    try {
        // Aggregate policies by department string
        const policyStats = await Policy.aggregate([
            {
                $group: {
                    _id: '$department',
                    totalPolicies: { $sum: 1 }
                }
            }
        ]);

        // Aggregate schemes by category
        const schemeStats = await Scheme.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalSchemes: { $sum: 1 }
                }
            }
        ]);

        // Aggregate applications by scheme category
        const applicationStats = await Application.aggregate([
            {
                $lookup: {
                    from: 'schemes',
                    localField: 'scheme',
                    foreignField: '_id',
                    as: 'schemeDetail'
                }
            },
            { $unwind: '$schemeDetail' },
            {
                $project: {
                    category: '$schemeDetail.category',
                    status: 1,
                    applicant: 1,
                    durationDays: {
                        $cond: [
                            {
                                $and: [
                                    { $in: ['$status', ['Approved', 'Rejected']] },
                                    { $ne: ['$reviewedAt', null] },
                                    { $ne: ['$submittedAt', null] }
                                ]
                            },
                            {
                                $divide: [
                                    { $subtract: ['$reviewedAt', '$submittedAt'] },
                                    1000 * 60 * 60 * 24
                                ]
                            },
                            null
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalApplications: { $sum: 1 },
                    approvedApplications: {
                        $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
                    },
                    avgDuration: { $avg: '$durationDays' },
                    uniqueApplicants: { $addToSet: '$applicant' }
                }
            }
        ]);

        // Initialize departments registry
        const departments = {
            'Education': { name: 'Education', policies: 0, schemes: 0, applications: 0, approvalSum: 0, approvalCount: 0, uniqueCitizens: new Set() },
            'Health Care': { name: 'Health Care', policies: 0, schemes: 0, applications: 0, approvalSum: 0, approvalCount: 0, uniqueCitizens: new Set() },
            'Agriculture': { name: 'Agriculture', policies: 0, schemes: 0, applications: 0, approvalSum: 0, approvalCount: 0, uniqueCitizens: new Set() },
            'Housing & Urban': { name: 'Housing & Urban', policies: 0, schemes: 0, applications: 0, approvalSum: 0, approvalCount: 0, uniqueCitizens: new Set() },
            'MSME & Commerce': { name: 'MSME & Commerce', policies: 0, schemes: 0, applications: 0, approvalSum: 0, approvalCount: 0, uniqueCitizens: new Set() },
            'Labour & Employment': { name: 'Labour & Employment', policies: 0, schemes: 0, applications: 0, approvalSum: 0, approvalCount: 0, uniqueCitizens: new Set() },
            'Social Welfare': { name: 'Social Welfare', policies: 0, schemes: 0, applications: 0, approvalSum: 0, approvalCount: 0, uniqueCitizens: new Set() }
        };

        // Merge policy counts
        policyStats.forEach(item => {
            const name = item._id || 'Social Welfare';
            let deptKey = 'Social Welfare';
            if (name.toLowerCase().includes('edu')) deptKey = 'Education';
            else if (name.toLowerCase().includes('heal') || name.toLowerCase().includes('med')) deptKey = 'Health Care';
            else if (name.toLowerCase().includes('agri') || name.toLowerCase().includes('farm')) deptKey = 'Agriculture';
            else if (name.toLowerCase().includes('hous') || name.toLowerCase().includes('urb')) deptKey = 'Housing & Urban';
            else if (name.toLowerCase().includes('finance') || name.toLowerCase().includes('comm') || name.toLowerCase().includes('msme') || name.toLowerCase().includes('business')) deptKey = 'MSME & Commerce';
            else if (name.toLowerCase().includes('employ') || name.toLowerCase().includes('labour')) deptKey = 'Labour & Employment';

            departments[deptKey].policies += item.totalPolicies;
        });

        // Merge scheme counts
        schemeStats.forEach(item => {
            const deptKey = mapCategoryToDepartmentName(item._id);
            departments[deptKey].schemes += item.totalSchemes;
        });

        // Merge application stats
        applicationStats.forEach(item => {
            const deptKey = mapCategoryToDepartmentName(item._id);
            departments[deptKey].applications += item.totalApplications;
            if (item.avgDuration !== null) {
                departments[deptKey].approvalSum += item.avgDuration;
                departments[deptKey].approvalCount += 1;
            }
            if (item.uniqueApplicants) {
                item.uniqueApplicants.forEach(uid => {
                    departments[deptKey].uniqueCitizens.add(uid.toString());
                });
            }
            // Temporarily store total & approved counts for approval rate calculation
            const total = item.totalApplications;
            const approved = item.approvedApplications;
            departments[deptKey].approvalRateVal = total > 0 
                ? parseFloat(((approved / total) * 100).toFixed(1)) 
                : 0;
        });

        // Format into table list
        const results = Object.values(departments).map((d, index) => {
            const avgDuration = d.approvalCount > 0 
                ? parseFloat((d.approvalSum / d.approvalCount).toFixed(1)) 
                : 0;
            const approvalRate = d.approvalRateVal !== undefined ? d.approvalRateVal : 100.0;
            
            const size = d.uniqueCitizens.size;
            let reachStr = '0';
            if (size >= 1000000) reachStr = `${(size / 1000000).toFixed(1)}M`;
            else if (size >= 1000) reachStr = `${(size / 1000).toFixed(1)}K`;
            else reachStr = `${size}`;

            return {
                rank: index + 1,
                name: d.name,
                policies: d.policies,
                schemes: d.schemes,
                approval: approvalRate,
                approvalUp: approvalRate >= 90,
                reach: reachStr,
                avgProcessDays: avgDuration
            };
        });

        // Sort by policy + scheme volume descending
        results.sort((a, b) => (b.policies + b.schemes) - (a.policies + a.schemes));
        results.forEach((r, idx) => { r.rank = idx + 1; });

        res.status(200).json({
            success: true,
            departments: results
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getKPIs,
    getTrends,
    getDepartmentAnalytics
};
