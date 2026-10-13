import data from './data.json';
export const resortPhotos = ['banner1/baneer2-transformed-min.jpeg', 'banner1/1.png', 'banner1/1l2a1581.jpg'];
export const gardenPhotos = ['banners/2024-08-24-1-1.jpg', 'banners/2023-04-24-1.jpg', 'banners/2022-10-17-1.jpg'];
export const diningPhotos = ['banner1/1l2a1574.jpg', '1l2a1580.JPG', '1l2a1582.JPG'];
export const leisurePhotos = ['banners/banner-pool-1.jpg', 'banners/2024-08-24-2-1.jpg', 'banners/2022-10-17-1.jpg'];
export const eventPhotos = ['banners/2023-12-03-1.jpg', ...data.galleries.find(g => g.slug === 'event-at-nature-nest').images.slice(0, 3)];
export const eveningPhotos = ['banner1/1l2a1581.jpg', '1l2a1570.JPG', '1l2a1582.JPG'];
export const experiencePhotos = {'wellness-spa': leisurePhotos, 'restaurants-bars': diningPhotos, 'special-offers': eventPhotos};
export const cottagePhotos = data.rooms.find(r => r.slug === 'luxury-left-cottage').images.slice(0, 4);
