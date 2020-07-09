const router = require('express').Router();

const chatController = require('../controller/chat');
const checkAuth = require('../middleware/check-auth');

router.post('/search', chatController.searchUsers);
router.get('/conversations', checkAuth, chatController.getConversations);
router.post('/conversations', checkAuth, chatController.createConversation);
router.get('/conversations/:conversationId/messages', checkAuth, chatController.getMessages);
router.post('/conversations/:conversationId/messages', checkAuth, chatController.sendMessage);


module.exports = router;