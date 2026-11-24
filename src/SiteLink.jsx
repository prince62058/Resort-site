import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import { linkTo } from '../shared/content.js';
import { site } from './content.js';
export function Link({
  to,
  ...props
}) {
  return <RouterLink to={typeof to === 'string' ? linkTo(site, to) : to} {...props} />;
}
export function NavLink({
  to,
  ...props
}) {
  return <RouterNavLink to={typeof to === 'string' ? linkTo(site, to) : to} {...props} />;
}
