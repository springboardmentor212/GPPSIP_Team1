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
 * Helper to get cutoff date based on period
 */
const getCutoffDate = (period) => {
    const now = new Date();
    switch (period) {
        case '7d':
            now.setDate(now.getDate() - 7);
            return now;
        case '30d':
            now.setDate(now.getDate() - 30);
            return now;
        case '6m':
            now.setMonth(now.getMonth() - 6);
            return now;
        case '12m':
            now.setFullYear(now.getFullYear() - 1);
            return now;
        default:
            return null;
    }
};

/**
 * Helper to map Department name to scheme categories
 */
const getCategoriesForDepartment = (dept) => {
    switch (dept) {
        case 'Education':
            return ['Scholarships', 'Student Schemes'];
        case 'Health Care':
            return ['Healthcare'];
        case 'Agriculture':
            return ['Farmer Welfare'];
        case 'Housing & Urban':
            return ['Housing'];
        case 'MSME & Commerce':
            return ['Business Support'];
        case 'Labour & Employment':
            return ['Employment Programs'];
        case 'Social Welfare':
            return ['Women Empowerment', 'Senior Citizen Welfare', 'Social Security'];
        default:
            return [];
    }
};

/**
 * @desc Get Key Performance Indicators (KPIs)
 * @route GET /api/analytics/kpis
 * @access Private (Officials only)
 */
const getKPIs = async (req, res, next) => {
    try {
        const { period, department } = req.query;
        const cutoffDate = getCutoffDate(period);

        const policyQuery = {};
        const schemeQuery = {};
        const appQuery = {};
        const approvedAppQuery = { status: 'Approved' };
        const userQuery = { role: 'Citizen' };

        if (cutoffDate) {
            policyQuery.createdAt = { $gte: cutoffDate };
            schemeQuery.createdAt = { $gte: cutoffDate };
            appQuery.createdAt = { $gte: cutoffDate };
            approvedAppQuery.createdAt = { $gte: cutoffDate };
            userQuery.createdAt = { $gte: cutoffDate };
        }

        if (department) {
            policyQuery.department = department;
            const categories = getCategoriesForDepartment(department);
            schemeQuery.category = { $in: categories };

            // Find schemes under these categories
            const matchingSchemes = await Scheme.find({ category: { $in: categories } }).select('_id');
            const schemeIds = matchingSchemes.map(s => s._id);
            appQuery.scheme = { $in: schemeIds };
            approvedAppQuery.scheme = { $in: schemeIds };
        }

        const [
            totalPolicies,
            totalSchemes,
            totalApplications,
            approvedApps,
            activeUsers
        ] = await Promise.all([
            Policy.countDocuments(policyQuery),
            Scheme.countDocuments(schemeQuery),
            Application.countDocuments(appQuery),
            Application.countDocuments(approvedAppQuery),
            User.countDocuments(userQuery)
        ]);

        const approvalRate = totalApplications > 0 
            ? parseFloat(((approvedApps / totalApplications) * 100).toFixed(1)) 
            : 0;

        // Calculate average processing duration for resolved applications
        const processingMatch = {
            status: { $in: ['Approved', 'Rejected'] },
            reviewedAt: { $exists: true, $ne: null },
            submittedAt: { $exists: true, $ne: null }
        };
        if (cutoffDate) {
            processingMatch.createdAt = { $gte: cutoffDate };
        }
        if (department) {
            const categories = getCategoriesForDepartment(department);
            const matchingSchemes = await Scheme.find({ category: { $in: categories } }).select('_id');
            const schemeIds = matchingSchemes.map(s => s._id);
            processingMatch.scheme = { $in: schemeIds };
        }

        const processingStats = await Application.aggregate([
            { $match: processingMatch },
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
        const reachQuery = {};
        if (cutoffDate) {
            reachQuery.createdAt = { $gte: cutoffDate };
        }
        if (department) {
            const categories = getCategoriesForDepartment(department);
            const matchingSchemes = await Scheme.find({ category: { $in: categories } }).select('_id');
            const schemeIds = matchingSchemes.map(s => s._id);
            reachQuery.scheme = { $in: schemeIds };
        }
        const uniqueApplicants = await Application.distinct('applicant', reachQuery);
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
        const { period, department, category } = req.query;
        const cutoffDate = getCutoffDate(period);

        const policyMatch = {};
        const schemeMatch = {};

        if (cutoffDate) {
            policyMatch.createdAt = { $gte: cutoffDate };
            schemeMatch.createdAt = { $gte: cutoffDate };
        }

        if (department) {
            policyMatch.department = department;
            const categories = getCategoriesForDepartment(department);
            schemeMatch.category = { $in: categories };
        }

        if (category) {
            policyMatch.category = category;
            schemeMatch.category = category;
        }

        const policyTrends = await Policy.aggregate([
            { $match: policyMatch },
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
            { $match: schemeMatch },
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
        const { period, department, sortBy } = req.query;
        const cutoffDate = getCutoffDate(period);

        const policyMatch = {};
        const schemeMatch = {};
        const appMatch = {};

        if (cutoffDate) {
            policyMatch.createdAt = { $gte: cutoffDate };
            schemeMatch.createdAt = { $gte: cutoffDate };
            appMatch.createdAt = { $gte: cutoffDate };
        }

        // Aggregate policies by department string
        const policyStats = await Policy.aggregate([
            { $match: policyMatch },
            {
                $group: {
                    _id: '$department',
                    totalPolicies: { $sum: 1 }
                }
            }
        ]);

        // Aggregate schemes by category
        const schemeStats = await Scheme.aggregate([
            { $match: schemeMatch },
            {
                $group: {
                    _id: '$category',
                    totalSchemes: { $sum: 1 }
                }
            }
        ]);

        // Aggregate applications by scheme category
        const applicationStats = await Application.aggregate([
            { $match: appMatch },
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
            // Store total & approved counts for approval rate calculation
            const total = item.totalApplications;
            const approved = item.approvedApplications;
            departments[deptKey].approvalRateVal = total > 0 
                ? parseFloat(((approved / total) * 100).toFixed(1)) 
                : 0;
        });

        // Format into table list
        let results = Object.values(departments).map((d, index) => {
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

        // Filter by specific department if requested
        if (department) {
            results = results.filter(r => r.name.toLowerCase() === department.toLowerCase());
        }

        // Sort dynamically based on sortBy parameter
        if (sortBy === 'approvalRate') {
            results.sort((a, b) => b.approval - a.approval);
        } else if (sortBy === 'processingTime') {
            results.sort((a, b) => a.avgProcessDays - b.avgProcessDays);
        } else {
            // Default: 'volume'
            results.sort((a, b) => (b.policies + b.schemes) - (a.policies + a.schemes));
        }

        // Re-assign ranks based on final sorted order
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
