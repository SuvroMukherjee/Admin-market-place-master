import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetProductDetails } from "../../API/api";
import "./livepreview.css";

const LivePreview = () => {
  const { id: PID } = useParams();

  const [productDetails,setProductDetails] = useState()

  useEffect(() => {
    getDetails()
  }, [])

  async function getDetails() {
    let res = await GetProductDetails(PID);
    setProductDetails(res?.data?.data)
  }

   console.log({productDetails});

  return (
    <div className="">
      <div className="main">
        <div className="page-content inner">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <ul className="breadcrumb">
                  <li>
                    <a>Home</a>
                  </li>
                  <li>
                    <a>{productDetails?.ProductData?.categoryId?.title}</a>
                  </li>
                  <li>
                    <a>{/* {productDes?.productId?.subcategoryId?.title} */}</a>
                  </li>
                  <li>
                    <a>{/* {productDes?.name} */}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
