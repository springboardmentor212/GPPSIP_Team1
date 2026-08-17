const Feedback = require('../models/feedback.model');
const User = require('../models/user.model');

/**
 * Helper to map category tag to department
 */
const mapCategoryToDepartment = (category) => {
    switch (category) {
        case 'IT & COMM':
            return 'Min. of IT & Comm';
        case 'EDUCATION':
            return 'Ministry of Education';
        case 'AGRI':
            return 'Department of Agriculture';
        case 'HEALTH':
            return 'Ministry of Health';
        default:
            return 'General Administration';
    }
};

/**
 * Helper to generate a unique ticket ID in the format #TKT-XXXX
 */
const generateUniqueTicketId = async () => {
    let isUnique = false;
    let ticketId = '';
    while (!isUnique) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        ticketId = `#TKT-${randomNum}`;
        const existing = await Feedback.findOne({ ticketId });
        if (!existing) {
            isUnique = true;
        }
    }
    return ticketId;
};

/**
 * @desc Create a new support/feedback ticket
 * @route POST /api/feedback
 * @access Private
 */
const createFeedback = async (req, res, next) => {
    try {
        const { title, description, categoryTag, priority } = req.body;
        const author = req.user.id;

        const ticketId = await generateUniqueTicketId();
        const assignedDepartment = mapCategoryToDepartment(categoryTag);

        const newFeedback = new Feedback({
            ticketId,
            title,
            description,
            categoryTag: categoryTag.toUpperCase(),
            priority: (priority || 'NORMAL').toUpperCase(),
            author,
            assignedDepartment
        });

        await newFeedback.save();

        const populatedFeedback = await Feedback.findById(newFeedback._id)
            .populate('author', 'fullName email role');

        res.status(201).json({
            success: true,
            message: 'Feedback ticket created successfully',
            ticket: populatedFeedback
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get all tickets (with role-based boundaries and official filters)
 * @route GET /api/feedback
 * @access Private
 */
const getFeedback = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const filter = {};

        // Citizens and Researcher/NGOs can only view their own tickets
        if (userRole === 'Citizen' || userRole === 'Researcher/NGO') {
            filter.author = userId;
        } else {
            // Officials can filter by status, priority, categoryTag, search
            if (req.query.status) {
                let statusVal = req.query.status.toUpperCase().replace('_', ' ');
                filter.status = statusVal;
            }
            if (req.query.priority) {
                filter.priority = req.query.priority.toUpperCase();
            }
            if (req.query.categoryTag) {
                filter.categoryTag = req.query.categoryTag.toUpperCase();
            }
            if (req.query.search) {
                const queryRegex = new RegExp(req.query.search, 'i');
                const matchingUsers = await User.find({ fullName: queryRegex }).select('_id');
                const matchingUserIds = matchingUsers.map(u => u._id);

                filter.$or = [
                    { title: queryRegex },
                    { ticketId: queryRegex },
                    { author: { $in: matchingUserIds } }
                ];
            }
        }

        const tickets = await Feedback.find(filter)
            .populate('author', 'fullName email role')
            .populate('responses.sender', 'fullName role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tickets
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get a single support ticket by ID (with authorization bounds)
 * @route GET /api/feedback/:id
 * @access Private
 */
const getFeedbackById = async (req, res, next) => {
    try {
        const ticketId = req.params.id;
        const ticket = await Feedback.findById(ticketId)
            .populate('author', 'fullName email role')
            .populate('responses.sender', 'fullName role');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Citizens and Researcher/NGOs can only view their own tickets
        if ((req.user.role === 'Citizen' || req.user.role === 'Researcher/NGO') && ticket.author._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to view this ticket'
            });
        }

        res.status(200).json({
            success: true,
            ticket
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Add an official response/reply message to a ticket
 * @route POST /api/feedback/:id/responses
 * @access Private (Officials only)
 */
const addResponse = async (req, res, next) => {
    try {
        const ticketId = req.params.id;
        const { message } = req.body;
        const sender = req.user.id;

        const ticket = await Feedback.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        ticket.responses.push({ message, sender });
        
        // Auto-transition to IN PROGRESS if currently OPEN
        if (ticket.status === 'OPEN') {
            ticket.status = 'IN PROGRESS';
        }

        await ticket.save();

        const updatedTicket = await Feedback.findById(ticketId)
            .populate('author', 'fullName email role')
            .populate('responses.sender', 'fullName role');

        res.status(200).json({
            success: true,
            message: 'Response added successfully',
            ticket: updatedTicket
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Manually update ticket status (e.g. resolve it)
 * @route PATCH /api/feedback/:id/status
 * @access Private (Officials only)
 */
const updateStatus = async (req, res, next) => {
    try {
        const ticketId = req.params.id;
        const { status } = req.body;

        const ticket = await Feedback.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        ticket.status = status.toUpperCase();
        await ticket.save();

        const updatedTicket = await Feedback.findById(ticketId)
            .populate('author', 'fullName email role')
            .populate('responses.sender', 'fullName role');

        res.status(200).json({
            success: true,
            message: `Ticket status updated to ${status}`,
            ticket: updatedTicket
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFeedback,
    getFeedback,
    getFeedbackById,
    addResponse,
    updateStatus
};
