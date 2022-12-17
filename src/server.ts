import App from '@/app';
import AuthRoute from '@packages/auth/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import VerifyRoute from '@packages/verify/verify.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new VerifyRoute()]);

app.listen();
