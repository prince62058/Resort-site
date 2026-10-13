import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Clock3, Leaf, Link2, Search, X } from 'lucide-react';
import { Link } from './SiteLink.jsx';
import { site, t } from './content.js';
import { itemPath, pagePath } from '../shared/content.js';
import { documentBlocks } from '../shared/guest-pages.js';
import { journalDate, journalPosts, readingMinutes } from '../shared/journal.js';
import PhotoSlideshow from './PhotoSlideshow.jsx';
import imageSources from './imageSources.json';
import './journal.css';

function PostMeta({ post }) {
  return <div className="journal-meta"><span>{post.category || t('journal.defaultCategory', 'From the nest')}</span><i /><time dateTime={post.date}>{journalDate(post.date)}</time><span className="journal-reading"><Clock3 size={13} />{readingMinutes(post.body)} {t('journal.readTime', 'min read')}</span></div>;
}

function PostImage({ post, animated = false }) {
  return animated ? <PhotoSlideshow images={post.images} alt={post.name} interval={7200} indicators={false} /> : <img src={'/assets/' + (imageSources[post.images[0]] || post.images[0])} alt={post.name} loading="lazy" decoding="async" />;
}

function StoryCard({ post, index }) {
  return <article className="journal-story-card"><Link to={itemPath(site, 'posts', post)} className="journal-story-link"><div className="journal-story-image"><PostImage post={post} /><span className="journal-card-number">{String(index + 1).padStart(2, '0')}</span><span className="journal-image-arrow"><ArrowUpRight size={23} /></span></div><PostMeta post={post} /><h3>{post.name}</h3><p>{post.summary}</p><span className="journal-read-link">{t('journal.readStory', 'Read the story')}<ArrowUpRight size={16} /></span></Link></article>;
}

function JournalInvitation() {
  const blog = site.pages.find(p => p.template === 'blog');
  return <section className="journal-invitation"><PhotoSlideshow images={blog?.images || site.homePhotos.homeEveningPhotos} alt={t('journal.invitationImage', 'A quiet escape at The Nature Nest')} interval={8000} indicators={false} /><div><span className="journal-kicker">{t('journal.invitationEyebrow', 'MAKE A LITTLE TIME FOR YOU')}</span><h2>{t('journal.invitationTitle', 'Your next story')}<br /><em>{t('journal.invitationAccent', 'starts here.')}</em></h2><Link className="journal-light-button" to="/rooms">{t('journal.exploreStays', 'Find your kind of stay')}<ArrowUpRight size={20} /></Link></div><span className="journal-invitation-note">{site.settings.location}</span></section>;
}

function JournalIndex() {
  const posts = journalPosts(site);
  const blog = site.pages.find(p => p.template === 'blog');
  const featured = posts.find(p => p.featured) || posts[0];
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const categories = [...new Set(posts.map(p => p.category || t('journal.defaultCategory', 'From the nest')))];
  const searching = Boolean(query.trim() || category);
  const filtered = posts.filter(p => (!category || (p.category || t('journal.defaultCategory', 'From the nest')) === category) && (!query.trim() || [p.name, p.summary, p.category].join(' ').toLowerCase().includes(query.trim().toLowerCase())));
  const visible = searching ? filtered : posts.filter(p => p.id !== featured?.id);
  function updateFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  }
  return <div className="journal-page">
    <section className="journal-intro"><div className="journal-intro-top"><span className="journal-kicker"><span />{t('journal.eyebrow', 'THE NATURE NEST JOURNAL')}</span><span className="journal-edition">{t('journal.edition', 'NOTES FROM MHOW, INDORE')}</span></div><div className="journal-intro-main"><h1>{blog?.heading || t('journal.heading', 'Stories for a')}<br /><em>{blog?.accent || t('journal.accent', 'slower kind of life.')}</em></h1><div className="journal-intro-note"><Leaf size={26} strokeWidth={1.2} /><p>{blog?.subtitle || t('journal.subtitle', 'Little discoveries, thoughtful stays and moments worth making time for. A few pages from life at The Nature Nest.')}</p><a href="#journal-stories">{t('journal.browse', 'Take a little look around')} <span>↓</span></a></div></div></section>
    {featured && <section className="journal-feature" aria-label="Featured story"><Link to={itemPath(site, 'posts', featured)} className="journal-feature-photo"><PostImage post={featured} animated /><span className="journal-feature-label"><Leaf size={14} />{t('journal.featured', 'THE FEATURED STORY')}</span><span className="journal-feature-photo-note">{t('journal.featuredNote', 'A little closer to the things that matter.')}</span></Link><div className="journal-feature-copy"><PostMeta post={featured} /><h2><Link to={itemPath(site, 'posts', featured)}>{featured.name}</Link></h2><p>{featured.summary}</p><Link className="journal-feature-button" to={itemPath(site, 'posts', featured)}>{t('journal.readStory', 'Read the story')}<ArrowUpRight size={23} /></Link><span className="journal-feature-signature">{t('journal.featuredSignature', 'LESS RUSH. MORE REAL LIFE.')}</span></div></section>}
    <section id="journal-stories" className="journal-stories"><div className="journal-section-heading"><div><span className="journal-kicker">{t('journal.latestEyebrow', 'WORTH A LITTLE OF YOUR TIME')}</span><h2>{t('journal.latestTitle', 'More from ')}<em>{t('journal.latestAccent', 'the nest.')}</em></h2></div><label className="journal-search"><Search size={17} /><input type="search" value={query} maxLength={120} onChange={e => updateFilter('q', e.target.value)} placeholder={t('journal.searchPlaceholder', 'Find a little inspiration')} aria-label="Search stories" />{query && <button type="button" onClick={() => updateFilter('q', '')} aria-label="Clear search"><X size={16} /></button>}</label></div>
      <div className="journal-filter-row"><div className="journal-filters" role="group" aria-label="Filter stories by category"><button aria-pressed={!category} onClick={() => updateFilter('category', '')}>{t('journal.allStories', 'All stories')}</button>{categories.map(c => <button key={c} aria-pressed={category === c} onClick={() => updateFilter('category', c)}>{c}</button>)}</div><span className="journal-result-count" role="status">{visible.length} {visible.length === 1 ? t('journal.storySingular', 'story') : t('journal.storyPlural', 'stories')}</span></div>
      {visible.length ? <div className="journal-story-grid">{visible.map((p, i) => <StoryCard key={p.id} post={p} index={i} />)}</div> : <div className="journal-empty"><Leaf size={32} strokeWidth={1} /><h3>{searching ? t('journal.noResults', 'A different path, perhaps?') : t('journal.moreSoon', 'More stories are on their way.')}</h3><p>{searching ? t('journal.noResultsHelp', 'Try another word or explore all of our stories.') : t('journal.moreSoonHelp', 'There’s always something to look forward to at the nest.')}</p>{searching && <button className="button" onClick={() => setParams({}, { replace: true })}>{t('journal.reset', 'Reset filters')}<ArrowUpRight size={17} /></button>}</div>}
    </section>
    <JournalInvitation />
  </div>;
}

