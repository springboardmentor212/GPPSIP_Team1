const User = require('../models/user.model');
const Application = require('../models/application.model');
const Policy = require('../models/policy.model');
const Scheme = require('../models/scheme.model');
const Audit = require('../models/audit.model');
const Settings = require('../models/settings.model');
const { logAudit } = require('../utils/audit');

/**
 * @desc Get list of all users
 * @route GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const { q, role } = req.query;
    const filter = {};

    if (role && role !== 'All') {
      filter.role = role;
    }

    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Toggle user active status
 * @route PATCH /api/admin/users/:id/status
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Safeguard: Do not deactivate the last active Super Admin
    if (user.role === 'Super Admin' && user.isActive) {
      const activeSuperAdmins = await User.countDocuments({ role: 'Super Admin', isActive: true });
      if (activeSuperAdmins <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active Super Admin account.'
        });
      }
    }

    user.isActive = !user.isActive;
    await user.save();

    await logAudit(
      user.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      `User ${user.email} status toggled to ${user.isActive ? 'active' : 'inactive'}`,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a user account
 * @route DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Safeguard: Do not delete the last Super Admin
    if (user.role === 'Super Admin') {
      const superAdminsCount = await User.countDocuments({ role: 'Super Admin' });
      if (superAdminsCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last Super Admin account.'
        });
      }
    }

    await User.findByIdAndDelete(id);

    await logAudit(
      'USER_DELETED',
      `User ${user.email} deleted permanently`,
      req.user.id
    );

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all citizen applications
 * @route GET /api/admin/applications
 */
const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'fullName email mobile state district')
      .populate('scheme', 'title category description')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all system audit logs
 * @route GET /api/admin/audit-logs
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await Audit.find()
      .populate('performedBy', 'fullName email role')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get system-wide stats and KPIs
 * @route GET /api/admin/stats
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOfficials,
      totalPolicies,
      totalSchemes,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    ] = await Promise.all([
      User.countDocuments({ role: 'Citizen' }),
      User.countDocuments({ role: 'Gov. Official' }),
      Policy.countDocuments(),
      Scheme.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Pending' }),
      Application.countDocuments({ status: 'Approved' }),
      Application.countDocuments({ status: 'Rejected' })
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOfficials,
        totalPolicies,
        totalSchemes,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get system settings
 * @route GET /api/admin/settings
 */
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update system settings
 * @route POST /api/admin/settings
 */
const updateSettings = async (req, res, next) => {
  try {
    const { platformName, maintenanceMode, maxLoginAttempts, jwtExpiryDays, allowPublicRegistrations } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    if (platformName !== undefined) settings.platformName = platformName;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (maxLoginAttempts !== undefined) settings.maxLoginAttempts = maxLoginAttempts;
    if (jwtExpiryDays !== undefined) settings.jwtExpiryDays = jwtExpiryDays;
    if (allowPublicRegistrations !== undefined) settings.allowPublicRegistrations = allowPublicRegistrations;

    await settings.save();

    await logAudit(
      'SETTINGS_UPDATED',
      `System settings updated: ${JSON.stringify(req.body)}`,
      req.user.id
    );

    return res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  toggleUserStatus,
  deleteUser,
  getApplications,
  getAuditLogs,
  getStats,
  getSettings,
  updateSettings
};
