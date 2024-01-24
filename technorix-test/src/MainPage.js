import logo from './logo.svg';
import groupBy from 'lodash/groupBy';
import { useEffect, useState } from 'react';
import axioss from 'axios';
import { debounce, filter, isEmpty } from 'lodash';

const MainPage = (data) => {
    const [departmentList, setDepartmentList] = useState([]);
  const [filtersList, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  // const navigation = useNavigation();
  useEffect(() => {
    let groupCtegories = {};
    function getData(categories) {
      if (categories?.length) {
        const categoriesArr = groupBy(categories, item => item?.department?.title);
        Object.keys(categoriesArr).forEach(item => {
          categoriesArr[item].forEach((pItem, index) => {
            if (index == 0) {
              groupCtegories[item] = {
                department: pItem.department.title,
                products: []
              };
            }
            groupCtegories[item]?.products?.push(pItem);
          });
        });
      }

      groupCtegories = Object.values(groupCtegories);
      setDepartmentList(groupCtegories);
    }
    async function getList() {
      let res = [];
      if(!isEmpty(selectedFilters)) {
        res = await axioss.get(`https://teknorix.jobsoid.com/api/v1/jobs?q=${selectedFilters.search}&loc=${selectedFilters.locationFilters}&dept=${selectedFilters.departmentFilters}&fun=${selectedFilters.functionFilters}`);
      } else {
        res = await axioss.get(`https://teknorix.jobsoid.com/api/v1/jobs`);
      }
      getData(res.data)
    }
    getList()
  }, [selectedFilters])
  useEffect(() => {
    async function getFilters() {
      const departmentFilters = await axioss.get('https://teknorix.jobsoid.com/api/v1/departments');
      const locationFilters = await axioss.get('https://teknorix.jobsoid.com/api/v1/locations');
      const functionFilters = await axioss.get('https://teknorix.jobsoid.com/api/v1/functions');
      setFilters({
        departmentFilters: departmentFilters.data, 
        locationFilters: locationFilters.data, 
        functionFilters: functionFilters.data
      })
    }
    getFilters();

  }, [])

  function handleSelect(e) {
    setSelectedFilters({ ...selectedFilters, [e.target.name]: e.target.value});
  }

  function handleClearFilter(items) {
    setSelectedFilters(Object.assign({}, Object.values(selectedFilters).filter((filterTag)=>(filterTag !== items))))
  }

  const debouncedOnChange = debounce(handleSelect, 500);
    return(
        
    <div class="section-content">
    <div class="section-container">
      <div class="block">
        <div class="block-content">
          <p></p>
          <div id="jw-root-container" class="theme-default" j-layout="stacked" j-group="auto" j-source="Website"
            j-show-dept="true" j-show-div="false" j-show-loc="true" j-show-func="true" j-domain="teknorix">
            <div class="jw-widget-container">
              <section class="jw-current-openings">
                <div class="jw-filter-container">
                  <div class="jw-filter-dropdown">
                    <p>Filter By</p>
                      <div>
                          <form action="/action_page.php">
                            <input type="text" id="search" name="search" value={selectedFilters.search} placeholder="Search for Job" onChange={debouncedOnChange}/>
                          </form>
                          </div>
                          <ul class="jw-filters">
                            <li>
                            <select id="department" name="department" className='jw-custom-dropdown' onChange={debouncedOnChange}>
                            <option value="null" selected><p><i class="jw-icon-department"></i>Department <i
                                  class="jw-icon-chev-down"></i></p></option>
                              {filtersList?.departmentFilters?.map((items, index) => (
                                <option value={items.title} key={index}>{items.title}</option>
                              ))}
                            </select>
                            </li>
                            <li>
                            <select id="location" name="location" className='jw-custom-dropdown' onChange={debouncedOnChange}>
                            <option value="null" selected><p><i class="jw-icon-department"></i>Location <i
                                  class="jw-icon-chev-down"></i></p></option>
                              {filtersList?.locationFilters?.map((items, index) => (
                                <option value={items.title} key={index}>{items.title}</option>
                              ))}
                            </select>
                            </li>
                            <li>
                            <select id="function" name="function" className='jw-custom-dropdown' onChange={debouncedOnChange}>
                            <option value="null" selected><p><i class="jw-icon-department"></i>Function <i
                                  class="jw-icon-chev-down"></i></p></option>
                              {filtersList?.functionFilters?.map((items, index) => (
                                <option value={items.title} key={index}>{items.title}</option>
                              ))}
                            </select>
                            </li>
                            <li><span disabled="" class="jw-link"><i class="jw-icon-reset"></i></span></li>
                          </ul>
                        </div>
                      </div>
                      {!isEmpty(selectedFilters)&&<div class="search-list-display">
                        {
                          Object.keys(selectedFilters).map((items, index) => (
                            items && selectedFilters[items] ? <label class="search-list-display-labels">
                              {selectedFilters[items]}
                              <button onClick={() => handleClearFilter(selectedFilters[items])} className='search-cancel-button'>X</button>
                            </label> : null
                          ))
                        }
                      </div>}
                      <div class="jw-jobs">
                        {departmentList?.map((list, index) => (
                          <div>
                            <div class="jw-list-title"><span><i
                              class="jw-icon-department"></i>{list.department}</span></div>
                            {
                              list.products?.map((productsList, key) => (
                                <ul class="jw-jobs-list jw-stacked">
                                  <li>
                                    <div class="jw-brief-content">
                                      <div class="jw-job-title"><a class="jw-link"
                                        href="#/job-description/13644">{productsList.title}</a>
                                      </div>
                                      <div class="jw-brief-details"><span><i
                                        class="jw-icon-department"></i>{productsList.department.title}</span><span><i
                                          class="jw-icon-location"></i>Verna, Goa</span><label
                                            class="jw-label-bordered">Full Time</label></div>
                                    </div>
                                    <div class="jw-btn-footer">
                                      <div class="jw-actions"><a
                                        href="https://jobs.teknorix.com/apply/13644?source=Website"
                                        target="_blank" class="jw-btn-primary">Apply</a>
                                         
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              ))
                            }

                          </div>
                        ))}
                        {
                          departmentList?.map((items, index) => {
                            <div key={index}>
                              <div class="jw-list-title" key={index}>
                                <span>
                                  <i class="jw-icon-department"></i>
                                  {items.department}
                                </span>
                              </div>
                            </div>
                          })
                        }
                      </div>
                    </section>
                  </div>
                </div>
                <p>
                  <script type="text/javascript" src="https://static.jobsoid.com/web-integration/jobsoid.js"></script>
                </p>
                <p></p>
            </div>
          </div>
        </div>
      </div>
    )
}
export default MainPage;