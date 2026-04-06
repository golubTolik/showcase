export type * from './auth';
// import type { PageProps as InertiaPageProps } from '@inertiajs/core';

// export interface PageProps extends InertiaPageProps {
//     flash: {
//         success?: string;
//         error?: string;
//     };
//     // другие глобальные пропсы, если есть
// }
export interface Category {
  id: number;
  name: string;
  img: string;
  parent_id: number | null;
}
