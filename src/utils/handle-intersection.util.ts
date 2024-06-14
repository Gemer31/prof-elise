export function handleInView(
  v: boolean,
  styleClass: string,
  delay?: number
): string {
  return `${v ? styleClass : 'invisible'} ${delay ? `animate__delay-${delay}ms` : ''}`;
}
