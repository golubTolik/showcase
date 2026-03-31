import { createInertiaApp } from '@inertiajs/react';

// import { PageProps } from './types'; // путь к вашему файлу типов

// declare module '@inertiajs/react' {
//     export interface PageProps extends InertiaPageProps, PageProps {}
// }

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
});
