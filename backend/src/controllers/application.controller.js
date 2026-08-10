const crypto = require('crypto');
const Application = require('../models/application.model');
const Scheme = require('../models/scheme.model');

/**
 * @desc Create a new scheme application
 * @route POST /api/applications
 * @access Private (Citizen)
 */
const createApplication = async (req, res, next) => {
    try {
        const { schemeId } = req.body;
        const citizenId = req.user.id;

        // 1. Validate scheme exists
        const scheme = await Scheme.findById(schemeId);
        if (!scheme) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found'
            });
        }

        // 2. Prevent duplicate applications for same scheme by same citizen
        const existingApp = await Application.findOne({
            applicant: citizenId,
            scheme: schemeId
        });

        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this scheme. Duplicate applications are not allowed.'
            });
        }

        // 3. Generate unique application ID
        let applicationId;
        let isUnique = false;
        while (!isUnique) {
            const randomId = crypto.randomBytes(3).toString('hex').toUpperCase();
            applicationId = `APP-${randomId}`;
            const duplicate = await Application.findOne({ applicationId });
            if (!duplicate) {
                isUnique = true;
            }
        }

        // 4. Create and save application
        const application = new Application({
            applicant: citizenId,
            scheme: schemeId,
            applicationId,
            status: 'Pending'
        });

        await application.save();

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get applications submitted by logged-in citizen
 * @route GET /api/applications/my
 * @access Private (Citizen)
 */
const getMyApplications = async (req, res, next) => {
    try {
        const citizenId = req.user.id;
        const applications = await Application.find({ applicant: citizenId })
            .populate('scheme', 'title category department description')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get all applications for Official review (supports status filtering)
 * @route GET /api/applications/pending
 * @access Private (Gov. Official, Admin)
 */
const getPendingApplications = async (req, res, next) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status && status !== 'All') {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('applicant', 'fullName email mobile dob state district')
            .populate('scheme', 'title category department description')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get complete application details
 * @route GET /api/applications/:id
 * @access Private (Citizen, Gov. Official, Admin)
 */
const getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('applicant', 'fullName email mobile dob state district')
            .populate('scheme', 'title category department description');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Access control: Citizens can only view their own applications
        if (req.user.role === 'Citizen' && application.applicant._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You cannot access another citizen\'s application'
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Approve application (Pending -> Approved)
 * @route PATCH /api/applications/:id/approve
 * @access Private (Gov. Official, Admin)
 */
const approveApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot approve an application with status "${application.status}".`
            });
        }

        application.status = 'Approved';
        application.reviewedBy = req.user.id;
        application.reviewedAt = new Date();

        await application.save();

        // Log notification to console (as notification system is pending in backend)
        console.log(`[NOTIFICATION STUB] Application ${application.applicationId} APPROVED for user ${application.applicant}.`);

        res.status(200).json({
            success: true,
            message: 'Application approved successfully',
            application
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Reject application (Pending -> Rejected)
 * @route PATCH /api/applications/:id/reject
 * @access Private (Gov. Official, Admin)
 */
const rejectApplication = async (req, res, next) => {
    try {
        const { comments } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot reject an application with status "${application.status}".`
            });
        }

        application.status = 'Rejected';
        application.rejectionReason = comments;
        application.reviewedBy = req.user.id;
        application.reviewedAt = new Date();

        await application.save();

        // Log notification to console
        console.log(`[NOTIFICATION STUB] Application ${application.applicationId} REJECTED for user ${application.applicant}. Reason: ${comments}`);

        res.status(200).json({
            success: true,
            message: 'Application rejected successfully',
            application
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createApplication,
    getMyApplications,
    getPendingApplications,
    getApplicationById,
    approveApplication,
    rejectApplication
};
