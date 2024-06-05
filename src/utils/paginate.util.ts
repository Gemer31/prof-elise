export function getPagesCount(itemsLength: number, limit: number): number {
  return itemsLength ? Math.ceil(itemsLength / limit) : 0;
}