import { useNavigate } from "react-router-dom";
import OrderCmpl from "../../assets/order-complete.jpg";
import sellerProList from "../../assets/product-listing.png";
import quoteLeft from "../../assets/quote-left.png";
import sellerReg from "../../assets/register-now.jpg";
import sellerspeacking from "../../assets/seller-speaking.jpg";
import seller from "../../assets/seller.jpg";
import sellerBg from "../../assets/seller-bg.png";
import sellerShip from "../../assets/storage-shipping.jpg";
import { ScrollToTop } from "../../components/scrollToTop/ScrollToTop";
import Footer from "./Footer";
import Header from "./Header";
import aboutVideo from "../../assets/videos/about.mp4";
import { FaAngleRight } from "react-icons/fa";
import "./style.css";
import "./swiper-bundle.min.css";

const FrontPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <ScrollToTop />
      <Header />
      <div>
        <div className="page-content">
          <section className="seller-banner-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="banner-content-text">
                    <h2>Become a proud Zoofi seller</h2>
                    <p>
                      Start your selling journey on Zoofi and become a part of
                      our Seller community
                    </p>
                    <a
                      className="banner-cta cursor"
                      onClick={() => navigate("./seller-registration")}
                    >
                      Register Now
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="banner-content-img">
                    <img src={sellerBg} alt="seller" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <div className="container-fluid container-padding">
              <div className="about-heading">
                <h2>Welcome To <span>Zoofi</span></h2>
              </div>

              <div className="row">
                <div className="col-xl-7 col-lg-6 col-12">
                  <div className="video-holder">
                    <video loop autoPlay muted>
                      <source src={aboutVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-6 col-12">
                  <div className="right-content">
                    <p className="text-holder">
                        Welcome to Zoofi! Your one-stop destination for homegrown products and passionate local sellers. <br/><br/>
                        We aim to empower local businesses and offer customers the best value with high-quality, affordable options.
                    </p>
                    <a  className="cta-view" onClick={() => navigate(`/policy/about-us`)}>
                      About Us
                      <FaAngleRight />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="why-best-section">
            <div className="container">
              <div className="row section-heading">
                <div className="col-12">
                  <h3>Why choose Zoofi ?</h3>
                </div>
              </div>
              <div className="row why-content">
                <div className="col-lg-4 col-12">
                  <div className="card why-card">
                    <div className="card-img">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={512}
                        height={512}
                        x={0}
                        y={0}
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        className=""
                      >
                        <g>
                          <circle
                            cx={256}
                            cy="119.631"
                            r={87}
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                          <circle
                            cx={432}
                            cy="151.63"
                            r={55}
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                          <circle
                            cx={80}
                            cy="151.63"
                            r={55}
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                          <path
                            d="M134.19 256.021c-21.65-17.738-41.257-15.39-66.29-15.39-37.44 0-67.9 30.28-67.9 67.49v109.21c0 16.16 13.19 29.3 29.41 29.3 70.026 0 61.59 1.267 61.59-3.02 0-77.386-9.166-134.137 43.19-187.59z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                          <path
                            d="M279.81 241.03c-43.724-3.647-81.729.042-114.51 27.1-54.857 43.94-44.3 103.103-44.3 175.48 0 19.149 15.58 35.02 35.02 35.02 211.082 0 219.483 6.809 232-20.91 4.105-9.374 2.98-6.395 2.98-96.07 0-71.226-61.673-120.62-111.19-120.62zM444.1 240.63c-25.17 0-44.669-2.324-66.29 15.39C429.775 309.076 421 361.955 421 443.61c0 4.314-7.003 3.02 60.54 3.02 16.8 0 30.46-13.61 30.46-30.34V308.12c0-37.21-30.46-67.49-67.9-67.49z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="card-body">
                      <div className="card-title">Zoofi: The Heart of Local Shopping</div>
                      <div className="card-text">
                        Empowering local sellers and celebrating Make-in-India products.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="card why-card">
                    <div className="card-img">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={512}
                        height={512}
                        x={0}
                        y={0}
                        viewBox="0 0 512 512"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        className=""
                      >
                        <g>
                          <path
                            d="M63.633 422 0 358.367l192.997-193 90 90 103.945-103.945-30.454-30.425L512 90l-31 155.509-30.425-30.454-167.578 167.578-90-90z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="card-body">
                      <div className="card-title">Zoofi: Your Gateway to Local Excellence</div>
                      <div className="card-text">
                      Discover unique products crafted with passion, right here in India.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="card why-card">
                    <div className="card-img">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={512}
                        height={512}
                        x={0}
                        y={0}
                        viewBox="0 0 32 32"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        className=""
                      >
                        <g>
                          <g data-name="40-Fast-delivery">
                            <path
                              d="m29.91 15.6-2.21-5a1 1 0 0 0-.91-.6h-5.35l.32-2.89a1 1 0 0 0-.25-.78 1 1 0 0 0-.74-.33H7a1 1 0 0 0 0 2h5a1 1 0 0 1 0 2H5a1 1 0 0 0 0 2h10a1 1 0 0 1 0 2H8a1 1 0 0 0 0 2h4a1 1 0 0 1 0 2H4a1 1 0 0 0 0 2h2a1 1 0 0 1 0 2H5a1 1 0 0 0 0 2h2.85a2.78 2.78 0 0 0 .6 1.14 2.58 2.58 0 0 0 1.93.86 3.13 3.13 0 0 0 2.83-2h7.64a2.78 2.78 0 0 0 .6 1.14 2.58 2.58 0 0 0 1.93.86 3.13 3.13 0 0 0 2.83-2h2a1 1 0 0 0 1-.89l.77-7a.89.89 0 0 0-.07-.51zM10.38 24a.55.55 0 0 1-.44-.19.9.9 0 0 1-.19-.7A1.23 1.23 0 0 1 10.83 22a.55.55 0 0 1 .44.19.9.9 0 0 1 .19.7A1.23 1.23 0 0 1 10.38 24zm13 0a.55.55 0 0 1-.44-.19.9.9 0 0 1-.19-.7A1.23 1.23 0 0 1 23.83 22a.55.55 0 0 1 .44.19.9.9 0 0 1 .19.7A1.23 1.23 0 0 1 23.38 24zm4.5-7h-4.42a1 1 0 0 1-.74-.33 1 1 0 0 1-.25-.78l.33-3a1 1 0 0 1 1-.88h2.33L28 16.16z"
                              fill="#9af064"
                              opacity={1}
                              data-original="#000000"
                              className=""
                            />
                            <path
                              d="M4 16a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2z"
                              fill="#9af064"
                              opacity={1}
                              data-original="#000000"
                              className=""
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div className="card-body">
                      <div className="card-title">Shop Smart, Shop Local with Zoofi</div>
                      <div className="card-text">
                      Connecting you to authentic, homegrown treasures from Indian sellers.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="card why-card">
                    <div className="card-img">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={512}
                        height={512}
                        x={0}
                        y={0}
                        viewBox="0 0 64 64"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        className=""
                      >
                        <g>
                          <path
                            d="M59.997 19.995c.17-8.591-7.42-16.162-15.999-15.992-14.15-.03-21.349 17.352-11.31 27.303 9.96 10.05 27.34 2.84 27.31-11.311zm-21.619-1.28c-1.312-.019-1.318-1.981 0-2h6.32c-.42-1.28-1.62-2.221-3.04-2.221h-3.28c-.56 0-1-.45-1-1s.44-1 1-1h11.24c1.313.021 1.318 1.978 0 2h-3.89c.51.64.88 1.39 1.04 2.22h2.85c1.312.02 1.318 1.98 0 2h-2.85c-.482 2.648-3.01 4.46-5.73 4.22l5.49 4.811c.987.849-.327 2.37-1.31 1.5l-7.5-6.56c-.705-.562-.233-1.78.66-1.75h3.28c1.42 0 2.62-.94 3.04-2.22h-6.32zM13.25 32.996H5c-.55 0-1 .45-1 1v20.922c0 .55.45 1 1 1h8.25c.56 0 1-.45 1-1V33.996c0-.55-.44-1-1-1zm-4.12 7.44c-1.32-.02-1.31-1.98 0-2 1.31.03 1.31 1.98 0 2zM54.964 42.069l-8.499 2.47c-.294 2.94-2.966 5.336-5.92 5.29h-9.848c-1.31-.025-1.316-1.974 0-2h9.849c5.496-.34 5.126-7.91-.46-7.93h-7.27c-.599 0-1.189-.17-1.689-.49-2.444-1.532-5.507-3.922-8.569-3.72H16.25v17.56c.28.03.55.12.8.27l7.72 4.5C27.027 59.34 29.556 60 32.086 60c2.12 0 4.24-.46 6.22-1.4l19.436-9.2c4.31-2.126 1.85-8.593-2.78-7.331z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="card-body">
                      <div className="card-title">Think Local, Shop Zoofi</div>
                      <div className="card-text">
                      Transforming how you support Indian businesses, one purchase at a time.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="card why-card">
                    <div className="card-img">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 64 64" xml:space="preserve" class=""><g><path d="M56.73 18.6c-4.69-2.89-7.91 4.78-12.09 3.61-1.37-.38.02-2.56-2.23-2.46-5.87.26-5.07 3.33-8.68 2.71-3.73-.64-2.62-2.49-6.21-5.83-1.31-.44-4.19-1.31-2.91-3.12 1.44-.28 1.11-1.76.62-2.71-.2-1.53 2.85-1.81 2.78-3.36-.09-2.2-3.68-.42-4.73-.65-2.33-.51-3-3.61-5.77-2.77-3.53 1.11-4.13 1.01-2.35 2.89.68.71.94 1.71.77 2.67-.81 4.43 3.91.89.29 6.99-.35.59-.84 1.07-1.35 1.52-1.72 1.49-2.13 4.46-4.98 3.95-3.34.81 1.62 4.6.11 6.82-.66 1.02-2.24-.96-3.46.68-1.15 1.55 1.22 2.09 2.43 2.6.61.25.73 1.1.22 1.51l-.02.02c-.46.36-.46 1.08-.02 1.46 2.94 2.54 3.29-2.28 5.4-1.2.43.54-.15 1.26-.53 1.84-.91 1.39-.58 3.25-.05 4.82.95 2.08 1.15 4.17.88 6.34.19.75.99 1.2 1.33 1.89 1.98 7.32 4.3 15.42 8.82 8.38 1.22-1.91 1.91-4.12 2.05-6.38.46-7.68 6.9-3.02 8.01-10.06.26-1.66 1.13-2.76 2.04-3.24.92-.48 1.79-1.05 2.44-1.86 1.39-1.72 1.71-.66 4.04-1.57 1.19-1.47-1.49-2.67-.93-4.03.64-1.56-.67-2.33-.04-3.64.64-1.34 2.31 0 3.28.29.61.15 1.48-.03 2.13-.07 1.45-.09 1.34 1.3.78 1.8-.53.47-1.98 1.07-2.27 1.82 1.15-.06 1.44.31 2.14.47.46.11.88.38 1.06.82.42 1 1.74 1.86 3.05 1.8.26-1.59-1.25-4.34.55-5.13 1.29-1.09-.13-3.35.63-4.85.95-1.52 5.38-2.57 2.77-4.8z" fill="#9af064" opacity="1" data-original="#000000" class=""></path></g></svg>
                    </div>
                    <div className="card-body">
                      <div className="card-title">Zoofi: Celebrating Indian Innovation</div>
                      <div className="card-text">
                      A marketplace where local talent meets global possibilities
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="card why-card">
                    <div className="card-img">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={512}
                        height={512}
                        x={0}
                        y={0}
                        viewBox="0 0 128 128"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        className=""
                      >
                        <g>
                          <path
                            d="M76.7 30v14l18.4 8.2C95 35 84.6 20.2 69.8 13.6l-3.4 7.1 9.5 7.7c.5.4.8 1 .8 1.6zM86 80.1l5.9-1.4c.3-.1.6-.1.9 0l5.9 1.4v-3.7H86zM86.6 72.4h11.6l-2.1-8.5h-7.4zM116.1 72.4l-7-8.5h-8.9l2.1 8.5zM59.5 88H44.1c-.4.9-1.2 2.5-2.7 5.6 3.6 1 7.3 1.5 11.1 1.5 3.4 0 6.7-.4 9.9-1.2v-9.1L61.3 87c-.4.6-1 1-1.8 1z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                          <path
                            d="M102.7 76.4v6.2c0 .6-.3 1.2-.8 1.6-.4.3-.8.4-1.3.4h-.4l-7.9-1.8-7.9 1.8c-.6.1-1.2 0-1.7-.4s-.8-.9-.8-1.6v-6.2H66.5v39.5h51.8V76.4zm-19.4 36H72v-4h11.3zM43.5 57.1c-2.6-3-8.2-9.4-8.9-10.1-1-1.1-1.8-2 5.7-14.3L32 25.5c-.3-.3-.5-.6-.6-1 0 0-.9-3.7-1.8-7.7C17.8 24.4 10 37.6 10 52.5c0 9 2.8 17.4 7.7 24.4L23 75zM82.5 72.4l2.1-8.5h-8.9l-7 8.5z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                          <path
                            d="M74.7 59.9h19.7c.2-1.1.3-2.2.4-3.4l-21-9.4c-.7-.3-1.2-1-1.2-1.8V30.9l-9.9-8c-.7-.6-.9-1.6-.5-2.4l3.9-8.2c-4.3-1.4-8.8-2.2-13.5-2.2-7 0-13.6 1.7-19.5 4.7.8 3.4 1.6 6.8 1.9 8.2l9.1 7.9c.7.6.9 1.7.4 2.6-2.7 4.3-5.7 9.6-6.4 11.6 2.2 2.5 9.3 10.6 9.7 11 .3.4.5.9.5 1.5 0 .5-.3 1-.7 1.4L25.3 78.3c-.2.2-.4.3-.7.4l-4.4 1.6c4.6 5.3 10.5 9.5 17.3 12.1.8-1.7 1.6-3.3 2.2-4.6 1.7-3.6 1.8-3.8 3.1-3.8h15.5l3.9-7c.1-.1.1-.2.2-.3v-2.3c0-.5.2-.9.5-1.3l10.3-12.5c.4-.4.9-.7 1.5-.7z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                      Zoofi: Where Local Dreams Go Global
                      </div>
                      <div className="card-text">
                      Empowering small businesses to reach big audiences, one product at a time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="how-to-proceed-section">
            <div className="container">
              <div className="row section-heading">
                <div className="col-12">
                  <h3>How to start selling products on Zoofi</h3>
                </div>
              </div>
              <div className="row how-content">
                <div className="col-lg-3 col-12">
                  <div className="card how-card">
                    <div className="card-img">
                      <img src={sellerReg} alt="sellerReg" />
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        Step 1: Register Your Account
                        <p>Create your Zoofi account and join the marketplace revolution.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-12">
                  <div className="card how-card">
                    <div className="card-img">
                      <img src={sellerShip} alt="sellerShip" />
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        Step 2: Add Products
                        <p>Choose from Zoofi&apos;s catalogue or request to list your unique products that aren&amp;t already available.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-12">
                  <div className="card how-card">
                    <div className="card-img">
                      <img src={sellerProList} alt="sellerProList" />
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        Step 3: Manage Your Inventory
                        <p>Keep your stock updated and ready for sales with Zoofi&amp;s intuitive tools.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-12">
                  <div className="card how-card">
                    <div className="card-img">
                      <img src={OrderCmpl} alt="OrderCmpl" />
                    </div>
                    <div className="card-body">
                      <div className="card-title">
                        Step 4: Complete Orders & Grow Your Business
                        <p>Fulfill orders effortlessly and take your business to new heights.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/*<section className="seller-stories-section">
            <div className="container">
              <div className="row section-heading">
                <div className="col-12 heading-col">
                  <h3>Our seller stories</h3>
                  <div className="stories-navigation">
                    <div className="swiper-button-prev stories-swiper-button-prev">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={512}
                        height={512}
                        x={0}
                        y={0}
                        viewBox="0 0 128 128"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        className=""
                      >
                        <g transform="matrix(-1,0,0,1,128,0)">
                          <path
                            d="M64 0C28.711 0 0 28.711 0 64s28.711 64 64 64 64-28.711 64-64S99.289 0 64 0zm0 120C33.121 120 8 94.879 8 64S33.121 8 64 8s56 25.121 56 56-25.121 56-56 56zm26.828-58.828a3.997 3.997 0 0 1 0 5.656l-20 20C70.047 87.609 69.023 88 68 88s-2.047-.391-2.828-1.172a3.997 3.997 0 0 1 0-5.656L78.344 68H40c-2.209 0-4-1.789-4-4s1.791-4 4-4h38.344L65.172 46.828c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                        </g>
                      </svg>
                    </div>
                    <div className="swiper-button-next stories-swiper-button-next">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width={512}
                        height={512}
                        x={0}
                        y={0}
                        viewBox="0 0 128 128"
                        style={{ enableBackground: "new 0 0 512 512" }}
                        xmlSpace="preserve"
                        className=""
                      >
                        <g>
                          <path
                            d="M64 0C28.711 0 0 28.711 0 64s28.711 64 64 64 64-28.711 64-64S99.289 0 64 0zm0 120C33.121 120 8 94.879 8 64S33.121 8 64 8s56 25.121 56 56-25.121 56-56 56zm26.828-58.828a3.997 3.997 0 0 1 0 5.656l-20 20C70.047 87.609 69.023 88 68 88s-2.047-.391-2.828-1.172a3.997 3.997 0 0 1 0-5.656L78.344 68H40c-2.209 0-4-1.789-4-4s1.791-4 4-4h38.344L65.172 46.828c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0z"
                            fill="#9af064"
                            opacity={1}
                            data-original="#000000"
                            className=""
                          />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="swiper story-swiper">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="row">
                          <div className="col-lg-6 col-12">
                            <div className="seller-quote">
                              <img
                                src={quoteLeft}
                                alt=""
                                className="quoteLeft"
                              />
                              <h4>
                                From five members to fifteen, a little trust can
                                go a long way
                              </h4>
                              <p>
                                Rahul Joshi
                                <span>Crack of Dawn Crafts</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12">
                            <a href="#" className="story-video-link">
                              <img src={sellerspeacking} alt="Seller" />
                              <div className="action">
                                <span className="button">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    version="1.1"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="512"
                                    height="512"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 494.942 494.942"
                                  >
                                    <g>
                                      <path
                                        d="m35.353 0 424.236 247.471L35.353 494.942z"
                                        fill="#9af064"
                                        opacity="1"
                                        data-original="#000000"
                                        className="hovered-path"
                                      />
                                    </g>
                                  </svg>
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="row">
                          <div className="col-lg-6 col-12">
                            <div className="seller-quote">
                              <img
                                src={quoteLeft}
                                alt=""
                                className="quoteLeft"
                              />
                              <h4>
                                From five members to fifteen, a little trust can
                                go a long way
                              </h4>
                              <p>
                                Rahul Joshi
                                <span>Crack of Dawn Crafts</span>
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-6 col-12">
                            <a href="#" className="story-video-link">
                              <img src={sellerspeacking} alt="Seller" />
                              <div className="action">
                                <span className="button">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    version="1.1"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="512"
                                    height="512"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 494.942 494.942"
                                  >
                                    <g>
                                      <path
                                        d="m35.353 0 424.236 247.471L35.353 494.942z"
                                        fill="#9af064"
                                        opacity="1"
                                        data-original="#000000"
                                        className="hovered-path"
                                      />
                                    </g>
                                  </svg>
                                </span>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>*/}
          <section className="bottom-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-12">
                  <div className="bottom-content-left">
                    <h2>Become a proud Zoofi seller</h2>
                    <p>
                      Start your selling journey on Zoofi and become a part of
                      our Seller community
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-12">
                  <div className="bottom-content-right">
                    <a
                      className="bottom-cta cursor"
                      onClick={() => navigate("./seller-registration")}
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FrontPage;
