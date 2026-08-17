const fs = require('fs');
const path = require('path');
const Report = require('../models/report.model');

/**
 * Helper to generate a unique Report ID in the format #RPT-XXXX
 */
const generateUniqueReportId = async () => {
    let isUnique = false;
    let reportId = '';
    while (!isUnique) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        reportId = `#RPT-${randomNum}`;
        const existing = await Report.findOne({ reportId });
        if (!existing) {
            isUnique = true;
        }
    }
    return reportId;
};

/**
 * Helper to compile data from other schemas into CSV/Text content based on template type
 */
const compileReportContent = async (template, filters) => {
    const Policy = require('../models/policy.model');
    const Scheme = require('../models/scheme.model');
    const Application = require('../models/application.model');
    const User = require('../models/user.model');

    let content = '';
    const dateQuery = {};

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'custom') {
        const days = filters.dateRange === '30d' ? 30 : filters.dateRange === '90d' ? 90 : 365;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        dateQuery.createdAt = { $gte: cutoff };
    }

    if (template === 'Department Performance') {
        // Group policies by department
        const policyStats = await Policy.aggregate([
            { $match: dateQuery },
            { $group: { _id: '$department', total: { $sum: 1 } } }
        ]);

        const schemeStats = await Scheme.aggregate([
            { $match: dateQuery },
            { $group: { _id: '$category', total: { $sum: 1 } } }
        ]);

        content += 'Department Performance Index Report\n';
        content += `Generated At: ${new Date().toLocaleString()}\n`;
        content += '=======================================\n\n';
        content += 'Department,Policies Count,Schemes Count\n';
        
        const depts = {};
        policyStats.forEach(item => {
            const name = item._id || 'General';
            depts[name] = { policies: item.total, schemes: 0 };
        });

        schemeStats.forEach(item => {
            const name = item._id || 'General';
            if (!depts[name]) depts[name] = { policies: 0, schemes: 0 };
            depts[name].schemes = item.total;
        });

        Object.entries(depts).forEach(([dept, data]) => {
            content += `"${dept}",${data.policies},${data.schemes}\n`;
        });

    } else if (template === 'Policy Compliance') {
        const query = { ...dateQuery };
        if (filters.department && filters.department !== 'all') {
            query.department = new RegExp(filters.department, 'i');
        }
        if (filters.category && filters.category !== 'all') {
            query.category = filters.category;
        }

        const policies = await Policy.find(query).populate('creator', 'fullName email');

        content += 'Policy Compliance Audit Report\n';
        content += `Filters: Department=${filters.department}, Category=${filters.category}\n`;
        content += `Generated At: ${new Date().toLocaleString()}\n`;
        content += '=======================================\n\n';
        content += 'Policy ID,Title,Department,Category,Status,Creator\n';

        policies.forEach(p => {
            content += `"${p._id}","${p.title}","${p.department}","${p.category}","${p.status}","${p.creator?.fullName || 'N/A'}"\n`;
        });

    } else if (template === 'Citizen Engagement') {
        const apps = await Application.find(dateQuery)
            .populate('applicant', 'fullName email state district')
            .populate('scheme', 'title category');

        content += 'Citizen Scheme Engagement Report\n';
        content += `Generated At: ${new Date().toLocaleString()}\n`;
        content += '=======================================\n\n';
        content += 'Application ID,Citizen Name,Email,State,District,Scheme,Status,Submitted At\n';

        apps.forEach(a => {
            content += `"${a.applicationId}","${a.applicant?.fullName || 'N/A'}","${a.applicant?.email || 'N/A'}","${a.applicant?.state || 'N/A'}","${a.applicant?.district || 'N/A'}","${a.scheme?.title || 'N/A'}","${a.status}","${a.submittedAt?.toISOString() || 'N/A'}"\n`;
        });

    } else if (template === 'System Activity') {
        const [usersCount, policiesCount, schemesCount, appsCount] = await Promise.all([
            User.countDocuments(),
            Policy.countDocuments(),
            Scheme.countDocuments(),
            Application.countDocuments()
        ]);

        content += 'PolicyGPT Overall System Activity Report\n';
        content += `Generated At: ${new Date().toLocaleString()}\n`;
        content += '=======================================\n\n';
        content += 'Metric,Value\n';
        content += `Total Registered Users,${usersCount}\n`;
        content += `Total Policies Indexed,${policiesCount}\n`;
        content += `Total Schemes Configured,${schemesCount}\n`;
        content += `Total Applications Submitted,${appsCount}\n`;
    }

    return content;
};

