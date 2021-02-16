import qs from 'querystring';
import Resource from '../lib/Resource';

class TestResource extends Resource {
  baseURL = 'https://www.example.com';
  qs = qs;
}

let resource!: TestResource;

beforeAll((done) => {
  resource = new TestResource({ _httpClient: {}, auth: {} } as any);
  done();
});

describe('Resource base class works', () => {
  test('removes leading slashes in each url pathname', (done) => {
    const url = resource.getURL('/api', 'items', '/some', 'vim', '/nano-ftw');
    expect(url).toEqual('https://www.example.com/api/items/some/vim/nano-ftw');
    done();
  });

  test('works with single string url pathnames', (done) => {
    const url = resource.getURL('api/items/all');
    expect(url).toEqual('https://www.example.com/api/items/all');
    done();
  });

  test('appends url query params', (done) => {
    const url = resource.getURL('/api/mandalores');

    expect(
      resource.params(url, {
        armourType: 'beskar',
        withBabyYoda: true,
        spaceShip: 'old',
      }),
    ).toEqual('https://www.example.com/api/mandalores?armourType=beskar&withBabyYoda=true&spaceShip=old');
    done();
  });

  test('query params builder works without having to pass query values', (done) => {
    expect(resource.params(resource.baseURL)).toEqual(`${resource.baseURL}`);
    done();
  });

  test('test flat array splitter and joiner', () => {
    expect.assertions(2);
    new (class T extends Resource {
      constructor() {
        super({} as any);
        expect(this.splitList(['id', '1', 'group'])).toEqual('id,1,group');
        expect(this.joinList('id,1,group')).toEqual(['id', '1', 'group']);
      }
    })();
  });
});
