import { useEffect, useState } from 'react';
import './App.css';
import { debounce, isEmpty } from 'lodash';
import Details from './Details';
import {Routes, Route, NavLink} from 'react-router-dom'
import getJobList, { getFiltersList } from './ApiCall';
import { getGroupedList } from './helper';

function App() {
  const [departmentList, setDepartmentList] = useState([]);
  const [filtersList, setFilters] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

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
    setSelectedFilters(Object.assign({}, Object.values(selectedFilters).filter((filterTag)=>(filterTag !== items))))
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
                                    <select id="department" name="department" className='jw-custom-dropdown' onChange={debouncedOnChange}>
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
                                          <img className='icon-department' width={30} height={30} src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAYFBMVEX///8AAACUlJTk5OQVFRX4+PhmZmbe3t5KSko/Pz/Pz8/09PSLi4vIyMhTU1OwsLB1dXWamprq6uq4uLiqqqpFRUU6OjomJiYxMTGAgIBubm7Y2NhcXFwfHx8NDQ2+vr4FklZwAAAEoElEQVR4nO2c63aqMBBGKxhACPeLAirv/5bHquusoMxwC2Dbb/91OsnuwkwmIF9fAAAAAAAAAAAA2BTX3XoGukiaYrcrmmTrecxHmNlxd+eYmWLr2czCc+Onyl0ndr2tZzQZz5eKyl1H+j9TJwnLF5W7Thn+vC9PEluXd5VvLlb8s3RMGVy7Vb65BtLceoaDsasTbfLgFP0MnfrcZ/LAsreeaR/Cz4epfOO4H1x4RNL0Xl8vV5uffKaPsLORKt8Umf15OrdaP0HlrvNp+wKvea31LQLDCJiPT7L5HB0viziVc1jf1riQW+SOUfYZOolh7TkV/1lRTJ/T2VvG9vuCxHCYWr+ramWKSW0xoVdHbquTlEdOJXpdqYQdMeG3q207HZOt9XvZ+TXwJHdR7s6b7AuEyy1Q+yImy4eIC84nX32lTlKHmc8pyPg/zwJu+TukK+4LRJ1xO7CiSvtzhFXB6WT1OjrCj7l55NIfNA/hS/Y/Eg9LMwsvldy2JciG74SFm7HXqkyX/fL01fp05FpUh9wqcomy5ZbqJD4Tff0dy58wNL8vuAQLnRckkl1Rq6krqudWTNprscC+IIm4Ur8rZ7X0ZsnlvlZ6dWru0t5d5fwRDPZ/5dTzR3jg+ZzK8RDrGSY+cF9IR8tRqMnX+irUMMYDEVrcqp+nM0+nbqWAq2yHstFa2URaHjidEUXsDa8xuFrvxL5GkSd+zF0IhTGxwTb5AhmE2r6UbfhCemuwp1xtGZNyfK0fg52yjVLPjrwTg05XTan1Y0h8ppAaExKSMm/N8BIwDbZGmXK1vkkQ+wJNMtfjlEQzMLrOS7TIHINs9WNh0dFga5A5RekmJ9wijU6aZQqpt9aPQTSy0Coz4IhiSVKtMhufAydaZTa+nWpCRgEyCwEZlb8hI2yCutUFJlRYa5n3aipMLdLLySSVE3SSN6qyQUQ5hjrNJieiWodlC8qQBwPqSY0g+5FIlQmpqGIlGfIERafMATKQgQxkIAOZXyBD3kVRT4EFecBaqTLkifZpHRkvlt2U6q9kREhEyVCVcUsiKlZ3rQu2AB5F6zRKzItq7cDRz6hAZiEgowKZhYCMCmQWAjIqf0PGy+JupPoAimiIqLh1Q7GWRFS2zkbTXKcFaA25mMzvas4gAxnIQAYykMFtwIEy5+LQyUl99klIIqqQqkx6IqLO68gI1++m/Z6cmojyW89DJw0R5a5z63wDIKMCmYWAjApkFgIyKpBZCMiojH+s0X6c2wmTDFB4viDQIwNWeqzRyp1ODo9dc019rpJbj/1meqA+/4x+xh30Iq388dDA5v1MT6fpcr+0/I/TI/MhbTNkIAMZyEAGMrNkeu5pjpLZ/LFGGXVj+e8yuRqg7nOeMr5FJJMrPdbYQ0um9eqT+F1mGB8i0xpZTQkZyLyODBnIdAMZamTIQKYbyFAjQwYy3UCGGhkykOkGMtTIkIFMN5ChRt7ZYjDte5qkTO5+Dc9pa5U5W8MJLtTIaspLMCJl642nWt7WOAlSRlNKyGgZGTJ8SshoGRkyfErIaBkZMnzKvygT7/bzeb1Bqz0lAAAAAAAAAAAAhvEP9bOC5GsG5bgAAAAASUVORK5CYII='/>
                                          {productsList.department.title}</span><span>
                                            <img 
                                              width={30} 
                                              height={30} 
                                              src="data:image/png;base64,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"
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
                                                View
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
