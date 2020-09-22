import mongoose, {Schema, model} from 'mongoose';

interface IUserSchema extends mongoose.Document {
    username: string,
    password: string
};

const userSchema = new Schema({
    username: {type: String},
    password: {type: String}
});

export default model<IUserSchema>('User', userSchema);