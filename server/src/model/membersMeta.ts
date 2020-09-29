import {Schema, model, Document} from 'mongoose';

interface IMembersMetaSchema extends Document {
    conversation_id: string;
    members_meta: {
        user_id: string;
        last_seen: number;
    }[];
}

const membersMetaSchema = new Schema({
    conversation_id: {type: Schema.Types.ObjectId},
    members_meta: [
        {
            user_id: {type: Schema.Types.ObjectId},
            last_seen: {type: Number}
        }
    ]
});

export default model<IMembersMetaSchema>('MembersMeta', membersMetaSchema);