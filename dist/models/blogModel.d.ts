import mongoose, { Document, Types } from "mongoose";
export interface IComment {
    _id?: Types.ObjectId;
    name: string;
    email?: string;
    text: string;
    ip?: string;
    createdAt?: Date;
}
export interface IBlog extends Document {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    coverImagePublicId?: string;
    tags: string[];
    author: Types.ObjectId;
    likes: string[];
    likeCount: number;
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}
declare const blogModel: mongoose.Model<IBlog, {}, {}, {}, Document<unknown, {}, IBlog, {}, mongoose.DefaultSchemaOptions> & IBlog & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlog>;
export default blogModel;
//# sourceMappingURL=blogModel.d.ts.map