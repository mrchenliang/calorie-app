import Invite from "../models/invite.model.js";

export const addInviteToRepository = async function (query, payload) {
  try {
    const newInvite = await Invite.findOneAndUpdate(query, payload, {
      upsert: true,
      new: true,
    });
    if (newInvite) {
      if (newInvite._doc) {
        delete newInvite._doc["password"];
      } else {
        delete newInvite["password"];
      }
    }

    return newInvite;
  } catch (e) {
    console.log("e === ", e);
    throw Error("Error while adding an invite");
  }
};

export const updateInviteInRepository = async function (query, payload) {
  try {
    const updatedInvite = await Invite.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    ).lean();
    if (updatedInvite) {
      if (updatedInvite._doc) {
        delete updatedInvite._doc["password"];
        delete updatedInvite._doc["token"];
      } else {
        delete updatedInvite["password"];
        delete updatedInvite["token"];
      }
    }

    return updatedInvite;
  } catch (e) {
    console.log("e === ", e);
    throw Error("Error while updating an invite");
  }
};
