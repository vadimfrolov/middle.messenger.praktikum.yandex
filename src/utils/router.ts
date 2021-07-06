import Block from '../components/block/block';
import redirections from '../constants/redirections';
import AuthApi from '../api/authApi';
import { IRouteOptions, IPage } from './interfaces';
import { GlobalStore } from './store';

const PUBLIC_ROUTES = [
  '/not_found',
  '/oops',
  '/',
  '/signup',
];
class Route {
  _pathname: string;
  _blockClass: IPage;
  _block: Block | null;
  _props: IRouteOptions;

  constructor(pathname: string, view: IPage, props: IRouteOptions) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  render(): void {
    this._block = this._blockClass && new this._blockClass(this._props.rootQuery);
    this._block?.show();
  }
}

export class Router {
  static routes: Route[] = [];
  static history: History;
  static _currentRoute: Route | null;
  static _rootQuery = 'app';
  static __instance: Router;

  static use(pathname: string, block: IPage) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);

    return this;
  }

  static start() {
    Router.history = window.history;

    window.onpopstate = (event: PopStateEvent) => {
      this._onRoute((<Window>event?.currentTarget)?.location?.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  static async _onRoute(pathname: string) {
    if (!PUBLIC_ROUTES.includes(pathname)) {
      try {
        await new AuthApi().getUserInfo();
      } catch (err) {
        return this.go(redirections.LOGOUT);
      }
    }

    const route = this.getRoute(pathname);
    if (!route) {
      return this.go('/not_found');
    }

    GlobalStore.unsubscribeAll();

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  static go(pathname: string) {
    window.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  static back() {
    window.history.back();
  }

  static forward() {
    window.history.forward();
  }

  static getRoute(pathname: string) {
    return this.routes.find(route => route.match(pathname));
  }
}

export default Router;
