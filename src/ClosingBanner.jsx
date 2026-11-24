import {t} from './content.js';
import { site } from './content.js';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Sculpture } from './Brand3D.jsx';
import { HomeSlideshow } from './PhotoSlideshow.jsx';
import './closing-banner.css';
export default function ClosingBanner({
  book
}) {
  return <section className="closing-note closing-banner" aria-labelledby="closing-banner-title">
    <HomeSlideshow className="closing-banner-image" images={site.homePhotos.homeClosingPhotos} alt="Peaceful gardens and evening views at Nature Nest" interval={6100} indicators={false} />
    <div className="closing-banner-shade" aria-hidden="true" />
    <div className="closing-banner-content">
      <div className="closing-banner-symbol"><Sculpture kind="leaf" /></div>
      <span className="closing-banner-eyebrow">{t("ClosingBanner.001", "YOU’VE EARNED A LITTLE ESCAPE.")}</span>
      <h2 id="closing-banner-title">{t("ClosingBanner.002", "See you at ")}<em>{t("ClosingBanner.003", "the nest.")}</em></h2>
      <p>{t("ClosingBanner.004", "Bring your favourite people.")}<br className="closing-mobile-break" />{t("ClosingBanner.005", " We’ll take care of the rest.")}</p>
      <button className="closing-banner-book" onClick={() => book({})}>{t("ClosingBanner.006", "Plan your stay")}<span><ArrowUpRight size={23} /></span></button>
    </div>
    <span className="closing-banner-location"><MapPin size={12} />{t("ClosingBanner.007", " MHOW, INDORE ")}<span>·</span>{t("ClosingBanner.008", " THE NATURE NEST")}</span>
  </section>;
}
