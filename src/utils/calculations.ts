export interface CalculationResult {
  hargaDasar: number;
  dp: number;
  margin: number;
  tenor: number;
  hargaSetelahMargin: number;
  cicilanPerBulan: number;
  totalPembayaran: number;
}

export interface ReverseResult {
  type: 'price' | 'tenor' | 'margin';
  value: number;
  cicilanPerBulan: number;
  tenor: number;
}

export function calculateCredit(
  hargaMotor: number,
  marginPersen: number,
  dpPersen: number,
  tenorBulan: number
): CalculationResult {
  const dp = Math.round(hargaMotor * (dpPersen / 100));
  const margin = Math.round(hargaMotor * (marginPersen / 100));
  const jumlahKredit = hargaMotor - dp;
  const hargaSetelahMargin = jumlahKredit + margin;
  const cicilanPerBulan = Math.round(hargaSetelahMargin / tenorBulan);
  const totalPembayaran = dp + hargaSetelahMargin;

  return {
    hargaDasar: hargaMotor,
    dp,
    margin,
    tenor: tenorBulan,
    hargaSetelahMargin,
    cicilanPerBulan,
    totalPembayaran,
  };
}

export function findMaxPrice(
  cicilanPerBulan: number,
  marginPersen: number,
  dpPersen: number,
  tenorBulan: number
): number {
  const totalFromCicilan = cicilanPerBulan * tenorBulan;
  const faktorMargin = 1 + marginPersen / 100;
  const jumlahKredit = totalFromCicilan / faktorMargin;
  const maxPrice = Math.round(jumlahKredit / (1 - dpPersen / 100));

  return maxPrice;
}

export function findRequiredTenor(
  hargaMotor: number,
  cicilanPerBulan: number,
  marginPersen: number,
  dpPersen: number
): number {
  const dp = hargaMotor * (dpPersen / 100);
  const margin = hargaMotor * (marginPersen / 100);
  const jumlahKredit = hargaMotor - dp;
  const hargaSetelahMargin = jumlahKredit + margin;
  const tenor = Math.ceil(hargaSetelahMargin / cicilanPerBulan);

  return tenor;
}

export function findRequiredMargin(
  hargaMotor: number,
  cicilanPerBulan: number,
  dpPersen: number,
  tenorBulan: number
): number {
  const dp = hargaMotor * (dpPersen / 100);
  const totalFromCicilan = cicilanPerBulan * tenorBulan;
  const jumlahKredit = hargaMotor - dp;
  const marginNeeded = totalFromCicilan - jumlahKredit;
  const marginPersen = (marginNeeded / jumlahKredit) * 100;

  return Math.max(0, Math.round(marginPersen * 100) / 100);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
