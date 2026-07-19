export default function manifest() {
  return {
    name: 'Hadassah Lifestyle',
    short_name: 'Hadassah',
    description: 'Beautifully chosen, effortlessly yours.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4ecdf',
    theme_color: '#5b1423',
    icons: [{ src: '/brand/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
