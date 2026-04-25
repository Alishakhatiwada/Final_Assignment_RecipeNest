const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content
    });

    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all users who have exchanged messages with current user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const contactIds = new Set();
    messages.forEach(m => {
      if (m.sender.toString() !== userId) contactIds.add(m.sender.toString());
      if (m.receiver.toString() !== userId) contactIds.add(m.receiver.toString());
    });

    const contacts = await User.find({ _id: { $in: Array.from(contactIds) } })
      .select('username fullName avatar role');

    // Attach last message to each contact
    const conversations = contacts.map(contact => {
      const lastMsg = messages.find(m => 
        (m.sender.toString() === contact._id.toString() || m.receiver.toString() === contact._id.toString())
      );
      return {
        contact,
        lastMessage: lastMsg.content,
        lastMessageTime: lastMsg.createdAt,
        unread: !lastMsg.read && lastMsg.receiver.toString() === userId
      };
    });

    res.json(conversations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.contactId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: contactId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
