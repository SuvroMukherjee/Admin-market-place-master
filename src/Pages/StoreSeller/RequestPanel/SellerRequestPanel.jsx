import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SellerRequestPanel = () => {

    const navigate = useNavigate();

    const handleClick = (type) => {
        if(type == 'product'){
            navigate("/seller/seller-ownproduct-status/new-add");
        }
        if(type == 'category'){
            navigate("/seller/category-request/");
        }

        if(type == 'subCategory'){
            navigate("/seller/subcategory-request/");
        }

        if(type == 'brand'){
            navigate("/seller/brand-request/");
        }

        if(type == 'track'){
            navigate("/seller/approval-request-list/");
        }

    };

  return (
    <div className="mx-4 px-4">
      <Row className="mt-4 text-left">
        <h5>Seller - Request Panel</h5>
      </Row>
      <Row className="mt-4 d-flex justify-content-start items-center gap-4">
        <Col className="text-center" size={4} >
          <Card className="bcard" style={{height:'300px',width:'400px'}} onClick={()=>handleClick('product')}>
            <Card.Header className="text-center">
              Request New Product
            </Card.Header>
            <Card.Body className="mt-2">
              <Row className="me-2">
                <Col className="cmpgin-sub-title">
                  List products that are not currently in Zoofi's catalogue
                </Col>
              </Row>
              <Row className="mb-2 mt-2">
                <Col className="" xs={12} sm={12} md={12} lg={12} xl={12}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQllsJ4BCNe77dUbi9-VuCtcT0T0reMsgtd5lRPTompGHqOk7bvmERmMKPwj2jxkGQ0fFE&usqp=CAU"
                    className="reqImgN"
                    alt="cmp_img"
                   
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="text-center" size={4}>
          <Card className="bcard2" style={{height:'300px',width:'400px'}} onClick={()=>handleClick('category')}>
            <Card.Header className="text-center">
              Request New Category
            </Card.Header>
            <Card.Body className="mt-2">
              <Row className="me-2">
                <Col className="cmpgin-sub-title2">
                  List categories that are not currently in Zoofi's Selling Categories
                </Col>
              </Row>
              <Row className="mb-2 mt-2">
                <Col className="text-center">
                  <img
                    src="https://img.freepik.com/free-photo/3d-cartoon-beauty-products_23-2151503319.jpg"
                    className="reqImgN"
                    alt="cmp_img"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="text-center" size={4}>
          <Card className="bcard3" style={{height:'300px',width:'400px'}} onClick={()=>handleClick('subCategory')}>
            <Card.Header className="text-center">
              Request New SubCategory
            </Card.Header>
            <Card.Body className="mt-2">
              <Row className="me-2">
                <Col className="cmpgin-sub-title3">
                  List subCategories that are not currently in Zoofi's Selling SubCategories
                </Col>
              </Row>
              <Row className="mb-2 mt-2">
                <Col className="text-center">
                  <img
                    src="https://www.mothersfoods.in/uploads/media/Mothers%20Food%20Prodcuts%20ALL%20PRODUCT%201600x900%20copy61d68f336a040.jpg"
                    className="reqImgN"
                    alt="cmp_img"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="text-center" size={4}>
          <Card className="bcard4" style={{height:'300px',width:'400px'}} onClick={()=>handleClick('brand')}>
            <Card.Header className="text-center">
              Request New Brand
            </Card.Header>
            <Card.Body className="mt-2">
              <Row className="me-2">
                <Col className="cmpgin-sub-title4">
                  List brands that are not currently in Zoofi's Selling Brands
                </Col>
              </Row>
              <Row className="mb-2 mt-2">
                <Col className="text-center">
                  <img
                    src="https://graphicsprings.com/wp-content/uploads/2023/08/image-112.png"
                     className="reqImgN"
                    alt="cmp_img"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col className="text-center" size={4}>
          <Card className="bcard5" style={{height:'300px',width:'400px'}} onClick={()=>handleClick('track')} >
            <Card.Header className="text-center">
              Track Your Request Applications
            </Card.Header>
            <Card.Body className="mt-2">
              <Row className="me-2">
                <Col className="cmpgin-sub-title5">
                  Please track your request applications here
                </Col>
              </Row>
              <Row className="mb-2 mt-2">
                <Col className="text-center">
                  <img
                    src="https://c8.alamy.com/comp/2D1X2RX/application-form-submit-flat-style-design-icon-sign-vector-illustration-2D1X2RX.jpg"
                    className="reqImgN"
                    alt="cmp_img"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col size={4}>
        
        </Col>
      </Row>
    </div>
  );
};

export default SellerRequestPanel;
