import { StormGlass } from '../stormGlass';
import axios from 'axios';
import stormGlassWeather3HourFixture from './../../../test/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HourFixture from './../../../test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('should return the notemalized forecast front the stormGlass service', async () => {
    const lat = -33.564564;
    const lng = -33.564564;
    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HourFixture });
    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3HourFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });
});