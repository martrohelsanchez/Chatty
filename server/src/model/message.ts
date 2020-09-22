import {Schema, model, Document} from "mongoose";

interface IMessageSchema extends Document {
    sender: string;
    message_body: string;
    date_sent: number;
    conversation_id: string;
    is_delivered: boolean;
}

const messageSchema = new Schema({
    _id: {type: Schema.Types.ObjectId},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    message_body: {type: String},
    date_sent: {type: Number},
    conversation_id: {type: Schema.Types.ObjectId, ref: 'Conversation'},
    is_delivered: {type: Boolean}
});

export default model<IMessageSchema>('Message', messageSchema);