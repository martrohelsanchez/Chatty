import {Schema, model, Document} from 'mongoose';

export interface ILastSeen extends Document {
    user_id: string,
    last_seen: {
        [key: string]: number
    }
}

const lastSeenSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId},
    last_seen: {type: Map, of: Number}
});

export default model<ILastSeen>('LastSeen', lastSeenSchema);