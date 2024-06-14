'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateFavourites() {
  revalidateTag('favourites');
}

export async function revalidateViewedRecently() {
  revalidateTag('viewedRecently');
}

export async function revalidateOrders() {
  revalidateTag('orders');
}
