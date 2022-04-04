import { StormGlass } from '../stormGlass';

describe('StormGlass client', () => {
  it('should return the notemalized forecast front the stormGlass service', async () => {
    const lat = -33.564564;
    const lng = -33.564564;
    const stormGlass = new StormGlass();
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual({});
  });
});
