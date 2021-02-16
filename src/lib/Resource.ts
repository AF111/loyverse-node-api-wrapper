import qs from 'querystring';
import { Got } from 'got/dist/source';
import { IClientResource } from './Client';

export interface IResource {
  baseURL: string;
}

export interface ResourceConstructor {
  new (client: IClientResource): IResource;
}

/**
 * @description API resources base class
 */
export default class Resource {
  // resource base url
  baseURL: string;
  protected qs = qs;
  protected httpClient: Got;

  constructor(protected client: IClientResource) {
    this.httpClient = client._httpClient;
  }

  /**
   * @description removes the leading slash in a string
   * @param {string} s
   */
  #removeLeadingSlash = (s: string) => (s.charAt(0) === '/' ? s.slice(1) : s);

  /**
   * @description concatenates url pathnames with the resource baseURL
   * @param {string} paths variable list of url pathnames
   */
  getURL = (...paths: (string | number)[]) => {
    return this.#removeLeadingSlash(
      paths.reduce(
        (pv, cv) => `${pv.toString()}/${this.#removeLeadingSlash(cv.toString())}`,
        this.baseURL,
      ) as string,
    );
  };

  /**
   * @description builds url query params
   * @param {string} baseURL the base url
   * @param {any} params key value pairs
   */
  params = (baseURL: string, params?: Record<string, any>) => {
    const stringifiedParams = this.qs.stringify(params ?? {});
    return `${baseURL}${stringifiedParams ? `?${stringifiedParams}` : ''}`;
  };

  /**
   * @description Splits array elements into a comma separated string or by the provided separator
   * @param {Array.<any>} list
   * @param {string} separator
   */
  protected splitList = (list: string[], separator = ',') => list.join(separator);

  /**
   * @description Joins splitted string chunks into an array by a comma or the provided separator
   * @param {Array.<any>} list
   * @param {string} separator
   */
  protected joinList = <T = any>(list: string, separator?: string | RegExp): T[] => {
    return list.split(separator ?? ',') as any;
  };
}
