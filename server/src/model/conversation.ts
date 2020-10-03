import {Schema, model, Document} from "mongoose";

// const conversationSchema = new Schema({
//     _id: {type: Schema.Types.ObjectId},
//     group_name: {type: String},
//     is_group_chat: {type: Boolean},
//     members: [
//         {type: Schema.Types.ObjectId, ref: 'User'}
//     ],
//     conversation_pic: {type: String},
//     last_message: {
//         sender_id: {type: Schema.Types.ObjectId},
//         sender_username: {type: String},
//         message_body: {type: String},
//         date_sent: {type: Number},
//         is_delivered: {type: Boolean}
//     },
//     created_at: {type: Number},
//     last_updated: {type: Number},
//     members_meta: [
//         {
//             user_id: {type: Schema.Types.ObjectId, ref: 'User'},
//             last_seen: {type: Number},
//             delivered: {type: Boolean}
//         }
//     ]
// });

interface IConversationSchema extends Document {
  group_name?: string;
  is_group_chat: boolean;
  members: string[];
  conversation_pic: {
    [key: string]: string
  };
  last_message: string;
  created_at: number;
  last_updated: number;
  members_meta: string;
  members_username: string[];
  members_meta_id: string;
  conv_bio?: string;
} 

const conversationSchema = new Schema({
  _id: {type: Schema.Types.ObjectId},
  group_name: {type: String},
  is_group_chat: {type: Boolean},
  members: [
    {type: Schema.Types.ObjectId, ref: "User"}
  ],
  conversation_pic: {type: Map, of: String},
  last_message: {type: Schema.Types.ObjectId, ref: "Message"},
  created_at: {type: Number},
  last_updated: {type: Number},
  members_meta: {type: Schema.Types.ObjectId, ref: 'MembersMeta'},
  members_username: [String],
  members_meta_id: {type: Schema.Types.ObjectId},
  conv_bio: {type: String}
});

export default model<IConversationSchema>('Conversation', conversationSchema); 