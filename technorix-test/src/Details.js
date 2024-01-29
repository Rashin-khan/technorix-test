import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJobDetails } from './ApiCall';
import UserContext from './Context';
import { DepartmentLogo, LocationLogo } from './helper';

const Details = () => {
    const {state} = useContext(UserContext);
    const [details, setDetails] = useState(null);
    useEffect(() => {
        console.log(state)
        async function fecthJobDetails() {
            const res = await getJobDetails(state);
            console.log(res)
            setDetails(res);
        }
        fecthJobDetails();
    }, [])
    return (
      <div className='jw-widget-container'>
            <div class="jw-job-detail-container">
                <section class="jw-header">
                    <p class="jw-division"></p>
                    <h1 class="jw-section-title">{details?.title}</h1>
                    <div class="jw-brief-details">
                        <span>
                        <img className='icon-department' width={30} height={30} src={DepartmentLogo}/>{details?.department?.title}
                        </span>
                        <span>
                        <img className='icon-department' width={30} height={30} src={LocationLogo}/>Verna, Goa
                        </span>
                        <span>
                        <label class="jw-label-bordered">Full Time</label>
                        </span>
                    </div>
                    <div class="jw-primary-actions">
                        <a href={details?.applyUrl} target="_blank" class="jw-btn-primary">Apply</a>
                    </div>
                </section>
                <br />
                <br class="jw-hr"/>
                <br/>
                
                <section class="jw-job-details">
                    <div class="jw-description-col">
                    <div
                        dangerouslySetInnerHTML={{__html: details?.description}}
                    />
                </div>
                </section></div>
            </div>
                );
  }
export default Details;