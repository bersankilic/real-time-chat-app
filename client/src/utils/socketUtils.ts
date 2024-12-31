export const createPrivateRoomName = (
  userNickname: string,
  friendNickname: string
) => {
  return [userNickname, friendNickname].sort().join("-");
};
