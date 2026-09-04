function Education(){
    return(
        <div className="container">
            <div className="row">
                <div className="col col-12 col-lg-6 mb-2">
                  <img src="media/education.svg" alt="varsity" style={{width:"70%"}} />
                </div>
                <div className="col col-12 col-lg-6 p-5">
               <h1 className="mb-3 fs-2">Free and open market education</h1>
              <p className="mt-5">Varsity, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
              <a href="" style={{ textDecoration: "none" }}>
          Versity<i className="fa-solid fa-arrow-right"></i>
          </a>
          <p className="mt-5">Trading Q&A, the most active trading and investment community in India for all your market related queries.</p>
          <a href="" style={{ textDecoration: "none" }}>
          TradingQ&A <i className="fa-solid fa-arrow-right"></i>
          </a>
                </div>
            </div>
        </div>
    );
}
export default Education;