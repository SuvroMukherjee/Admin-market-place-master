import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import newlogo from '../../assets/zoofilogo.png'
import blackzofi from "../../assets/blackzofi.png";

const Header = () => {

    const navigate = useNavigate()
  return (
    <div>
      <header className="seller-header">
        <nav className="navbar navbar-expand-md">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img src={blackzofi} alt="newlogo" width={150} />
            </a>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link cursor"
                  onClick={() => navigate("./login")}
                >
                  Member
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
                        d="M260.52 329.539a24 24 0 0 0 33.941 33.941l90.51-90.51a24 24 0 0 0 0-33.941l-90.51-90.509a24 24 0 0 0-33.941 0 24 24 0 0 0 0 33.941L310.059 232H48a24 24 0 0 0-24 24 24 24 0 0 0 24 24h262.059z"
                        fill="#000000"
                        opacity={1}
                        data-original="#000000"
                        className=""
                      />
                      <path
                        d="M448 24H224a40 40 0 0 0-40 40v32a24 24 0 0 0 48 0V72h208v368H232v-24a24 24 0 0 0-48 0v32a40 40 0 0 0 40 40h224a40 40 0 0 0 40-40V64a40 40 0 0 0-40-40z"
                        fill="#000000"
                        opacity={1}
                        data-original="#000000"
                        className=""
                      />
                    </g>
                  </svg>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link cursor"
                  onClick={() => navigate("./seller-login")}
                >
                  Seller
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
                        d="M260.52 329.539a24 24 0 0 0 33.941 33.941l90.51-90.51a24 24 0 0 0 0-33.941l-90.51-90.509a24 24 0 0 0-33.941 0 24 24 0 0 0 0 33.941L310.059 232H48a24 24 0 0 0-24 24 24 24 0 0 0 24 24h262.059z"
                        fill="#000000"
                        opacity={1}
                        data-original="#000000"
                        className=""
                      />
                      <path
                        d="M448 24H224a40 40 0 0 0-40 40v32a24 24 0 0 0 48 0V72h208v368H232v-24a24 24 0 0 0-48 0v32a40 40 0 0 0 40 40h224a40 40 0 0 0 40-40V64a40 40 0 0 0-40-40z"
                        fill="#000000"
                        opacity={1}
                        data-original="#000000"
                        className=""
                      />
                    </g>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header