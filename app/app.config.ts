export default defineAppConfig({
  /*
  ** Site identity — edit these to make it yours
  */
  siteTitle: 'Site Title Here',
  siteSubtitle: 'about your blog',
  authorAvatar: 'http://vuejsradar.com/assets/img/logo2.png',
  customLinks: [
    { label: 'my custom links', url: '#' },
    { label: 'fieldtripp.com', url: 'https://fieldtripp.com' },
    { label: 'vuejsradar.com', url: 'http://vuejsradar.com' },
    { label: 'midstride.com', url: 'http://midstride.com' }
  ],
  socialLinks: [
    { network: 'twitter', url: 'https://twitter.com/andreliem' },
    { network: 'linkedin', url: 'https://www.linkedin.com/in/andrekliem/' }
  ],
  /*
  ** Replace with your own Disqus shortname to enable comments
  */
  disqusShortname: 'your_disqus_short_name'
})
