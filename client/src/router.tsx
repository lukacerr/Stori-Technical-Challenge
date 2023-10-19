import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import IndexPage from './pages/index.page';
import AdminPage from './pages/admin/admin.page';
import UnsubscribePage from './pages/unsubscribe.page';
import IndexLayout from './layouts/index.layout';
import AboutPage from './pages/about.page';
import NewsPage from './pages/news.page';
import AdminLayout from './layouts/admin.layout';

export default function RouterWrapper() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: '*',
          element: (
            <IndexLayout>
              <IndexPage />
            </IndexLayout>
          ),
        },
        {
          path: 'unsubscribe',
          element: (
            <IndexLayout>
              <UnsubscribePage />
            </IndexLayout>
          ),
        },
        {
          path: 'about',
          element: (
            <IndexLayout>
              <AboutPage />
            </IndexLayout>
          ),
        },
        {
          path: 'news',
          element: (
            <IndexLayout>
              <NewsPage />
            </IndexLayout>
          ),
        },
        {
          path: 'admin',
          element: (
            <AdminLayout>
              <AdminPage />
            </AdminLayout>
          ),
        },
      ])}
    />
  );
}
