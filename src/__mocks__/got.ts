import { ExtendOptions } from 'got/dist/source';
import { HTTPClient } from '../typings';

const mockHTTPClient = jest.fn(<T>(opts: ExtendOptions & { expectedResponse?: T }, responseDelay = -1) => {
  opts = opts ?? ({} as any);
  const { expectedResponse } = opts;

  const mockExecutor = (..._: any[]) => {
    return new Promise((resolve) => {
      if (responseDelay !== -1) {
        setTimeout(() => {
          resolve({ body: expectedResponse });
        }, responseDelay);
        return;
      }
      resolve({ body: expectedResponse });
    });
  };

  return (new (class extends Function {
    post = mockExecutor;
    get = mockExecutor;
    put = mockExecutor;
    delete = mockExecutor;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extend(..._: any) {
      return this;
    }
  })() as any) as HTTPClient;
});

export default mockHTTPClient;
