import express from 'express';

const router = express.Router();

const chatController = require('../controller/chat');
const checkAuth = require('../middleware/check-auth');

router.get('/search', checkAuth, chatController.searchUsers);
router.get('/conversations', checkAuth, chatController.getConversations);
router.get('/conversations/:conversationId', checkAuth, chatController.getTheConversation);
router.get('/conversation', checkAuth, chatController.getOneConversation);
router.patch('/conversations/:conversationId/seen', checkAuth, chatController.updateSeen);
router.patch('/conversations/:conversationId/deliver', checkAuth, chatController.updateIsDelivered);
router.post('/conversations', checkAuth, chatController.createConversation);
router.get('/conversations/:conversationId/messages', checkAuth, chatController.getMessages);
router.post('/conversations/:conversationId/messages', checkAuth, chatController.sendMessage);
router.get('/conversations/:conversationId/members', checkAuth, chatController.getMembers);
router.get('/conversations/:conversationId/membersMeta', checkAuth, chatController.getMembersMeta);
router.delete('/conversations/:conversationId', checkAuth, chatController.deleteConversation);

export default router;