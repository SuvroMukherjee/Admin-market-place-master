import Button from "react-bootstrap/Button";
import { Card, Row, Col, Table } from "react-bootstrap";
import React from "react";

export const AmountWithGst = ({ ele }) => {
  const getApplicableTaxType = (stateOfSupply, stateOfDelivery) => {
    return stateOfSupply.trim().toLowerCase() ===
      stateOfDelivery.trim().toLowerCase()
      ? "SGSTCGST"
      : "IGST";
  };

  const calculateTax = (amount, taxPercent) => {
    return ((amount * taxPercent) / 100).toFixed(2);
  };

  const getAmount = (
    withTaxAmount,
    cgstPercent,
    sgstPercent,
    igstPercent,
    applicableTaxType
  ) => {
    if (applicableTaxType === "SGSTCGST") {
      const totalGstPercent = cgstPercent + sgstPercent;
      return ((withTaxAmount * 100) / (100 + totalGstPercent)).toFixed(2);
    }
    if (applicableTaxType === "IGST") {
      return ((withTaxAmount * 100) / (100 + igstPercent)).toFixed(2);
    }
  };

  const stateOfSupply = ele?.sellerId?.Shop_Details_Info?.state ?? "";
  const stateOfDelivery = ele?.orderId?.addressId?.state ?? "";
  const applicableTaxType = getApplicableTaxType(
    stateOfSupply,
    stateOfDelivery
  );

  const shippingCharge =
    ele?.orderId?.order_details[0]?.total_shipping_price ?? 0;
  const withTaxAmount = ele?.totalAmount - shippingCharge;
  const cgstPercent =
    ele?.orderId?.order_details[0]?.proId?.categoryId?.cgst || 0;
  const sgstPercent =
    ele?.orderId?.order_details[0]?.proId?.categoryId?.sgst || 0;
  const igstPercent =
    ele?.orderId?.order_details[0]?.proId?.categoryId?.igst || 0;

  const withOutTaxAmount = getAmount(
    withTaxAmount,
    cgstPercent,
    sgstPercent,
    igstPercent,
    applicableTaxType
  );
  const cgst = calculateTax(withOutTaxAmount, cgstPercent);
  const sgst = calculateTax(withOutTaxAmount, sgstPercent);
  const igst = calculateTax(withOutTaxAmount, igstPercent);

  const [show, setShow] = React.useState(false);

  return (
    <>
      <p>₹ {withOutTaxAmount}</p>

      <p onClick={() => setShow(!show)} className="shwTx">{show ? "Hide" : "Show"} Break Up</p>
      {show && (
        <>
          <Table striped bordered hover size="sm" className="mb-4">
            <tbody>
              <tr>
                <td>Order Amount</td>
                <td className="text-end">₹{withTaxAmount}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td className="text-end">₹{shippingCharge}</td>
              </tr>
              <tr>
                <td>
                  <strong>Invoice Amount</strong>
                </td>
                <td className="text-end">
                  <strong>₹{ele?.totalAmount}</strong>
                </td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover size="sm">
            <tbody>
              <tr>
                <td>Amount (Without Tax)</td>
                <td className="text-end">₹{withOutTaxAmount}</td>
              </tr>
              {applicableTaxType === "SGSTCGST" && (
                <>
                  <tr>
                    <td>CGST ({cgstPercent}%)</td>
                    <td className="text-end">₹{cgst}</td>
                  </tr>
                  <tr>
                    <td>SGST ({sgstPercent}%)</td>
                    <td className="text-end">₹{sgst}</td>
                  </tr>
                </>
              )}
              {applicableTaxType === "IGST" && (
                <tr>
                  <td>IGST ({igstPercent}%)</td>
                  <td className="text-end">₹{igst}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};
