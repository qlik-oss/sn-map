import GeodataUtils from '../utils';
describe('GeodataUtils', () => {
  describe('parseUrl', () => {
    it('should handle $ in front of {}', () => {
      expect(GeodataUtils.parseUrl('https://example.com/${x}/{y}/${z}/$somethingelse', 0, 1, 2)).toBe(
        'https://example.com/0/1/2/$somethingelse'
      );
    });

    it('should be possible to use all of x, y, z, and level', () => {
      expect(GeodataUtils.parseUrl('https://example.com/{x}/{y}/${z}/{level}', 13, 1, -2)).toBe(
        'https://example.com/13/1/-2/-2'
      );
    });

    it('should handle Bing quadkeys', () => {
      expect(GeodataUtils.parseUrl('https://example.com/${quadkey}', 11, 3, 8)).toBe('https://example.com/00001033');
      expect(GeodataUtils.parseUrl('https://example.com?key=${quadkey}', 2389, 2946, 13)).toBe(
        'https://example.com?key=0302321010121'
      );
      expect(
        GeodataUtils.parseUrl(
          'https://t.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/{quadkey}?mkt=en-US&it=G,OBX,RL&shading=hill&n=z&c4w=1&osm=1',
          6963,
          3188,
          13
        )
      ).toBe(
        'https://t.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/1321102330211?mkt=en-US&it=G,OBX,RL&shading=hill&n=z&c4w=1&osm=1'
      );
    });

    it('should handle the array / subdomain syntax', () => {
      const url = 'https://${[ a, apa, bepa ]}.example.com/';
      expect(GeodataUtils.parseUrl(url, 0, 0, 0)).toBe('https://a.example.com/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 1)).toBe('https://apa.example.com/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 2)).toBe('https://bepa.example.com/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 3)).toBe('https://a.example.com/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 4)).toBe('https://apa.example.com/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 5)).toBe('https://bepa.example.com/');

      // "If the sum of x + y + z is the same, the same element should be used"
      expect(
        GeodataUtils.parseUrl(url, 1, 0, 0) === GeodataUtils.parseUrl(url, 0, 1, 0) &&
          GeodataUtils.parseUrl(url, 0, 1, 0) === GeodataUtils.parseUrl(url, 0, 0, 1)
      ).toBe(true);
    });

    it('should handle multiple array patterns', () => {
      const url = 'https://${[a,b,c]}.example.{[se,no]}/';
      expect(GeodataUtils.parseUrl(url, 0, 0, 0)).toBe('https://a.example.se/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 1)).toBe('https://b.example.no/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 2)).toBe('https://c.example.se/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 3)).toBe('https://a.example.no/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 4)).toBe('https://b.example.se/');
      expect(GeodataUtils.parseUrl(url, 0, 0, 5)).toBe('https://c.example.no/');

      // "If the sum of x + y + z is the same, the same element should be used"
      expect(
        GeodataUtils.parseUrl(url, 1, 0, 0) === GeodataUtils.parseUrl(url, 0, 1, 0) &&
          GeodataUtils.parseUrl(url, 0, 1, 0) === GeodataUtils.parseUrl(url, 0, 0, 1)
      ).toBe(true);
    });

    it('should handle the array pattern in combination with other patterns', () => {
      const url = '{[https://a.example.com/{z}/${x}/{y}.png,http://b.example.com/{quadkey}?it=G%2COBX%2CRL]}';
      expect(GeodataUtils.parseUrl(url, 0, 0, 8)).toBe('https://a.example.com/8/0/0.png');
      expect(GeodataUtils.parseUrl(url, 1, 0, 8)).toBe('http://b.example.com/00000001?it=G%2COBX%2CRL');
      expect(GeodataUtils.parseUrl(url, 2, 0, 8)).toBe('https://a.example.com/8/2/0.png');
      expect(GeodataUtils.parseUrl(url, 3, 0, 8)).toBe('http://b.example.com/00000011?it=G%2COBX%2CRL');
      expect(GeodataUtils.parseUrl(url, 4, 0, 8)).toBe('https://a.example.com/8/4/0.png');
      expect(GeodataUtils.parseUrl(url, 5, 0, 8)).toBe('http://b.example.com/00000101?it=G%2COBX%2CRL');
    });

    it('should skip tiles outside tile bounds if expression is simple and skip is true', () => {
      expect(GeodataUtils.parseUrl('${y}/{z}/{ x }', 2, 0, 0, true)).toBe(null);
      expect(GeodataUtils.parseUrl('${y}/{z}/{ x }', 0, 0, 0, true)).not.toBe(null);

      expect(GeodataUtils.parseUrl('${y}/{z}/{ x }', 0, 0, -1, true)).toBe(null);

      expect(GeodataUtils.parseUrl('{level}/{z}/{x}', -1, 0, 1, true)).toBe(null);
      expect(GeodataUtils.parseUrl('{level}/{z}/{x}', 2, 0, 1, true)).toBe(null);
      expect(GeodataUtils.parseUrl('{level}/{z}/{x}', 0, -1, 1, true)).toBe(null);
      expect(GeodataUtils.parseUrl('{level}/{z}/{x}', 0, 2, 1, true)).toBe(null);
    });
  });
});
