import {Schema, model, Document} from 'mongoose';

interface IMembersMetaSchema extends Document {
    conversation_id: string;
    user_id: string;
    last_seen: string;
}

const membersMetaSchema = new Schema({
    conversation_id: {type: Schema.Types.ObjectId, ref: 'Conversation'},
    user_id: {tyjpe: Schema.Types.ObjectId, ref: 'User'},
    last_seen: {type: Number},
});

export default model<IMembersMetaSchema>('MembersMeta', membersMetaSchema);