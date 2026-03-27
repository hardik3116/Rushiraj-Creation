export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  const getLessThanOneThousand = (n: number): string => {
    let result = '';
    if (n >= 100) {
      result += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      result += units[n] + ' ';
    }
    return result.trim();
  };

  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);

  let word = '';
  let scaleCount = 0;
  let r = rupees;
  
  if (r === 0) {
    word = 'Zero ';
  } else {
    // Extract first 3 digits
    let chunk = r % 1000;
    r = Math.floor(r / 1000);
    if (chunk > 0) {
      word = getLessThanOneThousand(chunk) + ' ';
    }
    scaleCount++;
    
    // Process remaining digits in chunks of 2
    while (r > 0) {
      chunk = r % 100;
      r = Math.floor(r / 100);
      if (chunk > 0) {
        word = getLessThanOneThousand(chunk) + ' ' + scales[scaleCount] + ' ' + word;
      }
      scaleCount++;
    }
  }

  word = word.trim() + ' Rupees';

  if (paise > 0) {
    word += ' and ' + getLessThanOneThousand(paise) + ' Paise';
  }
  
  return word + ' Only';
}
