import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const SellerNotification = () => {
  const [notification, setNotification] = useState([
    {
      id: 1,
      title: "New Order Created",
      message:
        "A new Order has been created by the customer. Please go to the mange order page to view the details and perform actions.",
      type: "order-created",
    },
    {
      id: 1,
      title: "New Order Created",
      message:
        "A new Order has been created by the customer. Please go to the mange order page to view the details and perform actions.",
      type: "order-created",
    },
    {
      id: 1,
      title: "New Order Created",
      message:
        "A new Order has been created by the customer. Please go to the mange order page to view the details and perform actions.",
      type: "order-created",
    },
    {
      id: 1,
      title: "New Order Created",
      message:
        "A new Order has been created by the customer. Please go to the mange order page to view the details and perform actions.",
      type: "order-created",
    },
  ]);

  return (
    <>
      <div className="notification-div">
        {notification.map((item) => (
          <Alert variant="success" key={item.id}>
            <Alert.Heading>{item.title}</Alert.Heading>
            <p>
              A new Order has been created by the customer. Please go to the{" "}
              <Link to="/seller/manage-orders" className="notification-link">
                mange order page
              </Link>{" "}
              to view the details and perform actions.
            </p>
            <hr />
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-success">Go to Page</Button>
              <Button variant="outline-danger">Mark As Read</Button>
            </div>
          </Alert>
        ))}
      </div>
    </>
  );
};
