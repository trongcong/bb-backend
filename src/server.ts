import App from '@/app';
import AuthRoute from '@packages/auth/auth.route';
import IndexRoute from '@packages/index.route';
import UsersRoute from '@packages/users/users.route';
import VerifyRoute from '@packages/verify/verify.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new VerifyRoute()]);

app.listen();
