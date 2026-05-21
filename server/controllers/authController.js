const User = require('../models/User');

exports.syncUser = async (req, res) => {
  try {
    const { name, email, firebaseUid, avatar } = req.body;

    let user = await User.findOne({ firebaseUid });

    if (user) {
      // Update existing user info if needed
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      await user.save();
    } else {
      // Create new user
      user = new User({
        name,
        email,
        firebaseUid,
        avatar,
        role: 'User', // Default role
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
    try {
      const { name, avatar } = req.body;
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      await user.save();
  
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
