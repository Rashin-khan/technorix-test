import axioss from 'axios';
import { filter, isEmpty } from 'lodash';
import { groupFilters } from './helper';

const API_URL = 'https://teknorix.jobsoid.com/api/v1';

async function getJobList(filters) {
  let filterUrl = '';
  if(!isEmpty(filters)) {
      if(filters.search) {
        filterUrl = `${filterUrl === '' ? '?' : `${filterUrl}&`}q=${filters.search}`;
      }
      if(filters.Location) {
        filterUrl = `${filterUrl === '' ? '?' : `${filterUrl}&`}loc=${filters.Location}`;
      }
      if(filters.Department) {
        filterUrl = `${filterUrl === '' ? '?' : `${filterUrl}&`}dept=${filters.Department}`;
      }
      if(filters.Function) {
        filterUrl = `${filterUrl === '' ? '?' : `${filterUrl}&`}fun=${filters.Function}`;
      }
  } else {
    filterUrl = ''
  }

  try {
    const response = await axioss({
      method: 'get',
      url: `${API_URL}/jobs${filterUrl}`
    })

    const data = response?.data;

    return data;
  } catch (error) {
    return [];
  }
}

export async function getFiltersList() {
    try {
      const deptFiltersResponse = await axioss({
        method: 'get',
        url: `${API_URL}/departments`
      });

      const locFiltersResponse = await axioss({
        method: 'get',
        url: `${API_URL}/locations`
      });

      const funcFiltersResponse = await axioss({
        method: 'get',
        url: `${API_URL}/functions`
      });
  
      const filters = groupFilters(deptFiltersResponse?.data, locFiltersResponse?.data, funcFiltersResponse?.data);
      return filters;
    } catch (error) {
      return [];
    }
  }

  export async function getJobDetails(id) {
    try {
      const response = await axioss({
        method: 'get',
        url: `${API_URL}/jobs/${id}`
      });
  
      return response.data;
    } catch (error) {
      return [];
    }
  }


export default getJobList