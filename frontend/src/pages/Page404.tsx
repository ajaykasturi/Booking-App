import { Link, useLocation } from "react-router-dom";
function Page404() {
  const location = useLocation();
  console.log(location);
  return (
    <>
      <section className="bg-white dark:bg-gray-900 h-screen">
        <div className="py-1 px-4 mx-auto max-w-screen-xl lg:py-2 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <img
              className="h-auto max-w-lg mx-auto -translate-y-20"
              src="frontend/public/image.png"
              alt="image description"
            />
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              404! Page Missing.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              Sorry, we can't find that page. You'll find lots to explore on the
              home page.{" "}
            </p>
            <Link
              to="/"
              className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Page404;
