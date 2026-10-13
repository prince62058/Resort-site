import {ArrowUpRight, MapPin} from 'lucide-react';
import {Sculpture} from './Brand3D.jsx';
import {HomeSlideshow} from './PhotoSlideshow.jsx';
import {homeClosingPhotos} from './homePhotos.js';
import './closing-banner.css';

export default function ClosingBanner({book}) {
  return <section className="closing-note closing-banner" aria-labelledby="closing-banner-title">
    <HomeSlideshow className="closing-banner-image" images={homeClosingPhotos} alt="Peaceful gardens and evening views at Nature Nest" interval={6100} indicators={false}/>
    <div className="closing-banner-shade" aria-hidden="true"/>
    <div className="closing-banner-content">
      <div className="closing-banner-symbol"><Sculpture kind="leaf"/></div>
      <span className="closing-banner-eyebrow">YOU’VE EARNED A LITTLE ESCAPE.</span>
      <h2 id="closing-banner-title">See you at <em>the nest.</em></h2>
      <p>Bring your favourite people.<br className="closing-mobile-break"/> We’ll take care of the rest.</p>
      <button className="closing-banner-book" onClick={() => book({})}>Plan your stay<span><ArrowUpRight size={23}/></span></button>
    </div>
    <span className="closing-banner-location"><MapPin size={12}/> MHOW, INDORE <span>·</span> THE NATURE NEST</span>
  </section>;
}
