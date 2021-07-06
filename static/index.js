import 'regenerator-runtime/runtime'
import Router from '../src/utils/router'
import ChangePassword from '../src/pages/change_password/change_password'
import Chat from '../src/pages/chat/chat'
import Chats from '../src/pages/chats/chats'
import Login from '../src/pages/login/login'
import NotFound from '../src/pages/notFound/notFound'
import Oops from '../src/pages/oops/oops'
import Profile from '../src/pages/profile/profile'
import ProfileEdit from '../src/pages/profile_edit/profile_edit'
import Signup from '../src/pages/signup/signup'
import '../src/general.less'

Router
  .use('/not_found', NotFound)
  .use('/change_password', ChangePassword)
  .use('/chats', Chats)
  .use('/chat', Chat)
  .use('/oops', Oops)
  .use('/profile_edit', ProfileEdit)
  .use('/profile', Profile)
  .use('/signup', Signup)
  .use('/', Login)
  .start();