/**
 * @desc Generate and export a custom report instantly
 * @route POST /api/reports/export
 * @access Private (Officials only)
 */
const exportReport = async (req, res, next) => {
    try {
        const { name, dateRange, department, category, format, template } = req.body;
        const author = req.user.id;

        const reportId = await generateUniqueReportId();
        const reportName = name || `${template} - ${new Date().toLocaleDateString('en-GB')}`;

        // Ensure exports directory exists
        const exportsDir = path.resolve(__dirname, '../exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }

        // Initialize Processing report record in DB
        const newReport = new Report({
            reportId,
            name: reportName,
            department: department === 'all' ? 'All Departments' : department,
            author,
            format,
            status: 'Processing',
            statusType: 'processing',
            filters: { dateRange, category, department, template }
        });

        await newReport.save();

        // Compile content and write file
        const fileContent = await compileReportContent(template, { dateRange, category, department });
        const filename = `report-${reportId.replace('#', '')}.${format.toLowerCase()}`;
        const filePath = path.join(exportsDir, filename);

        fs.writeFileSync(filePath, fileContent);

        // Get file size
        const stats = fs.statSync(filePath);
        const fileSizeStr = `${(stats.size / 1024).toFixed(1)} KB`;

        // Update Report record
        newReport.status = 'Complete';
        newReport.statusType = 'success';
        newReport.fileSize = fileSizeStr;
        newReport.fileUrl = `/api/reports/download/${newReport._id}`;
        await newReport.save();

        const populatedReport = await Report.findById(newReport._id)
            .populate('author', 'fullName email role');

        res.status(201).json({
            success: true,
            message: 'Report exported successfully',
            report: populatedReport
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Create a recurring report schedule
 * @route POST /api/reports/schedule
 * @access Private (Officials only)
 */
const scheduleReport = async (req, res, next) => {
    try {
        const { reportTitle, frequency, time, department } = req.body;
        const author = req.user.id;

        const reportId = await generateUniqueReportId();

        const newSchedule = new Report({
            reportId,
            name: reportTitle,
            department,
            author,
            format: 'PDF', // Default format for scheduled reports
            status: 'Complete',
            statusType: 'success',
            isScheduled: true,
            frequency,
            executionTime: time,
            filters: {
                dateRange: '30d',
                category: 'all',
                department: department.toLowerCase().includes('all') ? 'all' : department,
                template: 'Department Performance'
            }
        });

        await newSchedule.save();

        const populatedSchedule = await Report.findById(newSchedule._id)
            .populate('author', 'fullName email role');

        res.status(201).json({
            success: true,
            message: 'Automated report schedule created successfully',
            schedule: populatedSchedule
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get list of recent generated reports
 * @route GET /api/reports
 * @access Private (Officials only)
 */
const getReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ isScheduled: false })
            .populate('author', 'fullName email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            reports
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get list of scheduled automated reports
 * @route GET /api/reports/schedules
 * @access Private (Officials only)
 */
const getSchedules = async (req, res, next) => {
    try {
        const schedules = await Report.find({ isScheduled: true })
            .populate('author', 'fullName email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            schedules
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Delete/Cancel a report schedule
 * @route DELETE /api/reports/schedules/:id
 * @access Private (Officials only)
 */
const deleteSchedule = async (req, res, next) => {
    try {
        const schedule = await Report.findOneAndDelete({ _id: req.params.id, isScheduled: true });
        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: 'Schedule not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Report schedule deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Download a physically generated report file
 * @route GET /api/reports/download/:id
 * @access Private (Officials only)
 */
const downloadReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report || report.isScheduled) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        const filename = `report-${report.reportId.replace('#', '')}.${report.format.toLowerCase()}`;
        const filePath = path.resolve(__dirname, '../exports', filename);

        if (fs.existsSync(filePath)) {
            res.download(filePath, `${report.name.replace(/\s+/g, '_')}.${report.format.toLowerCase()}`);
        } else {
            res.status(404).json({
                success: false,
                message: 'Report file not found on disk'
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    exportReport,
    scheduleReport,
    getReports,
    getSchedules,
    deleteSchedule,
    downloadReport
};
