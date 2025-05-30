// src/components/JobPage/JobPage.js
import React, { useState, useEffect } from 'react';
import RightContent from './RightContent/RightContent';
import ReactPaginate from 'react-paginate';
import { PAGINATION } from '../../utils/constant';
import { getListPostService } from '../../service/userService';
import LeftBar from './LeftBar/LeftBar';
import './JobPage.scss';

const JobPage = () => {
  const [countPage, setCountPage] = useState(1);
  const [post, setPost] = useState([]);
  const [count, setCount] = useState(0);
  const [numberPage, setNumberPage] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(PAGINATION.pagerow);
  const [workType, setWorkType] = useState([]);
  const [jobType, setJobType] = useState('');
  const [salary, setSalary] = useState([]);
  const [exp, setExp] = useState([]);
  const [jobLevel, setJobLevel] = useState([]);
  const [jobLocation, setJobLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const loadPost = async (limit, offset, sortName) => {
    let arrData = await getListPostService({
      limit,
      offset,
      category_job_id: jobType,
      address_id: jobLocation.includes(',') ? '' : jobLocation, // Use address_id only if not coordinates
      salary_job_id: salary,
      category_joblevel_id: jobLevel,
      category_worktype_id: workType,
      experience_job_id: exp,
      coordinates: jobLocation.includes(',') ? jobLocation : '', // Send coordinates if selected
      sortName,
    });
    if (arrData && arrData.errCode === 0) {
      setPost(arrData.data);
      setCountPage(Math.ceil(arrData.count / limit));
      setCount(arrData.count);
    }
  };

  useEffect(() => {
    loadPost(limit, offset, false);
  }, []);

  useEffect(() => {
    loadPost(limit, offset, false);
  }, [workType, jobLevel, exp, jobType, jobLocation, salary]);

  const handleChangePage = (number) => {
    setNumberPage(number.selected);
    loadPost(limit, number.selected * limit);
    setOffset(number.selected * limit);
  };

  return (
    <main>
      <div className="slider-area">
        <div className="single-slider section-overly slider-height2 d-flex align-items-center" style={{
          backgroundImage: `url("assets/img/hero/about.jpg")`
        }}>
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="hero-cap text-center">
                  <h2>Tìm việc</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="job-listing-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-4">
              <div className="row">
                <div className="col-12">
                  <div className="small-section-tittle2 mb-45">
                    <div className="ion">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="20px" height="12px"
                      >
                        <path
                          fillRule="evenodd"
                          fill="rgb(27, 207, 107)"
                          d="M7.778,12.000 L12.222,12.000 L12.222,10.000 L7.778,10.000 L7.778,12.000 ZM-0.000,-0.000 L-0.000,2.000 L20.000,2.000 L20.000,-0.000 L-0.000,-0.000 ZM3.333,7.000 L16.667,7.000 L16.667,5.000 L3.333,5.000 L3.333,7.000 Z"
                        />
                      </svg>
                    </div>
                    <h4>Lọc công việc</h4>
                  </div>
                </div>
              </div>
              <LeftBar
                worktype={(data) => setWorkType((prev) => prev.includes(data) ? prev.filter(item => item !== data) : [...prev, data])}
                recieveSalary={(data) => setSalary((prev) => prev.includes(data) ? prev.filter(item => item !== data) : [...prev, data])}
                recieveExp={(data) => setExp((prev) => prev.includes(data) ? prev.filter(item => item !== data) : [...prev, data])}
                recieveJobType={(data) => setJobType(jobType === data ? '' : data)}
                recieveJobLevel={(data) => setJobLevel((prev) => prev.includes(data) ? prev.filter(item => item !== data) : [...prev, data])}
                recieveLocation={(data) => setJobLocation(data)}
              />
            </div>
            <RightContent count={count} post={post} />
          </div>
          <ReactPaginate
            previousLabel={'Quay lại'}
            nextLabel={'Tiếp'}
            breakLabel={'...'}
            pageCount={countPage}
            marginPagesDisplayed={3}
            containerClassName={"pagination justify-content-center pb-3"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousLinkClassName={"page-link"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakLinkClassName={"page-link"}
            breakClassName={"page-item"}
            activeClassName={"active"}
            onPageChange={handleChangePage}
          />
        </div>
      </div>
    </main>
  );
};

export default JobPage;