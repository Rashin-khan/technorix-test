import axioss from 'axios';
import { isEmpty } from 'lodash';
import { groupFilters } from './helper';

const API_URL = 'https://teknorix.jobsoid.com/api/v1';

async function getJobList(filters) {
  let filterUrl = '';
  if(!isEmpty(filters)) {
    filterUrl = `q=${filters.search}&loc=${filters.locationFilters}&dept=${filters.departmentFilters}&fun=${filters.functionFilters}`;
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


export default getJobList