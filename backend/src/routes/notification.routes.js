const express = require('express');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notification.controller');
const identifyUser = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
    getNotificationsSchema,
    notificationIdSchema
} = require('../validations/notification.validation');

const notificationRouter = express.Router();

// Get notifications for logged-in user
notificationRouter.get('/', identifyUser, validate(getNotificationsSchema), getNotifications);

// Mark all notifications as read
notificationRouter.patch('/read-all', identifyUser, markAllAsRead);

// Mark specific notification as read
notificationRouter.patch('/:id/read', identifyUser, validate(notificationIdSchema), markAsRead);

// Delete/Dismiss specific notification
notificationRouter.delete('/:id', identifyUser, validate(notificationIdSchema), deleteNotification);

module.exports = notificationRouter;
