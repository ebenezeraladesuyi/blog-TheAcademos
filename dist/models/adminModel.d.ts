import mongoose, { Document } from "mongoose";
export type Role = "admin" | "superAdmin";
export interface IblogAdmin extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}
declare const blogAdminModel: mongoose.Model<IblogAdmin, {}, {}, {}, Document<unknown, {}, IblogAdmin, {}, mongoose.DefaultSchemaOptions> & IblogAdmin & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IblogAdmin>;
export default blogAdminModel;
//# sourceMappingURL=adminModel.d.ts.map