function NotFound() {
  return (
    <div className="container py-5 mt-2">
      <div className="row text-center justify-content-center">
        <div className="col-lg-8">
          <h1
            className="mb-3"
            style={{
              fontSize: "2rem",
              fontWeight: "500",
              color: "#424242",
            }}
          >
            404 Not Found
          </h1>

          <p
            className="mb-4"
            style={{
              fontSize: "1.25rem",
              color: "#666",
            }}
          >
           We couldn’t find the page you were looking for.
          </p>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
