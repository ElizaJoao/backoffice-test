const { User } = require('../models/User');
const { Company } = require('../models/Company');
const { Approval } = require('../models/Approval');
const { Op } = require('sequelize');

exports.getStatistics = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.count();
    const totalCompanies = await Company.count();
    const pendingApprovals = await Approval.count({
      where: { status: 'pending' }
    });

    // Get active/inactive users
    const activeUsers = await User.count({
      where: { status: 'active' }
    });
    const inactiveUsers = await User.count({
      where: { status: 'inactive' }
    });

    // Get users by role
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    const usersByRoleFormatted = usersByRole.map(item => ({
      role: item.role,
      count: parseInt(item.dataValues.count)
    }));

    // Get approvals by status
    const approvalsByStatus = await Approval.findAll({
      attributes: [
        'status',
        [Approval.sequelize.fn('COUNT', Approval.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const approvalsByStatusFormatted = approvalsByStatus.map(item => ({
      status: item.status,
      count: parseInt(item.dataValues.count)
    }));

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentApprovals = await Approval.findAll({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      attributes: [
        [Approval.sequelize.fn('DATE', Approval.sequelize.col('createdAt')), 'date'],
        [Approval.sequelize.fn('COUNT', Approval.sequelize.col('id')), 'count']
      ],
      group: [Approval.sequelize.fn('DATE', Approval.sequelize.col('createdAt'))],
      order: [[Approval.sequelize.fn('DATE', Approval.sequelize.col('createdAt')), 'ASC']]
    });

    // Fill in missing dates with 0 count
    const recentActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const existing = recentApprovals.find(item =>
        item.dataValues.date === dateStr
      );

      recentActivity.push({
        date: dateStr,
        count: existing ? parseInt(existing.dataValues.count) : 0
      });
    }

    const statistics = {
      totalUsers,
      totalCompanies,
      pendingApprovals,
      activeUsers,
      inactiveUsers,
      usersByRole: usersByRoleFormatted,
      approvalsByStatus: approvalsByStatusFormatted,
      recentActivity
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};
