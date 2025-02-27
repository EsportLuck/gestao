import { FetchHttpClient } from '@/adapter/FetchHttpClient';

export class ImportService {
  constructor(private httpClient: FetchHttpClient) {}

  async importFile(formData: FormData) {
    return await this.httpClient.postFormData('/api/v1/import', formData);
  }
}