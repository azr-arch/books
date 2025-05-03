// import numWords from "num-words";
export function numberToWords(num: any) {
  // if (typeof num !== "number" || isNaN(num)) {
  //   return "Invalid input";
  // }

  // const [whole, fraction] = num.toString().split(".");

  // let result = numWords(parseInt(whole));

  // if (fraction) {
  //   const fractionWords = fraction
  //     .split("")
  //     .map((digit) => numWords(parseInt(digit)))
  //     .join(" ");
  //   result += " point " + fractionWords;
  // }

  return num;
}

export function isObjectEmpty(obj: {}) {
  return Object.keys(obj).length === 0;
}

export const calculateRowTotal = ({
  price,
  quantity,
  discount_percentage,
  tax_percentage,
}: any) => {
  const baseAmount = (price || 0) * (quantity || 0);
  const discountAmount = ((discount_percentage || 0) * baseAmount) / 100;
  const taxableAmount = baseAmount - discountAmount;
  const taxAmount = ((tax_percentage || 0) * taxableAmount) / 100;
  return { taxableAmount, taxAmount, grandTotal: taxableAmount + taxAmount };
};
