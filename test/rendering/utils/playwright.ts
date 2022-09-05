export default (page) => ({
  async open(url) {
    await page.goto(url, { waitUntil: 'networkidle' });
  },
  async screenshot() {
    return page.screenshot();
  },
});
