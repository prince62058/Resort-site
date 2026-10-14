// Single source for the "Plan Your Perfect Getaway" options.
// Home section, the /plan-your-getaway page and the WhatsApp widget all read this list,
// so adding a 9th, 10th … 15th option means adding one object here. Nothing else changes.
//
//   id      unique, url-safe key
//   icon    a name from getawayIcons in src/GetawayCards.jsx (unknown names fall back to a sparkle)
//   topic   what the guest is asking about; used in the WhatsApp message
//   ask     what we ask the resort to share; completes "Please share …"
export const getawayOptions = [
  { id: 'cottage', icon: 'home', title: 'Cottage & Private Villa Booking', blurb: 'Enjoy a luxurious and peaceful stay in our premium cottages and private villas.', image: 'cottage/1-850x460.png', topic: 'Cottage & Private Villa Booking', ask: 'availability, packages and pricing' },
  { id: 'birthday', icon: 'party', title: 'Birthday & Private Party Booking', blurb: 'Celebrate your special days with friends and family in a beautiful natural setting.', image: 'cottage/20240628-175253.jpg', topic: 'Birthday & Private Party Booking', ask: 'party spaces, packages and pricing' },
  { id: 'wedding', icon: 'wedding', title: 'Wedding & Marriage Booking', blurb: 'Make your big day memorable with our stunning venue and customizable packages.', image: 'cottage/img-20231210-wa0078.jpg', topic: 'Wedding & Marriage Booking', ask: 'venue availability, packages and pricing' },
  { id: 'group', icon: 'group', title: 'Group & Family Gathering Booking', blurb: 'Plan your group trips, family gatherings or get-togethers with exclusive packages.', image: 'cottage/img-20231210-wa0083.jpg', topic: 'Group & Family Gathering', ask: 'availability, packages and pricing' },
  { id: 'couple', icon: 'heart', title: 'Couple Stay & Romantic Getaway', blurb: 'Spend quality time with your loved one in a private and serene environment.', image: 'cottage/img-20240524-wa0007.jpg', topic: 'Couple Stay & Romantic Getaway', ask: 'availability, packages and pricing' },
  { id: 'corporate', icon: 'briefcase', title: 'Corporate Events & Team Outings', blurb: 'Conduct meetings, team building activities and corporate events in a refreshing ambience.', image: '1l2a1574.JPG', topic: 'Corporate Events & Team Outings', ask: 'venue availability, packages and pricing' },
  { id: 'day-outing', icon: 'trees', title: 'Day Outing & Resort Experience', blurb: 'Enjoy a day full of nature, activities, food and relaxation with friends and family.', image: 'banners/banner-pool-1.jpg', topic: 'Day Outing & Resort Experience', ask: 'timings, packages and pricing' },
  { id: 'anniversary', icon: 'cake', title: 'Anniversary & Special Celebration', blurb: 'Create unforgettable moments for anniversaries and other special occasions.', image: 'cottage/img-20231210-wa0101.jpg', topic: 'Anniversary & Special Celebration', ask: 'arrangements, packages and pricing' },
];

export const getawayPath = '/plan-your-getaway';

export function whatsappLink(phoneDigits, option) {
  const text = `Hi,\nI would like to enquire about ${option.topic}.\n\nPlease share ${option.ask}.`;
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
}

// The page is not stored in the CMS, so add it to published content. This makes the server
// answer 200 with proper SEO, and puts the page in the sitemap, instead of a 404.
export function withGetawayPage(content) {
  if (!content?.pages || content.pages.some(page => page.template === 'getaway')) return content;
  const names = getawayOptions.map(option => option.title).join(', ');
  const description = 'Plan your perfect getaway at The Nature Nest, Mhow, Indore: ' + names + '. Enquire on WhatsApp.';
  return {
    ...content,
    pages: [...content.pages, {
      id: 'plan-your-getaway',
      slug: getawayPath.slice(1),
      name: 'Plan Your Perfect Getaway',
      template: 'getaway',
      status: 'published',
      nav: false,
      order: 15,
      body: description,
      images: [],
      seo: {
        title: 'Plan Your Perfect Getaway | The Nature Nest, Mhow',
        description,
        keywords: [],
        image: content.settings?.defaultSeo?.image || 'enhanced/story/story-arrival-v1.webp',
        noindex: false,
      },
      heading: '',
      accent: '',
      subtitle: '',
      footerLabel: 'Plan your getaway',
    }],
  };
}
