// import { IProduct, IViewedRecently } from '@/app/models';
// import { collection, getDocs, query, where } from '@firebase/firestore';
// import { db } from '@/app/lib/firebase-config';
// import { FirestoreCollections } from '@/app/enums';
// import { docsToData } from '@/utils/firebase.util';
//
// export async function GET(request: Request) {
//   const body: { message: string } = await request.json();
//   try {
//     let viewedRecently: IViewedRecently[] = [];
//     const viewedRecentlyProductsIds: string[] = client?.viewedRecently
//       ? Object.keys(client.viewedRecently)
//       : [];
//     if (viewedRecentlyProductsIds.length) {
//       const viewedRecentlyQuerySnapshot = await getDocs(query(
//         collection(db, FirestoreCollections.PRODUCTS),
//         where('id', 'in', viewedRecentlyProductsIds)
//         // orderBy('time', 'desc') ??
//       ));
//       const viewedRecentlyProducts = docsToData<IProduct>(viewedRecentlyQuerySnapshot.docs);
//       viewedRecently = viewedRecentlyProducts.map(product => {
//         const serializedProduct = {...product};
//         serializedProduct.categoryId = product.categoryRef.id;
//         delete serializedProduct['categoryRef'];
//         return {
//           time: client.viewedRecently[product.id].time,
//           product: serializedProduct
//         };
//       });
//     }
//     return new Response(`{ message: 'success'}`, {status: 200});
//   } catch (err) {
//     return new Response(`{ message: 'error'}`, {status: 500});
//   }
// }