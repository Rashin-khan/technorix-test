import { useContext, useEffect, useState } from 'react';
import './App.css';
import { debounce, isEmpty } from 'lodash';
import Details from './Details';
import {Routes, Route, NavLink} from 'react-router-dom'
import getJobList, { getFiltersList } from './ApiCall';
import { DepartmentLogo, getGroupedList, LocationLogo } from './helper';
import UserContext from './Context';

function App() {
  const [departmentList, setDepartmentList] = useState([]);
  const [filtersList, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const {dispatch} = useContext(UserContext);

  useEffect(() => {
    async function getList() {
      const res = await getJobList(selectedFilters);
      setDepartmentList(getGroupedList(res));
    }
    getList()
  }, [selectedFilters])

  useEffect(() => {
    async function getFilters() {
      const filters = await getFiltersList();
      
      setFilters(filters);
    }
    getFilters();

  }, [])

  function handleSelect(e) {
    setSelectedFilters({ ...selectedFilters, [e.target.name]: e.target.value});
  }

  function handleClearFilter(items) {
    console.log(items)
    setSelectedFilters(Object.assign({}, Object.values(selectedFilters).filter((filterTag)=>(filterTag !== items))))
  }

  function handleID(items) {
    dispatch(items);
  }

  const debouncedOnChange = debounce(handleSelect, 500);

  return (
    
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
                              {
                                !isEmpty(filtersList) && Object.keys(filtersList)?.map((item, i) => (
                                  <li key={i}>
                                    <select id={filtersList[item]?.title} name={filtersList[item]?.title} className='jw-custom-dropdown' onChange={debouncedOnChange}>
                                    <option value="null" selected><p><i class="jw-icon-department"></i>{filtersList[item]?.title} <i
                                      class="jw-icon-chev-down"></i></p></option>
                                      {filtersList[item]?.map((items, index) => (
                                        <option value={items.title} key={index}>{items.title}</option>
                                      ))}
                                    </select>
                                  </li>
                                )) 
                              }
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
                            <div key={index}>
                              <div class="jw-list-title"><span><i
                                class="jw-icon-department"></i>{list.department}</span></div>
                                <ul class="jw-jobs-list jw-stacked">
                              {
                                list.products?.map((productsList, key) => (
                                    <li>
                                      <div class="jw-brief-content">
                                        <div class="jw-job-title"><a class="jw-link"
                                          href="#/job-description/13644">{productsList.title}</a>
                                        </div>
                                        <div class="jw-brief-details"><span>
                                          <img className='icon-department' width={30} height={30} src={DepartmentLogo}/>
                                          {productsList.department.title}</span><span>
                                            <img 
                                              width={30} 
                                              height={30} 
                                              src={LocationLogo}
                                              className='icon-department'
                                            />
                                            Verna, Goa</span>
                                            <label class="jw-label-bordered">Full Time</label>
                                        </div>
                                      </div>
                                      <div class="jw-btn-footer">
                                        <div class="jw-actions">
                                          <a href={productsList.applyUrl} target="_blank" class="jw-btn-primary">Apply</a>
                                           <nav class="jw-btn-secondary">
                                              <NavLink to="/Details">
                                                <a onClick={() => handleID(productsList.id)}>View</a>
                                              </NavLink>
                                            </nav>
                                          <Routes>
                                            <Route exact path='/Details' element={<Details jobId={productsList.id}/>}></Route>
                                        </Routes>
                                        </div>
                                      </div>
                                    </li>
                                ))
                              }
                             </ul>
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
        );
}

        export default App;
