const Notification = require('../models/notification.model');

/**
 * @desc Get notifications for logged-in user
 * @route GET /api/notifications
 * @access Private
 */
const getNotifications = async (req, res, next) => {
    try {
        const recipient = req.user.id;
        const filter = { recipient };

        if (req.query && req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query && req.query.unread !== undefined) {
            filter.unread = req.query.unread;
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Mark a specific notification as read
 * @route PATCH /api/notifications/:id/read
 * @access Private
 */
const markAsRead = async (req, res, next) => {
    try {
        const recipient = req.user.id;
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient },
            { unread: false },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Mark all notifications for the user as read
 * @route PATCH /api/notifications/read-all
 * @access Private
 */
const markAllAsRead = async (req, res, next) => {
    try {
        const recipient = req.user.id;

        await Notification.updateMany(
            { recipient, unread: true },
            { unread: false }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Delete / Dismiss a specific notification
 * @route DELETE /api/notifications/:id
 * @access Private
 */
const deleteNotification = async (req, res, next) => {
    try {
        const recipient = req.user.id;
        const notificationId = req.params.id;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
