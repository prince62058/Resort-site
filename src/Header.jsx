import { t } from './content.js';
import { site } from './content.js';
import { resolveRoute } from '../shared/content.js';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link, NavLink } from './SiteLink.jsx';
import { ArrowUpRight, Leaf, MapPin, Phone, X } from 'lucide-react';
import './header.css';
import { Brand3D } from './Brand3D.jsx';
export default function Header({
  menu,
  setMenu,
  book
}) {
  const links = site.pages.filter(p => p.nav).map(p => ['/' + p.slug, p.name]);
  const {
    pathname
  } = useLocation();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 45);
  const header = useRef(null);
  const toggle = useRef(null);
  const route = resolveRoute(site, pathname);
  const hasHero = Boolean(route && !['rooms', 'posts'].includes(route.type) && !['legal', 'support', 'blog'].includes(route.item.template));
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1051px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMenu(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [setMenu]);
  useEffect(() => {
    if (!menu) return;
    const content = [...document.querySelectorAll('main, footer')];
    content.forEach(element => {
      element.inert = true;
    });
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setMenu(false);
        toggle.current?.focus();
      }
      if (event.key === 'Tab') {
        const items = [...header.current.querySelectorAll('a, button')].filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
        const first = items[0],
          last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      content.forEach(element => {
        element.inert = false;
      });
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menu, setMenu]);
  return <>
    <header ref={header} className={`site-header ${hasHero ? 'has-hero' : 'on-light'} ${scrolled ? 'is-scrolled' : ''} ${menu ? 'menu-is-open' : ''}`}>
      <div className="nav-utility">
        <span><MapPin size={12} />{t("Header.001", " MHOW, INDORE ")}<i /><span className="nav-utility-tagline">{t("Header.002", "YOUR OWN LITTLE ESCAPE")}</span></span>
        <a href={'tel:+' + site.settings.phoneDigits}><Phone size={11} /> {site.settings.phoneInternational} <ArrowUpRight size={12} /></a>
      </div>
      <div className="nav-inner">
        <Link to="/" className="brand nav-brand" aria-label="The Nature Nest home" onClick={() => setMenu(false)}>
          <Brand3D />
        </Link>
        <nav id="primary-navigation" aria-label="Main navigation" className={`site-nav ${menu ? 'open' : ''}`}>
          <div className="mobile-nav-intro"><Leaf size={19} />{t("Header.003", " A LITTLE CLOSER TO NATURE")}</div>
          {links.map(([to, label], index) => <NavLink key={to} to={to} end={to === '/'} className={({
            isActive
          }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setMenu(false)} style={{
            '--nav-index': index
          }}>
            <span className="nav-number" aria-hidden="true">0{index + 1}</span><span>{label}</span><ArrowUpRight className="mobile-nav-arrow" size={23} />
          </NavLink>)}
          <div className="mobile-nav-footer">
            <button className="mobile-nav-book" onClick={() => {
              setMenu(false);
              book({});
            }}>
              <span>{t("Header.004", "Book your escape")}<small>{t("Header.005", "A little time for yourself.")}</small></span><ArrowUpRight size={22} />
            </button>
            <div className="mobile-nav-contact"><span>{t("Header.006", "LET’S PLAN YOUR STAY")}</span><a href={'tel:+' + site.settings.phoneDigits}><Phone size={15} /> {site.settings.phoneInternational}</a></div>
            <p><MapPin size={13} /> {site.settings.location}</p>
          </div>
        </nav>
        <div className="nav-actions">
          <button className="nav-book" aria-label="Book your escape" onClick={() => {
            setMenu(false);
            book({});
          }}><span className="nav-book-full">{t("Header.007", "Book your escape")}</span><span className="nav-book-short">{t("Header.008", "Book a stay")}</span><span className="nav-book-icon"><ArrowUpRight size={18} /></span></button>
          <button ref={toggle} className="nav-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="primary-navigation" onClick={() => setMenu(value => !value)}>
            {menu ? <X size={23} /> : <span className="menu-lines"><span /><span /></span>}
          </button>
        </div>
      </div>
    </header>
    {!hasHero && <div className="header-spacer" />}
  </>;
}
