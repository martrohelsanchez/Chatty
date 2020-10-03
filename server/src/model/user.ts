import mongoose, {Schema, model} from 'mongoose';

export interface IUserSchema extends mongoose.Document {
    username: string,
    password: string,
    profile_pic: string,
    header?: string,
    bio?: string,
};

const userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    profile_pic: {type: String},
    header: {type: String},
    bio: {type: String},
});

export default model<IUserSchema>('User', userSchema);