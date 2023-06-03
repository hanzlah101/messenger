// "use client";

// import { FC } from "react";
// import { User } from "@prisma/client";
// import Image from "next/image";

// interface GroupAvatarProps {
//   users: User[];
// }

// const GroupAvatar: FC<GroupAvatarProps> = ({ users = [] }) => {
//   const slicedUsers = users?.slice(0, 3);

//   const positionMap = {
//     0: "top-0 left-[12px]",
//     1: "bottom-0",
//     2: "bottom-0 right-0",
//   };

//   return (
//     <div className="relative h-11 w-11">
//       {slicedUsers?.map((user, index) => (
//         <div
//           key={index}
//           className={`absolue inline-block rounded-full overflow-hidden h-[21px] w-[21px]
//           ${positionMap[index as keyof typeof positionMap]}`}
//         >
//           <Image
//             className="object-cover"
//             alt="group_avatar_iamge"
//             src={user?.image || "/images/placeholder.jpeg"}
//             fill
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GroupAvatar;

"use client";

import { FC } from "react";
import { User } from "@prisma/client";
import Image from "next/image";

interface GroupAvatarProps {
  users?: User[];
}

const GroupAvatar: FC<GroupAvatarProps> = ({ users = [] }) => {
  const slicedUsers = users.slice(0, 3);

  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px]
          ${positionMap[index as keyof typeof positionMap]}`}
        >
          <Image
            fill
            src={user?.image || "/images/placeholder.jpeg"}
            alt="Avatar"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default GroupAvatar;
