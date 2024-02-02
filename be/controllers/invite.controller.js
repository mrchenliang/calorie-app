import { generatePassword, generateToken } from "../middlewares/index.js";
import { addInviteToRepository, updateInviteInRepository } from "../repositories/invite.repository.js";

export const inviteFriend = async function (req, res, next) {
  try {
    const userId =  req.headers.decodedToken.userId;
    const payload = {
      ...req.body,
      friendOf: userId,
      password: generatePassword(),

    };
    const invite = await addInviteToRepository(
      { email: req.body.email },
      { ...payload }
    );
    const token = generateToken({ userId: invite._id, role: "user" });
    const invitedFriend = await updateInviteInRepository(
      { _id: invite._id },
      { token }
    );
    return res.status(200).json({
      status: 200,
      data: invitedFriend,
      message: "Invite sent successfully",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
