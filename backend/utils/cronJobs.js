const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

const startCronJobs = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running task due date check...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0));
    const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999));

    try {
      const tasks = await Task.find({
        dueDate: {
          $gte: tomorrowStart,
          $lte: tomorrowEnd,
        },
        status: { $ne: 'Completed' },
      }).populate('user', 'name email');

      for (const task of tasks) {
        if (task.user && task.user.email) {
          await sendEmail({
            email: task.user.email,
            subject: 'Task Due Tomorrow',
            message: `Hello ${task.user.name},\n\nYour task "${task.title}" is due tomorrow (${task.dueDate.toDateString()}).\n\nPlease make sure to complete it on time!`,
            html: `<h1>Task Reminder</h1><p>Hello ${task.user.name},</p><p>Your task <strong>${task.title}</strong> is due tomorrow.</p><p>Status: ${task.status}</p>`,
          });
        }
      }
      console.log(`Sent ${tasks.length} reminders.`);
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};

module.exports = startCronJobs;
