export function transformPhoneUtil(value: string): string {
  return value
    .replaceAll(' ', '')
    .replaceAll('-', '')
    .replaceAll('(', '')
    .replaceAll(')', '');
}
