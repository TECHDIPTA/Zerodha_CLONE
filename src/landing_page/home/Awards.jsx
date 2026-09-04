function Awards() {
    return (
        <div className="container">
            <div className="row mt-2 align-items-center">

                <div className="col-12 col-lg-6 p-5">
                    <img
                        src="media/largestBroker.svg"
                        className="img-fluid"
                        alt="Largest Broker"
                    />
                </div>

                <div className="col-12 col-lg-6 p-5">
                    <h1>Largest stock broker in India</h1>

                    <p className="mb-5">
                        2+ million Zerodha clients contribute to over 15% of all
                        retail order volumes in India daily by trading and
                        investing in:
                    </p>

                    <div className="row">
                        <div className="col-6">
                            <ul>
                                <li>Futures and Options</li>
                                <li>Commodity derivatives</li>
                                <li>Currency derivatives</li>
                            </ul>
                        </div>

                        <div className="col-6">
                            <ul>
                                <li>Stocks & IPOs</li>
                                <li>Direct mutual funds</li>
                                <li>Bonds and Govt. Securities</li>
                            </ul>
                        </div>
                    </div>

                    <img
                        src="media/pressLogos.png"
                        className="img-fluid"
                        style={{ width: "90%" }}
                        alt="Press Logos"
                    />
                </div>

            </div>
        </div>
    );
}

export default Awards;