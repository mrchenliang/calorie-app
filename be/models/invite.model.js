import mongoose from "mongoose";

const InviteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String },
    friendOf: { type: String, required: true },
  },
  { timestamps: true, strictQuery: true }
);

const Invite = mongoose.model("Invite", InviteSchema);

export default Invite;
