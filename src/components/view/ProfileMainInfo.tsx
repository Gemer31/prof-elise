'use client';

import { IUser } from '@/app/models';
import { ChangeGeneralUserInfo } from '@/components/view/forms/ChangeGeneralUserInfo';

interface IProfileMainInfoProps {
  userServer: IUser<string, string[]>;
}

export function ProfileMainInfo({userServer}: IProfileMainInfoProps) {

  return <>
    <ChangeGeneralUserInfo userServer={userServer}/>
    {/*<ChangeEmailForm userServer={userServer}/>*/}
  </>;
}