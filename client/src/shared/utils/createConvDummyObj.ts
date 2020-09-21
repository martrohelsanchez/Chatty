import uniqid from 'uniqid';

import {UserInfo} from "redux/actions/userInfoActions";
import {User, ConvDecoy} from "shared/types/dbSchema";

const createConvDummyObj = (
  searchedUser: (User | UserInfo)[]
): ConvDecoy => {
  return {
    _id: uniqid() as string,
    convHasCreated: false,
    is_group_chat: false,
    members: searchedUser.map((user) =>
      "userId" in user
        ? {
            ...user,
            _id: user.userId,
          }
        : user
    ),
    conversation_pic: "sfasd", //refractor pag gagawin na yung images
  };
};

export default createConvDummyObj;