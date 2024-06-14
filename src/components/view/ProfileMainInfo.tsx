'use client';

import { IUserSerialized } from '@/app/models';
import { ChangeGeneralUserInfo } from '@/components/view/forms/ChangeGeneralUserInfo';

interface IProfileMainInfoProps {
  userServer: IUserSerialized;
}

export function ProfileMainInfo({ userServer }: IProfileMainInfoProps) {
  return (
    <>
      <ChangeGeneralUserInfo userServer={userServer} />
      {/* <ChangeEmailForm userServer={userServer}/> */}
    </>
  );
}
