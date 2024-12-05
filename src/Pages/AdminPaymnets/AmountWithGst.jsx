export const AmountWithGst = ({ ele }) => {
  const getApplicableTaxType = (stateOfSupply, stateOfDelivery) => {
    if (
      stateOfSupply.trim().toLowerCase() ===
      stateOfDelivery.trim().toLowerCase()
    ) {
      return "SGSTCGST";
    } else {
      return "IGST";
    }
  };

  const getCGST = (withOutTaxAmount, cgstPercent) => {
    const cgstAmount = (withOutTaxAmount * cgstPercent) / 100;
    return cgstAmount.toFixed(2);
  };

  const getSGST = (withOutTaxAmount, sgstPercent) => {
    const sgstAmount = (withOutTaxAmount * sgstPercent) / 100;
    return sgstAmount.toFixed(2);
  };

  const getIGST = (withOutTaxAmount, igstPercent) => {
    const igstAmount = (withOutTaxAmount * igstPercent) / 100;
    return igstAmount.toFixed(2);
  };

  const getAmount = (
    withTaxAmount, // 100
    cgstPercent, // 9
    sgstPercent, // 9
    igstPercent, // 18
    applicableTaxType // SGSTCGST
  ) => {
    if (applicableTaxType === "SGSTCGST") {
      // withTaxAmount = amount + cgst + sgst
      // amount = withTaxAmount - cgst - sgst
      const totalGstPercent = cgstPercent + sgstPercent;
      const amount = (withTaxAmount * 100) / (100 + totalGstPercent);
      return amount.toFixed(2); // Exclude tax amount
    }

    if (applicableTaxType === "IGST") {
      // withTaxAmount = amount + igst
      // amount = withTaxAmount - igst
      const amount = (withTaxAmount * 100) / (100 + igstPercent);
      return amount.toFixed(2);
    }
  };

  const stateOfSupply = ele?.sellerId?.Shop_Details_Info?.state ?? "";
  const stateOfDelivery = ele?.orderId?.addressId?.state ?? "";
  const applicableTaxType = getApplicableTaxType(
    stateOfSupply,
    stateOfDelivery
  );
  const shippingCharge = ele?.orderId?.order_details[0]?.total_shipping_price;
  const withTaxAmount = ele?.totalAmount - shippingCharge;
  const cgstPercent = ele?.orderId?.order_details[0]?.proId?.categoryId?.cgst;
  const sgstPercent = ele?.orderId?.order_details[0]?.proId?.categoryId?.sgst;
  const igstPercent = ele?.orderId?.order_details[0]?.proId?.categoryId?.igst;
  const withOutTaxAmount = getAmount(
    withTaxAmount,
    cgstPercent,
    sgstPercent,
    igstPercent,
    applicableTaxType
  );
  const cgst = getCGST(withOutTaxAmount, cgstPercent);
  const sgst = getSGST(withOutTaxAmount, sgstPercent);
  const igst = getIGST(withOutTaxAmount, igstPercent);

  return (
    <>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          flexDirection: "column",
          justifyContent: "center",
          whiteSpace: "nowrap",
        }}
      >
        <span>{ele?.totalAmount?.toLocaleString("en-IN")}</span>
        <span>
          {`₹${withOutTaxAmount}`}
          {applicableTaxType === "SGSTCGST" && `+ ₹${cgst} (CGST)`}
          {applicableTaxType === "SGSTCGST" && `+ ₹${sgst} (SGST)`}
          {applicableTaxType === "IGST" && `+ ₹${igst} (IGST)`}
        </span>
      </span>
    </>
  );
};
