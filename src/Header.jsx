import {useEffect, useRef, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {ArrowUpRight, Leaf, MapPin, Phone, X} from 'lucide-react';
import './header.css';
import {Brand3D} from './Brand3D.jsx';

const links = [
  ['/', 'Home'], ['/rooms', 'Stay with us'], ['/services', 'Experiences'],
  ['/galleries', 'Gallery'], ['/about', 'Our story'], ['/contact-us', 'Contact'],
];

export default function Header({menu, setMenu, book}) {
  const {pathname} = useLocation();
  const [scrolled, setScrolled] = useState(() => window.scrollY > 45);
  const header = useRef(null);
  const toggle = useRef(null);
  const hasHero = ['/', '/index.html', '/rooms', '/rooms.html', '/about', '/contact-us', '/contact-us.html'].includes(pathname)
    || /^\/(services|galleries|blog|news|tag)(\/|\.|$)/.test(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1051px)');
    const closeOnDesktop = () => {if (desktop.matches) setMenu(false);};
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [setMenu]);

  useEffect(() => {
    if (!menu) return;
    const content = [...document.querySelectorAll('main, footer')];
    content.forEach(element => {element.inert = true;});
    const onKeyDown = event => {
      if (event.key === 'Escape') {setMenu(false); toggle.current?.focus();}
      if (event.key === 'Tab') {
        const items = [...header.current.querySelectorAll('a, button')].filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
        if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      content.forEach(element => {element.inert = false;});
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menu, setMenu]);

  return <>
    <header ref={header} className={`site-header ${hasHero ? 'has-hero' : 'on-light'} ${scrolled ? 'is-scrolled' : ''} ${menu ? 'menu-is-open' : ''}`}>
      <div className="nav-utility">
        <span><MapPin size={12}/> MHOW, INDORE <i/><span className="nav-utility-tagline">YOUR OWN LITTLE ESCAPE</span></span>
        <a href="tel:+917777878822"><Phone size={11}/> +91 77778 78822 <ArrowUpRight size={12}/></a>
      </div>
      <div className="nav-inner">
        <Link to="/" className="brand nav-brand" aria-label="The Nature Nest home" onClick={() => setMenu(false)}>
          <Brand3D/>
        </Link>
        <nav id="primary-navigation" aria-label="Main navigation" className={`site-nav ${menu ? 'open' : ''}`}>
          <div className="mobile-nav-intro"><Leaf size={19}/> A LITTLE CLOSER TO NATURE</div>
          {links.map(([to, label], index) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setMenu(false)} style={{'--nav-index': index}}>
            <span className="nav-number" aria-hidden="true">0{index + 1}</span><span>{label}</span><ArrowUpRight className="mobile-nav-arrow" size={23}/>
          </NavLink>)}
          <div className="mobile-nav-footer"><span>LET’S PLAN YOUR STAY</span><a href="tel:+917777878822">+91 77778 78822 <ArrowUpRight size={18}/></a><p>Mhow, Indore · Madhya Pradesh</p></div>
        </nav>
        <div className="nav-actions">
          <button className="nav-book" aria-label="Book your escape" onClick={() => {setMenu(false); book({});}}><span className="nav-book-full">Book your escape</span><span className="nav-book-short">Book a stay</span><span className="nav-book-icon"><ArrowUpRight size={18}/></span></button>
          <button ref={toggle} className="nav-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="primary-navigation" onClick={() => setMenu(value => !value)}>
            {menu ? <X size={23}/> : <span className="menu-lines"><span/><span/></span>}
          </button>
        </div>
      </div>
    </header>
    {!hasHero && <div className="header-spacer"/>}
  </>;
}
