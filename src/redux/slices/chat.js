import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { getEmployerContacts, getEmployerConversations, getConversationParticipants, getConversationMessages, createMessage } from '../../api/staffwanted-api';
//
import { dispatch } from '../store';

const _ = require('lodash');

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

const formatContacts = async (contacts, employer_id) => {
  const _contacts = _.map(contacts, contact => ({
    id: contact.id,
    name: `${contact.attributes.first_name} ${contact.attributes.last_name}`,
    username: contact.attributes.first_name,
    avatar: contact.attributes.avatar_url,
    address: contact.attributes.location,
    phone: contact.attributes.phone_number,
    email: contact.attributes.email,
    lastActivity: new Date(),
    status: 'online',
    conversation_key: contact.attributes.conversations.length !== 0 ? _.find(contact.attributes.conversations, item => item.employer.id === parseInt(employer_id, 10)) : null,
  }));
  return _contacts;
}

const formatContact = async (contact) => {
  const _contact = {
    id: contact.id,
    name: `${contact.attributes.first_name} ${contact.attributes.last_name}`,
    username: contact.attributes.first_name,
    avatar: contact.attributes.avatar_url,
    address: contact.attributes.location,
    phone: contact.attributes.phone_number,
    email: contact.attributes.email,
    lastActivity: new Date(),
    status: 'online',
  };
  return _contact;
}

const formatEmployer = async (contact) => {
  const _contact = {
    id: contact.id,
    name: contact.attributes.company_name,
    username: contact.attributes.company_name,
    avatar: contact.attributes.company_avatar_url,
    address: contact.attributes.company_location,
    phone: contact.attributes.company_number,
    email: contact.attributes.company_email,
    lastActivity: new Date(),
    status: 'online',
  };
  return _contact;
}

const initialState = {
  isLoading: false,
  error: null,
  contacts: { byId: {}, allIds: [] },
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,
  participants: [],
  recipients: [],
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONTACT SSUCCESS
    getContactsSuccess(state, action) {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts);
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;

      state.conversations.byId = objFromArray(conversations);
      state.conversations.allIds = Object.keys(state.conversations.byId);
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        state.conversations.byId[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
        if (!state.conversations.allIds.includes(conversation.id)) {
          state.conversations.allIds.push(conversation.id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const conversation = action.payload;
      const { conversationId, messageId, message, contentType, attachments, createdAt, senderId, senderType } = conversation;

      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        senderId,
        senderType,
      };
      
      state.conversations.byId[conversationId].messages.push(newMessage);
    },

    onRecieveMessage(state, action) {
      const conversation = action.payload;
      const { conversationId, messageId, message, contentType, attachments, createdAt, senderId, senderType } = conversation;
      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        senderId,
        senderType,
      };

      state.conversations.byId[conversationId].messages.push(newMessage);
    },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { addRecipients, onSendMessage, resetActiveConversation, onRecieveMessage } = slice.actions;

// ----------------------------------------------------------------------

export function getContacts(employer_id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await getEmployerContacts(employer_id);
      const contacts = await formatContacts(data, employer_id);
      dispatch(slice.actions.getContactsSuccess(contacts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversations(employer_id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const { data } = await getEmployerConversations(employer_id);
      let conversations = [];
      console.log('getConversations', data.length);
      for (let i = 0; i < data.length; i++)  {
        
        const item = data[i];
        
          const participants = []
          const employee = await formatContact(item.attributes.employee.data);
          employee.type = 'employee';
          participants.push(employee);
          const employer = await formatEmployer(item.attributes.employer.data);
          employer.type = 'employer';
          participants.push(employer);

          let messages = [];

          if (item.attributes.messages.data.length !== 0) {
            messages = _.map(item.attributes.messages.data, message => ({
              id: message.attributes.message_id,
              body: message.attributes.body,
              contentType: message.attributes.content_type,
              attachments: [],
              createdAt: message.attributes.createdAt,
              senderId: message.attributes.sender_id,
              senderType: message.attributes.sender_type,
            }));
          }

          const conversation = {
            id: item.id,
            messages,
            participants,
            unreadCount: 0,
            type: item.attributes.type,
          };

          console.log('conversation', conversation);
          conversations.push(conversation);
        
      }
      console.log('conversations', conversations);
      dispatch(slice.actions.getConversationsSuccess(conversations));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      
      const { data } = await getConversationMessages(conversationKey);
      console.log('getConversation', data);

      const participants = []
      const employee = await formatContact(data.attributes.employee.data);
      employee.type = 'employee';
      participants.push(employee);
      const employer = await formatEmployer(data.attributes.employer.data);
      employer.type = 'employer';
      participants.push(employer);
      let messages = [];
      // const newMessage = {
      //   id: messageId,
      //   body: message,
      //   contentType,
      //   attachments,
      //   createdAt,
      //   senderId,
      //   senderType,
      // };
      if (data.attributes.messages.data.length !== 0) {
        messages = _.map(data.attributes.messages.data, message => ({
          id: message.attributes.message_id,
          body: message.attributes.body,
          contentType: message.attributes.content_type,
          attachments: [],
          createdAt: message.attributes.createdAt,
          senderId: message.attributes.sender_id,
          senderType: message.attributes.sender_type,
        }));
      }

      console.log('messages', messages);
      const conversation = {
        id: data.id,
        messages,
        participants,
        unreadCount: 0,
        type: '',
      };
      console.log('conversation', conversation);
      dispatch(slice.actions.getConversationSuccess(conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get('/api/chat/conversation/mark-as-seen', {
        params: { conversationId },
      });
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const {data} =  await getConversationParticipants(conversationKey);
      const participants = []
      const employee = await formatContact(data.attributes.employee.data);
      participants.push(employee);
      const employer = await formatEmployer(data.attributes.employer.data);
      participants.push(employer);
      dispatch(slice.actions.getParticipantsSuccess(participants));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
