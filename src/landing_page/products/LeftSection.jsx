function LeftSection({
  imageUrl,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  learnMoreText,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container py-2 py-lg-5">
      <div className="row align-items-center">
        {/* Left Image */}
        <div className="col-12 col-lg-6 p-3 p-lg-5 text-center d-flex justify-content-center align-items-center">
          <img
            src={imageUrl}
            alt={productName}
            className="img-fluid"
            style={{
              maxHeight: "420px",
              width: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Right Content */}
        <div className="col-12 col-lg-6 px-3 px-lg-5 py-2 py-lg-4">
          <h1>{productName}</h1>

          <p
            className="mt-3 fs-6"
            style={{
              lineHeight: "30px",
              color: "#666666",
              fontWeight: 400,
              marginBottom: "32px",
            }}
          >
            {productDescription}
          </p>

          <div className="d-flex flex-column flex-md-row gap-3 gap-md-5 mb-4">
            {tryDemo && (
              <a
                href={tryDemo}
                className="text-primary text-decoration-none"
              >
                Try Demo <i className="fas fa-arrow-right"></i>
              </a>
            )}

            {learnMore && (
              <a
                href={learnMore}
                className="text-primary text-decoration-none"
              >
                {learnMoreText || "Learn More"}{" "}
                <i className="fas fa-arrow-right"></i>
              </a>
            )}
          </div>

          {(googlePlay || appStore) && (
            <div className="mt-3 d-flex flex-wrap gap-3">
              {googlePlay && (
                <a href={googlePlay} className="text-decoration-none">
                  <img
                    src="media/googlePlayBadge.svg"
                    alt="Google Play"
                    className="img-fluid"
                    style={{ maxWidth: "160px" }}
                  />
                </a>
              )}

              {appStore && (
                <a href={appStore} className="text-decoration-none">
                  <img
                    src="media/appstoreBadge.svg"
                    alt="App Store"
                    className="img-fluid"
                    style={{ maxWidth: "160px" }}
                  />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeftSection;