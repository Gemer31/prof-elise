import { CLIENT_ID } from '@/app/constants';

export function getClientId(): string {
  return document?.cookie
    ?.split(';')
    ?.find(item => item.includes(CLIENT_ID))
    ?.split('=')?.[1];
}