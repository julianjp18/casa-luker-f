import * as Paths from './paths';
import SignUp from '../components/Auth/SignUp';
import Products from '../components/Products';
import Transports from '../components/Transports';
import NewProduct from '../components/Products/NewProduct';
import NewTransport from '../components/Transports/NewTransport';
import ProductsStatistics from '../components/Products/Statistics';
import TransportsStatistics from '../components/Transports/Statistics';

export const authRoutes = [
  {
    title: 'Home',
    path: Paths.ROOT_PATH,
    exact: true,
    component: SignUp,
  },
  {
    title: 'SignUp',
    path: Paths.AUTH_SIGN_UP,
    exact: true,
    component: SignUp,
  },
  {
    title: 'Products list',
    path: Paths.PRODUCTS_LIST,
    exact: true,
    component: Products,
  },
  {
    title: 'Products new',
    path: Paths.NEW_PRODUCT,
    exact: true,
    component: NewProduct,
  },
  {
    title: 'Products statistics',
    path: Paths.PRODUCT_STATISTICS,
    exact: true,
    component: ProductsStatistics,
  },
  {
    title: 'Transports list',
    path: Paths.TRANSPORTS_LIST,
    exact: true,
    component: Transports,
  },
  {
    title: 'New vehicle',
    path: Paths.NEW_VEHICLE,
    exact: true,
    component: NewTransport,
  },
  {
    title: 'Transports statistics',
    path: Paths.TRANSPORTS_STATISTICS,
    exact: true,
    component: TransportsStatistics,
  },
  /*
  {
    title: 'Campaigns show',
    path: Paths.SHOW_CAMPAIGN(':id'),
    exact: true,
    component: ShowCampaign,
  },
  */
];

export const mainRoutes = [];
