/* eslint-disable @typescript-eslint/no-empty-interface */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

//para desaclopar os tipos do axios
export interface RequestConfig extends AxiosRequestConfig {}
export interface Response<T = any> extends AxiosResponse {}

export class Request {
  constructor(private request = axios) {}
  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: AxiosError): boolean {
    return !!(error.response && error.response.status);
  }
}
