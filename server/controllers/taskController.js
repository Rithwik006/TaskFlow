const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      tags,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id,
    });
    await task.save();

    // Create notification if assigned to someone else
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        user: assignedTo,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: ${title}`,
        type: 'Task',
      });
      await notification.save();
      
      // Emit socket event if user is connected
      req.io.to(assignedTo.toString()).emit('notification', notification);
    }

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filters = {};
    if (req.user.role !== 'Admin') {
      filters.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    }

    const tasks = await Task.find(filters)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.status === 'Completed') {
      updates.completedAt = new Date();
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Notify assignment if changed
    if (updates.assignedTo && updates.assignedTo !== task.assignedTo?.toString()) {
        const notification = new Notification({
            user: updates.assignedTo,
            title: 'Task Reassigned',
            message: `You have been assigned the task: ${task.title}`,
            type: 'Task',
          });
          await notification.save();
          req.io.to(updates.assignedTo.toString()).emit('notification', notification);
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