function JournalArticle({ post }) {
  const [copied, setCopied] = useState('');
  const blocks = documentBlocks(post.body, site.settings);
  const headings = blocks.filter(b => b.type === 'h2');
  const related = journalPosts(site).filter(p => p.id !== post.id).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);
  async function copyLink() {
    try { await navigator.clipboard.writeText(window.location.origin + itemPath(site, 'posts', post)); setCopied(t('journal.copied', 'Link copied')); }
    catch { setCopied(t('journal.copyFallback', 'You can copy this page’s address from your browser.')); }
  }
  return <div className="journal-page journal-article-page"><div className="journal-article-heading"><Link className="journal-back" to={pagePath(site, 'blog')}><ArrowLeft size={16} />{t('journal.back', 'Back to the journal')}</Link><PostMeta post={post} /><h1>{post.name}</h1><p className="journal-deck">{post.summary}</p><div className="journal-byline"><span className="journal-author-icon"><Leaf size={17} /></span><span>{site.settings.fullName}</span><button className="journal-share" onClick={copyLink}>{copied === t('journal.copied', 'Link copied') ? <Check size={15} /> : <Link2 size={15} />}{t('journal.copyLink', 'Copy link')}</button></div>{copied && <p role="status" className="journal-copy-status">{copied}</p>}</div><div className="journal-article-cover"><PostImage post={post} animated /><span>{site.settings.location}</span></div>
    <div className="journal-reading-layout"><aside className="journal-reading-aside"><span className="journal-kicker">{t('journal.readingNote', 'TAKE YOUR TIME')}</span>{headings.length > 0 && <nav aria-label="Story sections">{headings.map(h => <a href={'#' + h.id} key={h.id}>{h.text}</a>)}</nav>}<div className="journal-stay-note"><Leaf size={24} strokeWidth={1} /><h3>{t('journal.stayNoteTitle', 'Read it. Feel it. Live it.')}</h3><p>{t('journal.stayNoteCopy', 'Make a little space for a getaway of your own.')}</p><Link to="/rooms">{t('journal.stayNoteLink', 'Explore our stays')} <ArrowUpRight size={17} /></Link></div></aside><article className="journal-prose" aria-label={post.name}>{blocks.map((b, i) => b.type === 'ul' ? <ul key={i}>{b.items.map((v, j) => <li key={j}>{v}</li>)}</ul> : b.type === 'p' ? <p key={i}>{b.text}</p> : <b.type key={i} id={b.id}>{b.text}</b.type>)}<div className="journal-end-mark"><Leaf size={18} /><span>{t('journal.endNote', 'A LITTLE CLOSER TO NATURE. A LITTLE CLOSER TO YOU.')}</span></div><Link className="journal-back" to={pagePath(site, 'blog')}><ArrowLeft size={16} />{t('journal.allBack', 'Explore all stories')}</Link></article></div>
    {related.length > 0 && <section className="journal-related"><div className="journal-section-heading"><div><span className="journal-kicker">{t('journal.relatedEyebrow', 'STAY A LITTLE LONGER')}</span><h2>{t('journal.relatedTitle', 'One story leads to ')}<em>{t('journal.relatedAccent', 'another.')}</em></h2></div></div><div className="journal-story-grid">{related.map((p, i) => <StoryCard key={p.id} post={p} index={i} />)}</div></section>}<JournalInvitation /></div>;
}

export default function Journal({ article = false }) {
  const { slug } = useParams();
  const post = journalPosts(site).find(p => p.slug === slug);
  if (!article) return <JournalIndex />;
  if (!post) return <section className="section centered"><h1>{t('journal.missing', 'This story is taking a little break.')}</h1><Link className="button" to={pagePath(site, 'blog')}>{t('journal.allBack', 'Explore all stories')} <ArrowUpRight size={17} /></Link></section>;
  return <JournalArticle key={post.id} post={post} />;
}
